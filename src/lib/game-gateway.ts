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
import { HttpGameGateway } from '@/lib/gateways/http-game-gateway';
import { MockGameGateway } from '@/lib/gateways/mock-game-gateway';

export interface GameGateway {
  createRoom(hostName: string, durationSeconds?: number): Promise<CreateRoomResponse>;
  joinRoom(roomCode: string, nickname: string, className: string): Promise<JoinRoomResponse>;
  startRoom(roomId: string, hostToken: string): Promise<RoomSnapshot>;
  endRoom(roomId: string, hostToken: string): Promise<RoomSnapshot>;
  getRoom(roomId: string, token?: string): Promise<RoomSnapshot>;
  subscribeRoom(
    roomId: string,
    token: string,
    onUpdate: (room: RoomSnapshot) => void,
    onError?: (error: Error) => void,
  ): GatewaySubscription;
  getSession(sessionId: string, playerToken: string): Promise<SessionSnapshot>;
  submitRound(
    sessionId: string,
    playerToken: string,
    request: RoundRequest,
  ): Promise<RoundResolution>;
  completeSession(
    sessionId: string,
    playerToken: string,
  ): Promise<CompleteResponse>;
  getLeaderboard(roomId: string, token?: string): Promise<LeaderboardResponse>;
  getReferenceTrajectories(): Promise<ReferenceTrajectories>;
}

let gateway: GameGateway | null = null;

export function getGameGateway(): GameGateway {
  if (gateway) return gateway;
  gateway =
    process.env.NEXT_PUBLIC_GAME_API_MODE === 'http'
      ? new HttpGameGateway()
      : new MockGameGateway();
  return gateway;
}

export function resetGameGatewayForTests() {
  gateway = null;
}

