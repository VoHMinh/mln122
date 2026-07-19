import type { GameGateway } from '@/lib/game-gateway';
import {
  completeSessionState,
  createInitialSession,
  REFERENCE_TRAJECTORIES,
  resolveRound,
} from '@/lib/game-engine';
import type {
  CompleteResponse,
  CreateRoomResponse,
  GatewaySubscription,
  JoinRoomResponse,
  LeaderboardEntry,
  LeaderboardResponse,
  OutcomeType,
  ReferenceTrajectories,
  RoomParticipant,
  RoomSnapshot,
  RoundRequest,
  RoundResolution,
  SessionSnapshot,
} from '@/types';

type StoredRoom = RoomSnapshot & {
  seed: string;
  hostToken: string;
};

type StoredSession = SessionSnapshot & {
  playerToken: string;
  completedAt: string | null;
};

const ROOM_PREFIX = 'mln2030:room:';
const ROOM_CODE_PREFIX = 'mln2030:room-code:';
const SESSION_PREFIX = 'mln2030:session:';
const LOCAL_EVENT = 'mln2030:room-update';

const memory = new Map<string, string>();

function storageGet(key: string) {
  if (typeof window === 'undefined') return memory.get(key) ?? null;
  return window.localStorage.getItem(key);
}

function storageSet(key: string, value: string) {
  memory.set(key, value);
  if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
}

function randomId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function randomToken() {
  return `${randomId()}-${randomId()}`;
}

function roomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let index = 0; index < 6; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function wait(ms = 110) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readJson<T>(key: string): T | null {
  const value = storageGet(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getStoredRoom(roomId: string): StoredRoom {
  const room = readJson<StoredRoom>(`${ROOM_PREFIX}${roomId}`);
  if (!room) throw new Error('Phòng không tồn tại hoặc đã bị xóa.');
  if (
    room.status === 'IN_PROGRESS' &&
    room.endsAt &&
    new Date(room.endsAt).getTime() <= Date.now()
  ) {
    room.status = 'ENDED';
    storageSet(`${ROOM_PREFIX}${roomId}`, JSON.stringify(room));
  }
  return room;
}

function getStoredSession(sessionId: string): StoredSession {
  const session = readJson<StoredSession>(`${SESSION_PREFIX}${sessionId}`);
  if (!session) throw new Error('Không tìm thấy phiên người chơi.');
  return session;
}

function saveRoom(room: StoredRoom) {
  storageSet(`${ROOM_PREFIX}${room.roomId}`, JSON.stringify(room));
  storageSet(`${ROOM_CODE_PREFIX}${room.roomCode}`, room.roomId);
}

function saveSession(session: StoredSession) {
  storageSet(`${SESSION_PREFIX}${session.sessionId}`, JSON.stringify(session));
}

function publicRoom(room: StoredRoom): RoomSnapshot {
  const {
    roomId,
    roomCode: code,
    status,
    durationSeconds,
    endsAt,
    participants,
    createdAt,
  } = room;
  return {
    roomId,
    roomCode: code,
    status,
    durationSeconds,
    endsAt,
    participants,
    createdAt,
  };
}

function publish(roomId: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(LOCAL_EVENT, { detail: roomId }));
  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(LOCAL_EVENT);
    channel.postMessage({ roomId });
    channel.close();
  }
}

function participantFromSession(session: StoredSession): RoomParticipant {
  return {
    sessionId: session.sessionId,
    nickname: session.nickname,
    className: session.className,
    currentRound: session.currentRound,
    completed: session.completed,
    outcomeType: session.finalResult?.outcomeType ?? null,
    finalScore: session.finalResult?.finalScore ?? null,
  };
}

function validatePlayer(session: StoredSession, token: string) {
  if (!token || session.playerToken !== token) {
    throw new Error('Phiên xác thực người chơi không hợp lệ.');
  }
}

function validateHost(room: StoredRoom, token: string) {
  if (!token || room.hostToken !== token) {
    throw new Error('Chỉ chủ phòng mới có thể thực hiện thao tác này.');
  }
}

function updateRoomParticipant(session: StoredSession) {
  const room = getStoredRoom(session.roomId);
  const next = participantFromSession(session);
  const index = room.participants.findIndex((item) => item.sessionId === session.sessionId);
  if (index >= 0) room.participants[index] = next;
  else room.participants.push(next);
  saveRoom(room);
  publish(room.roomId);
}

