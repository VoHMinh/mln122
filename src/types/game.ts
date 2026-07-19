export type PolicyChoice = 'A' | 'B' | 'C';
export type OutcomeType = 'LEAPFROG' | 'DEPENDENT' | 'DISRUPTED';
export type RoomStatus = 'WAITING' | 'IN_PROGRESS' | 'ENDED';
export type RoomRole = 'HOST' | 'PLAYER';
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
  className: string;
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
  className: string;
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
  className: string;
  currentRound: number;
  completed: boolean;
  outcomeType: OutcomeType | null;
  finalScore: number | null;
}

export interface RoomSnapshot {
  roomId: string;
  roomCode: string;
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

export interface JoinRoomResponse {
  room: RoomSnapshot;
  session: SessionSnapshot;
  playerToken: string;
}

export interface LeaderboardEntry {
  rank: number | null;
  sessionId: string;
  nickname: string;
  className: string;
  finalScore: number | null;
  outcomeType: OutcomeType | null;
  completed: boolean;
  completedAt: string | null;
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
  roomStatus: RoomStatus;
  entries: LeaderboardEntry[];
  insights: RoomInsights;
  updatedAt: string;
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
