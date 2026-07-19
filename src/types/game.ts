export type PolicyChoice = 'A' | 'B' | 'C';
export type OutcomeType = 'LEAPFROG' | 'DEPENDENT' | 'DISRUPTED';
export type RoomStatus = 'WAITING' | 'IN_PROGRESS' | 'ENDED';
export type RoomRole = 'HOST' | 'PLAYER';
export type ParticipantReadiness = 'ONBOARDING' | 'READY' | 'PLAYING' | 'COMPLETED';
export type ShockId = 'TALENT_DRAIN' | 'CYBER_DISRUPTION' | 'FDI_REPRICING';
export type ShockSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export enum GamePhase {
  PORTAL = 'PORTAL',
  LOBBY = 'LOBBY',
  INTRO = 'INTRO',
  SHOCK = 'SHOCK',
  PLAYING = 'PLAYING',
  EVENT = 'EVENT',
  ROUND_REPORT = 'ROUND_REPORT',
  COUNTDOWN = 'COUNTDOWN',
  DEBRIEF = 'DEBRIEF',
  RESULT = 'RESULT',
  ROOM_RESULT = 'ROOM_RESULT',
}

export interface RoundAllocation {
  innovation: number;
  education: number;
  infrastructure: number;
  fdi: number;
}

export interface GameMetrics {
  productivity: number;
  autonomy: number;
  absorption: number;
  resilience: number;
  debtOutstanding: number;
  debtDueNextRound: number;
  dependencyStreak: number;
  dependencyPenalty: number;
}

export type MetricKey =
  | 'productivity'
  | 'autonomy'
  | 'absorption'
  | 'resilience';

export interface MetricDelta {
  key: MetricKey;
  before: number;
  after: number;
  delta: number;
}

export interface ShockResolution {
  id: ShockId;
  severity: ShockSeverity;
  title: string;
  briefing: string;
  impact: string;
  mitigation: string;
}

export interface CarryOverItem {
  id: 'EDUCATION_MATURING' | 'DEBT_DUE' | 'DEPENDENCY_RISK' | 'POLICY_LOCK';
  label: string;
  value: string;
  tone: 'POSITIVE' | 'WARNING' | 'NEUTRAL';
}

export interface RoundRequest {
  submissionId: string;
  roundNumber: number;
  stateVersion: number;
  allocation: RoundAllocation;
  borrowedAmount: number;
  eventChoice: PolicyChoice;
}

export interface RoundResolution {
  submissionId: string;
  roundNumber: number;
  nextRound: number | null;
  stateVersion: number;
  roundGain: number;
  budgetForRound: number;
  nextBudget: number;
  allocation: RoundAllocation;
  borrowedAmount: number;
  eventChoice: PolicyChoice;
  metricsBefore: GameMetrics;
  metricsAfter: GameMetrics;
  metricDeltas: MetricDelta[];
  effectCodes: string[];
  headline: string;
  explanation: string;
  lesson: string;
  carryOver: CarryOverItem[];
  shock: ShockResolution | null;
  locksDependent: boolean;
}

export type RoundHistory = RoundResolution;

export interface SessionSnapshot {
  sessionId: string;
  roomId: string;
  nickname: string;
  groupName: string;
  readiness: ParticipantReadiness;
  joinedAt: string;
  currentRound: number;
  stateVersion: number;
  budgetForRound: number;
  pendingEducationShare: number;
  metrics: GameMetrics;
  histories: RoundHistory[];
  shockRound: number;
  shockId: ShockId;
  completed: boolean;
  locksDependent: boolean;
  finalResult: CompleteResponse | null;
}

export interface CompleteResponse {
  sessionId: string;
  nickname: string;
  groupName: string;
  finalScore: number;
  outcomeType: OutcomeType;
  outcomeMessage: string;
  scores: number[];
  rank: number | null;
  autonomyIndex: number;
  debtOutstanding: number;
  policyArchetype: string;
  turningPoints: TurningPoint[];
  counterfactual: string;
}

export interface TurningPoint {
  roundNumber: number;
  title: string;
  impact: string;
  magnitude: number;
}

export interface RoomParticipant {
  sessionId: string;
  nickname: string;
  groupName: string;
  readiness: ParticipantReadiness;
  currentRound: number;
  completed: boolean;
  outcomeType: OutcomeType | null;
  finalScore: number | null;
}

export interface RoomSnapshot {
  roomId: string;
  roomCode: string;
  roomName: string;
  groupNames: string[];
  status: RoomStatus;
  durationSeconds: number;
  endsAt: string | null;
  participants: RoomParticipant[];
  createdAt: string;
}

export interface CreateRoomResponse {
  room: RoomSnapshot;
  hostToken: string;
}

export interface CreateRoomRequest {
  roomName: string;
  groupNames: string[];
  durationSeconds?: number;
}

export interface JoinRoomRequest {
  roomCode: string;
  nickname: string;
  groupName: string;
  profileToken: string;
}

export interface RoomPreview {
  roomId: string;
  roomCode: string;
  roomName: string;
  groupNames: string[];
  status: RoomStatus;
  participantCount: number;
}

export interface JoinRoomResponse {
  room: RoomSnapshot;
  session: SessionSnapshot;
  playerToken: string;
}

export interface LeaderboardEntry {
  rank: number | null;
  sessionId: string;
  nickname: string;
  groupName: string;
  finalScore: number | null;
  outcomeType: OutcomeType | null;
  completed: boolean;
  completedAt: string | null;
}

export interface GroupLeaderboardEntry {
  rank: number | null;
  groupName: string;
  memberCount: number;
  completionCount: number;
  championSessionId: string | null;
  championName: string | null;
  championScore: number | null;
}

export interface RoomInsights {
  completionCount: number;
  totalPlayers: number;
  outcomeCounts: Record<OutcomeType, number>;
  commonChoices: Array<{
    roundNumber: number;
    choice: PolicyChoice | null;
    count: number;
  }>;
}

export interface LeaderboardResponse {
  roomId: string;
  roomCode: string;
  roomName: string;
  roomStatus: RoomStatus;
  entries: LeaderboardEntry[];
  groups: GroupLeaderboardEntry[];
  insights: RoomInsights;
  updatedAt: string;
}

export interface PlayerHistoryEntry {
  roomId: string;
  roomCode: string;
  roomName: string;
  roomStatus: RoomStatus;
  sessionId: string;
  playerToken: string;
  nickname: string;
  groupName: string;
  joinedAt: string;
  completedAt: string | null;
  finalScore: number | null;
  outcomeType: OutcomeType | null;
  rank: number | null;
}

export interface ReferenceTrajectories {
  korea: number[];
  china: number[];
  disrupted: number[];
  labels: string[];
}

export interface GatewaySubscription {
  close: () => void;
}

export interface ProblemDetail {
  status: number;
  code: string;
  title: string;
  detail: string;
}
