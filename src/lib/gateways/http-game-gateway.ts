import type { GameGateway } from '@/lib/game-gateway';
import type {
  CompleteResponse,
  CreateRoomResponse,
  GatewaySubscription,
  JoinRoomResponse,
  LeaderboardResponse,
  ReferenceTrajectories,
  RoomSnapshot,
  RoundRequest,
  RoundResolution,
  SessionSnapshot,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    if (!response.ok) {
      const problem = await response.json().catch(() => null);
      throw new Error(problem?.detail ?? `API trả về mã lỗi ${response.status}.`);
    }
    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timeout);
  }
}

export class HttpGameGateway implements GameGateway {
  createRoom(hostName: string, durationSeconds = 600) {
    return apiFetch<CreateRoomResponse>('/rooms', {
      method: 'POST',
      body: JSON.stringify({ hostName, durationSeconds }),
    });
  }

  joinRoom(roomCode: string, nickname: string, className: string) {
    return apiFetch<JoinRoomResponse>('/rooms/join', {
      method: 'POST',
      body: JSON.stringify({ roomCode, nickname, className }),
    });
  }

  startRoom(roomId: string, hostToken: string) {
    return apiFetch<RoomSnapshot>(`/rooms/${roomId}/start`, { method: 'POST' }, hostToken);
  }

  endRoom(roomId: string, hostToken: string) {
    return apiFetch<RoomSnapshot>(`/rooms/${roomId}/end`, { method: 'POST' }, hostToken);
  }

  getRoom(roomId: string, token?: string) {
    return apiFetch<RoomSnapshot>(`/rooms/${roomId}`, {}, token);
  }

  subscribeRoom(
    roomId: string,
    token: string,
    onUpdate: (room: RoomSnapshot) => void,
    onError?: (error: Error) => void,
  ): GatewaySubscription {
    let closed = false;
    let cursor: string | null = null;
    const controller = new AbortController();

    const connect = async () => {
      try {
        const response = await fetch(`${API_BASE}/rooms/${roomId}/stream`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
            ...(cursor ? { 'Last-Event-ID': cursor } : {}),
          },
          signal: controller.signal,
        });
        if (!response.ok || !response.body) throw new Error('Không thể mở luồng phòng.');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (!closed) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';
          for (const event of events) {
            const id = event.match(/^id:\s*(.+)$/m)?.[1];
            const data = event.match(/^data:\s*(.+)$/m)?.[1];
            if (id) cursor = id;
            if (data && !closed) onUpdate(JSON.parse(data) as RoomSnapshot);
          }
        }
      } catch (error) {
        if (!closed) onError?.(error instanceof Error ? error : new Error('Luồng phòng bị gián đoạn.'));
      }
    };
    void connect();
    const fallback = window.setInterval(async () => {
      if (closed) return;
      try {
        const snapshot = await this.getRoom(roomId, token);
        if (!closed) onUpdate(snapshot);
      } catch (error) {
        if (!closed) {
          onError?.(error instanceof Error ? error : new Error('Không thể đồng bộ phòng.'));
        }
      }
    }, 5000);

    return {
      close: () => {
        closed = true;
        controller.abort();
        window.clearInterval(fallback);
      },
    };
  }

  getSession(sessionId: string, playerToken: string) {
    return apiFetch<SessionSnapshot>(`/sessions/${sessionId}`, {}, playerToken);
  }

  submitRound(sessionId: string, playerToken: string, request: RoundRequest) {
    return apiFetch<RoundResolution>(
      `/sessions/${sessionId}/rounds`,
      { method: 'POST', body: JSON.stringify(request) },
      playerToken,
    );
  }

  completeSession(sessionId: string, playerToken: string) {
    return apiFetch<CompleteResponse>(
      `/sessions/${sessionId}/complete`,
      { method: 'POST' },
      playerToken,
    );
  }

  getLeaderboard(roomId: string, token?: string) {
    return apiFetch<LeaderboardResponse>(`/rooms/${roomId}/leaderboard`, {}, token);
  }

  getReferenceTrajectories() {
    return apiFetch<ReferenceTrajectories>('/reference-trajectories');
  }
}