export class MockGameGateway implements GameGateway {
  async createRoom(hostName: string, durationSeconds = 600): Promise<CreateRoomResponse> {
    await wait();
    let code = roomCode();
    while (storageGet(`${ROOM_CODE_PREFIX}${code}`)) code = roomCode();
    const roomId = randomId();
    const hostToken = randomToken();
    const room: StoredRoom = {
      roomId,
      roomCode: code,
      status: 'WAITING',
      durationSeconds,
      endsAt: null,
      participants: [],
      createdAt: new Date().toISOString(),
      seed: randomToken(),
      hostToken,
    };
    saveRoom(room);
    return { room: publicRoom(room), hostToken };
  }

  async joinRoom(
    code: string,
    nickname: string,
    className: string,
  ): Promise<JoinRoomResponse> {
    await wait();
    const normalizedCode = code.trim().toUpperCase();
    const roomId = storageGet(`${ROOM_CODE_PREFIX}${normalizedCode}`);
    if (!roomId) throw new Error('Mã phòng không tồn tại.');
    const room = getStoredRoom(roomId);
    if (room.status !== 'WAITING') throw new Error('Phòng đã bắt đầu hoặc đã kết thúc.');
    const duplicate = room.participants.some(
      (item) => item.nickname.toLocaleLowerCase('vi') === nickname.trim().toLocaleLowerCase('vi'),
    );
    if (duplicate) throw new Error('Tên hiển thị đã được dùng trong phòng này.');

    const sessionId = randomId();
    const playerToken = randomToken();
    const session: StoredSession = {
      ...createInitialSession(
        sessionId,
        room.roomId,
        nickname.trim(),
        className.trim(),
        room.seed,
      ),
      playerToken,
      completedAt: null,
    };
    saveSession(session);
    room.participants.push(participantFromSession(session));
    saveRoom(room);
    publish(room.roomId);
    return { room: publicRoom(room), session, playerToken };
  }

  async startRoom(roomId: string, hostToken: string): Promise<RoomSnapshot> {
    await wait();
    const room = getStoredRoom(roomId);
    validateHost(room, hostToken);
    if (room.status !== 'WAITING') throw new Error('Phòng không còn ở trạng thái chờ.');
    room.status = 'IN_PROGRESS';
    room.endsAt = new Date(Date.now() + room.durationSeconds * 1000).toISOString();
    saveRoom(room);
    publish(roomId);
    return publicRoom(room);
  }

  async endRoom(roomId: string, hostToken: string): Promise<RoomSnapshot> {
    await wait();
    const room = getStoredRoom(roomId);
    validateHost(room, hostToken);
    room.status = 'ENDED';
    saveRoom(room);
    publish(roomId);
    return publicRoom(room);
  }

  async getRoom(roomId: string): Promise<RoomSnapshot> {
    await wait(30);
    return publicRoom(getStoredRoom(roomId));
  }

  subscribeRoom(
    roomId: string,
    _token: string,
    onUpdate: (room: RoomSnapshot) => void,
    onError?: (error: Error) => void,
  ): GatewaySubscription {
    let closed = false;
    const send = async () => {
      try {
        const snapshot = await this.getRoom(roomId);
        if (!closed) onUpdate(snapshot);
      } catch (error) {
        if (!closed) {
          onError?.(error instanceof Error ? error : new Error('Không thể cập nhật phòng.'));
        }
      }
    };
    const onLocal = (event: Event) => {
      if ((event as CustomEvent<string>).detail === roomId) void send();
    };
    const channel =
      typeof window !== 'undefined' && 'BroadcastChannel' in window
        ? new BroadcastChannel(LOCAL_EVENT)
        : null;
    const onMessage = (event: MessageEvent<{ roomId?: string }>) => {
      if (event.data?.roomId === roomId) void send();
    };
    channel?.addEventListener('message', onMessage);
    window.addEventListener(LOCAL_EVENT, onLocal);
    const poll = window.setInterval(send, 5000);
    void send();
    return {
      close: () => {
        closed = true;
        channel?.removeEventListener('message', onMessage);
        channel?.close();
        window.removeEventListener(LOCAL_EVENT, onLocal);
        window.clearInterval(poll);
      },
    };
  }

  async getSession(sessionId: string, playerToken: string): Promise<SessionSnapshot> {
    await wait(40);
    const session = getStoredSession(sessionId);
    validatePlayer(session, playerToken);
    return session;
  }

