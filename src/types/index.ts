// ============================================================
// API Contract Types
// ============================================================

/** Response from POST /api/sessions */
export interface SessionResponse {
  sessionId: string;
  currentRound: number;
  message: string;
}

/** Request body for POST /api/sessions/:id/rounds */
export interface RoundRequest {
  roundNumber: number;
  allocation: {
    innovation: number;
    education: number;
    infrastructure: number;
    fdi: number;
  };
  borrowedAmount?: number;
  eventChoice?: PolicyChoice;
}

/** Response from submitting a round */
export interface RoundResponse {
  roundNumber: number;
  score: number;
  cumulativeScore: number;
  dependencyPenalty: number;
  feedback: string;
  nextRound: number | null;
  budgetForRound?: number;
  debtOutstanding?: number;
  autonomyIndex?: number;
}

/** Response from POST /api/sessions/:id/complete */
export interface CompleteResponse {
  sessionId: string;
  nickname: string;
  className: string;
  finalScore: number;
  outcomeType: OutcomeType;
  outcomeMessage: string;
  scores: number[];
  rank: number | null;
  autonomyIndex?: number;
  debtOutstanding?: number;
}

/** A single entry in the leaderboard */
export interface LeaderboardEntry {
  rank: number;
  nickname: string;
  className: string;
  finalScore: number;
  outcomeType: OutcomeType;
  completedAt: string;
}

/** Response from GET /api/leaderboard */
export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalEntries: number;
  updatedAt: string;
}

/** Reference trajectory data for the comparison chart */
export interface ReferenceTrajectories {
  korea: number[];
  china: number[];
  disrupted: number[];
  labels: string[];
}

// ============================================================
// Game State Types
// ============================================================

/** The four phases of the game UI */
export enum GamePhase {
  NICKNAME = 'NICKNAME',
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  EVENT = 'EVENT',
  COUNTDOWN = 'COUNTDOWN',
  DEBRIEF = 'DEBRIEF',
  RESULT = 'RESULT',
}

/** Outcome classification based on final score */
export type OutcomeType = 'LEAPFROG' | 'DEPENDENT' | 'DISRUPTED';

export type PolicyChoice = 'A' | 'B' | 'C';

/** Player's resource allocation for a single round (must sum to 100) */
export interface RoundAllocation {
  innovation: number;
  education: number;
  infrastructure: number;
  fdi: number;
}

/** Record of a completed round */
export interface RoundHistory {
  roundNumber: number;
  allocation: RoundAllocation;
  score: number;
  dependencyPenalty: number;
  feedback: string;
  budgetForRound: number;
  borrowedAmount: number;
  debtOutstanding: number;
  autonomyIndex: number;
  eventChoice: PolicyChoice;
}

/** Full game state managed by the store */
export interface GameState {
  phase: GamePhase;
  sessionId: string | null;
  nickname: string;
  className: string;
  currentRound: number;
  allocations: RoundAllocation;
  borrowedAmount: number;
  budgetForRound: number;
  debtOutstanding: number;
  autonomyIndex: number;
  roundHistories: RoundHistory[];
  scores: number[];
  finalResult: CompleteResponse | null;
  error: string | null;
  isLoading: boolean;
}

/** Actions available on the game store */
export interface GameActions {
  setNickname: (nickname: string) => void;
  setClassName: (className: string) => void;
  startSession: () => Promise<void>;
  updateAllocation: (field: keyof RoundAllocation, value: number) => void;
  setBorrowedAmount: (amount: number) => void;
  startTerm: () => void;
  submitRound: (choice: PolicyChoice) => Promise<void>;
  showEvent: () => void;
  nextRound: () => void;
  showDebrief: () => void;
  completeGame: () => Promise<void>;
  resetGame: () => void;
  setError: (error: string) => void;
  clearError: () => void;
}

// ============================================================
// Wave / Section Data Types
// ============================================================

/** One of the four industrial revolution waves */
export interface Wave {
  id: number;
  name: string;
  year: string;
  coreTech: string[];
  leaders: string[];
  vietnamStatus: string;
  iconDescription: string;
}

/** A data highlight card (positive metric) */
export interface DataHighlight {
  id: string;
  label: string;
  value: string;
  description: string;
  source: string;
}

/** A disruption stat card (warning metric) */
export interface DataDisruption {
  id: string;
  label: string;
  value: string;
  description: string;
  source: string;
}

/** A country data point for comparison charts */
export interface ComparisonDataPoint {
  country: string;
  value: number;
  color: string;
}

/** Full comparison dataset */
export interface ComparisonDataset {
  rdSpending: ComparisonDataPoint[];
  researchersPerMillion: ComparisonDataPoint[];
}

/** A solution card */
export interface Solution {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

/** An opportunity or challenge item */
export interface OpportunityOrChallenge {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

/** A lesson learned from the analysis */
export interface Lesson {
  id: string;
  title: string;
  description: string;
  example: string;
}

/** A source reference */
export interface Source {
  id: string;
  author: string;
  title: string;
  year: number;
  url?: string;
}

/** A section in the scrollytelling narrative */
export interface Section {
  id: string;
  title: string;
  subtitle?: string;
  order: number;
  type: 'hero' | 'waves' | 'data' | 'game' | 'solutions' | 'conclusion';
}
