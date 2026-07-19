import type { GameGateway } from '@/lib/game-gateway';
import type {
  CompleteResponse,
  CreateRoomRequest,
  CreateRoomResponse,
  GatewaySubscription,
  JoinRoomRequest,
  JoinRoomResponse,
  LeaderboardResponse,
  PlayerHistoryEntry,
  ReferenceTrajectories,
  RoomPreview,
  RoomSnapshot,
  RoundRequest,
  RoundResolution,
  SessionSnapshot,
} from '@/types';

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1'
).replace(/\/+$/, '');
const SSE_RECONNECT_DELAY_MS = 1500;

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
  createRoom(request: CreateRoomRequest) {
    return apiFetch<CreateRoomResponse>('/rooms', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  getRoomPreview(roomCode: string) {
    return apiFetch<RoomPreview>(`/rooms/preview/${encodeURIComponent(roomCode)}`);
  }

  joinRoom(request: JoinRoomRequest) {
    return apiFetch<JoinRoomResponse>('/rooms/join', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  markReady(sessionId: string, playerToken: string) {
    return apiFetch<RoomSnapshot>(
      `/sessions/${sessionId}/ready`,
      { method: 'POST' },
      playerToken,
    );
  }

  startRoom(roomId: string, hostToken: string, force = false) {
    return apiFetch<RoomSnapshot>(
      `/rooms/${roomId}/start`,
      { method: 'POST', body: JSON.stringify({ force }) },
      hostToken,
    );
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
    let activeController: AbortController | null = null;
    let reconnectTimer: number | null = null;

    const connect = async () => {
      if (closed) return;
      activeController = new AbortController();
      try {
        const response = await fetch(`${API_BASE}/rooms/${roomId}/stream`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
            ...(cursor ? { 'Last-Event-ID': cursor } : {}),
          },
          signal: activeController.signal,
        });
        if (!response.ok || !response.body) {
          throw new Error('Không thể mở luồng phòng.');
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (!closed) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split(/\r?\n\r?\n/);
          buffer = events.pop() ?? '';
          for (const event of events) {
            const id = event.match(/^id:\s*(.+)$/m)?.[1];
            const data = event
              .split(/\r?\n/)
              .filter((line) => line.startsWith('data:'))
              .map((line) => line.slice(5).trimStart())
              .join('\n');
            if (id) cursor = id;
            if (data && !closed) onUpdate(JSON.parse(data) as RoomSnapshot);
          }
        }
      } catch (error) {
        if (!closed) {
          onError?.(
            error instanceof Error ? error : new Error('Luồng phòng bị gián đoạn.'),
          );
        }
      } finally {
        activeController = null;
        if (!closed) {
          reconnectTimer = window.setTimeout(() => {
            reconnectTimer = null;
            void connect();
          }, SSE_RECONNECT_DELAY_MS);
        }
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
        activeController?.abort();
        if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
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

  getPlayerHistory(profileToken: string) {
    return apiFetch<PlayerHistoryEntry[]>(
      '/profiles/me/history',
      {},
      profileToken,
    );
  }

  getReferenceTrajectories() {
    return apiFetch<ReferenceTrajectories>('/reference-trajectories');
  }
}