  async submitRound(
    sessionId: string,
    playerToken: string,
    request: RoundRequest,
  ): Promise<RoundResolution> {
    await wait(180);
    const session = getStoredSession(sessionId);
    validatePlayer(session, playerToken);
    const room = getStoredRoom(session.roomId);
    if (room.status !== 'IN_PROGRESS') throw new Error('Phòng chưa bắt đầu hoặc đã kết thúc.');

    const duplicate = session.histories.find(
      (history) => history.submissionId === request.submissionId,
    );
    if (duplicate) return duplicate;
    if (session.histories.some((history) => history.roundNumber === request.roundNumber)) {
      throw new Error('Giai đoạn này đã được ghi nhận bằng một quyết định khác.');
    }

    const { resolution, nextSession } = resolveRound(session, request);
    const stored: StoredSession = {
      ...nextSession,
      playerToken: session.playerToken,
      completedAt: session.completedAt,
    };
    saveSession(stored);
    updateRoomParticipant(stored);
    return resolution;
  }

  async completeSession(
    sessionId: string,
    playerToken: string,
  ): Promise<CompleteResponse> {
    await wait(150);
    const session = getStoredSession(sessionId);
    validatePlayer(session, playerToken);
    if (session.finalResult) return session.finalResult;
    if (session.histories.length !== 4) {
      throw new Error('Bạn cần hoàn tất đủ bốn giai đoạn trước khi xác định kết cục.');
    }
    const { result, nextSession } = completeSessionState(session);
    const stored: StoredSession = {
      ...nextSession,
      playerToken: session.playerToken,
      completedAt: new Date().toISOString(),
    };
    saveSession(stored);
    updateRoomParticipant(stored);
    const leaderboard = await this.getLeaderboard(session.roomId);
    const entry = leaderboard.entries.find((item) => item.sessionId === sessionId);
    const rankedResult = { ...result, rank: entry?.rank ?? null };
    stored.finalResult = rankedResult;
    saveSession(stored);
    return rankedResult;
  }

  async getLeaderboard(roomId: string): Promise<LeaderboardResponse> {
    await wait(50);
    const room = getStoredRoom(roomId);
    const sessions = room.participants.map((participant) =>
      getStoredSession(participant.sessionId),
    );
    const completed = sessions
      .filter((session) => session.completed && session.finalResult)
      .sort(
        (a, b) =>
          (b.finalResult?.finalScore ?? 0) - (a.finalResult?.finalScore ?? 0),
      );
    const rankBySession = new Map(completed.map((session, index) => [session.sessionId, index + 1]));
    const entries: LeaderboardEntry[] = sessions
      .map((session) => ({
        rank: rankBySession.get(session.sessionId) ?? null,
        sessionId: session.sessionId,
        nickname: session.nickname,
        className: session.className,
        finalScore: session.finalResult?.finalScore ?? null,
        outcomeType: session.finalResult?.outcomeType ?? null,
        completed: session.completed,
        completedAt: session.completedAt,
      }))
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? -1 : 1;
        return (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER);
      });

    const outcomeCounts: Record<OutcomeType, number> = {
      LEAPFROG: 0,
      DEPENDENT: 0,
      DISRUPTED: 0,
    };
    completed.forEach((session) => {
      if (session.finalResult) outcomeCounts[session.finalResult.outcomeType] += 1;
    });
    const commonChoices = [1, 2, 3, 4].map((roundNumber) => {
      const counts = new Map<string, number>();
      sessions.forEach((session) => {
        const choice = session.histories.find(
          (history) => history.roundNumber === roundNumber,
        )?.eventChoice;
        if (choice) counts.set(choice, (counts.get(choice) ?? 0) + 1);
      });
      const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
      return {
        roundNumber,
        choice: (top?.[0] as 'A' | 'B' | 'C' | undefined) ?? null,
        count: top?.[1] ?? 0,
      };
    });

    return {
      roomStatus: room.status,
      entries,
      insights: {
        completionCount: completed.length,
        totalPlayers: sessions.length,
        outcomeCounts,
        commonChoices,
      },
      updatedAt: new Date().toISOString(),
    };
  }

  async getReferenceTrajectories(): Promise<ReferenceTrajectories> {
    return { ...REFERENCE_TRAJECTORIES };
  }
}
