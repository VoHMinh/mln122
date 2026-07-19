import type {
  SessionResponse,
  RoundRequest,
  RoundResponse,
  CompleteResponse,
  LeaderboardEntry,
  LeaderboardResponse,
  ReferenceTrajectories,
  RoundHistory,
  RoundAllocation,
  OutcomeType,
} from '@/types';

import {
  calculateProductivity,
  calculateDependencyPenalty,
  determineOutcome,
  getOutcomeMessage,
  generateRoundFeedback,
  REFERENCE_TRAJECTORIES,
} from '@/lib/game-logic';
import { getPolicyStage } from '@/lib/game-scenarios';

import type { LeaderboardSubscription } from '@/lib/api';

// ============================================================
// In-Memory Store
// ============================================================

interface MockSession {
  sessionId: string;
  nickname: string;
  className: string;
  currentRound: number;
  roundHistories: RoundHistory[];
  scores: number[];
  completed: boolean;
  budgetForRound: number;
  debtOutstanding: number;
  autonomyIndex: number;
  locksDependent: boolean;
}

const sessions = new Map<string, MockSession>();
const leaderboard: LeaderboardEntry[] = [];

// ============================================================
// Helpers
// ============================================================

/** Generate a simple UUID v4 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}

/** Add a realistic delay (200–500ms) */
function delay(min = 200, max = 500): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// Mock API Implementations
// ============================================================

/**
 * Create a new game session.
 */
export async function createSession(
  nickname: string,
  className: string
): Promise<SessionResponse> {
  await delay();

  const sessionId = generateUUID();
  const session: MockSession = {
    sessionId,
    nickname,
    className,
    currentRound: 1,
    roundHistories: [],
    scores: [],
    completed: false,
    budgetForRound: 100,
    debtOutstanding: 0,
    autonomyIndex: 0,
    locksDependent: false,
  };

  sessions.set(sessionId, session);

  return {
    sessionId,
    currentRound: 1,
    message: `Chào mừng ${nickname}! Hành trình bắt đầu.`,
  };
}

/**
 * Submit a round's resource allocation and calculate score.
 */
export async function submitRound(
  sessionId: string,
  roundData: RoundRequest
): Promise<RoundResponse> {
  await delay();

  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} không tồn tại`);
  }

  if (session.completed) {
    throw new Error('Session đã kết thúc');
  }

  const { roundNumber, allocation, borrowedAmount = 0, eventChoice = 'B' } = roundData;

  const availableBudget = session.budgetForRound + borrowedAmount;

  // Validate allocation sums to the currently available resource points.
  const total =
    allocation.innovation +
    allocation.education +
    allocation.infrastructure +
    allocation.fdi;
  if (Math.abs(total - availableBudget) > 0.01) {
    throw new Error(`Tổng phân bổ phải bằng ${availableBudget} (hiện tại: ${total})`);
  }

  // Get previous round's education for carry-over effect
  const prevEducation =
    session.roundHistories.length > 0
      ? session.roundHistories[session.roundHistories.length - 1].allocation.education
      : 0;

  // Calculate dependency penalty from history
  const dependencyPenalty = calculateDependencyPenalty(session.roundHistories);

  // Calculate this round's score
  const prevScore =
    session.scores.length > 0
      ? session.scores[session.scores.length - 1]
      : 0;

  const roundAllocation: RoundAllocation = {
    innovation: allocation.innovation,
    education: allocation.education,
    infrastructure: allocation.infrastructure,
    fdi: allocation.fdi,
  };

  const stage = getPolicyStage(roundNumber);
  const choice = stage.options.find((option) => option.id === eventChoice) ?? stage.options[1];
  const baseScore = calculateProductivity(
    prevScore,
    roundAllocation,
    prevEducation,
    dependencyPenalty
  );
  const score = Math.max(0, Math.round((baseScore + choice.effect.scoreDelta - borrowedAmount * 0.06) * 100) / 100);
  const nextDebt = session.debtOutstanding + borrowedAmount + (choice.effect.debtDelta ?? 0);
  const nextAutonomy = Math.max(
    0,
    Math.round((session.autonomyIndex + allocation.innovation / 20 + choice.effect.autonomyDelta - dependencyPenalty * 3) * 10) / 10,
  );
  // Debt narrows the next policy window through interest; outstanding
  // principal is deducted once, from the final productivity score.
  const nextBudget = Math.max(50, 100 + Math.floor(score / 10) - Math.ceil(nextDebt * 0.2));

  // Generate feedback
  const feedback = generateRoundFeedback(
    roundNumber,
    roundAllocation,
    dependencyPenalty
  );

  // Record history
  const roundHistory: RoundHistory = {
    roundNumber,
    allocation: roundAllocation,
    score,
    dependencyPenalty,
    feedback,
    budgetForRound: session.budgetForRound,
    borrowedAmount,
    debtOutstanding: nextDebt,
    autonomyIndex: nextAutonomy,
    eventChoice,
  };

  session.roundHistories.push(roundHistory);
  session.scores.push(score);
  session.currentRound = roundNumber + 1;
  session.budgetForRound = nextBudget;
  session.debtOutstanding = nextDebt;
  session.autonomyIndex = nextAutonomy;
  session.locksDependent = session.locksDependent || Boolean(choice.effect.locksDependent);

  const isLastRound = roundNumber >= 4;

  return {
    roundNumber,
    score,
    cumulativeScore: score,
    dependencyPenalty,
    feedback,
    nextRound: isLastRound ? null : roundNumber + 1,
    budgetForRound: nextBudget,
    debtOutstanding: nextDebt,
    autonomyIndex: nextAutonomy,
  };
}

/**
 * Complete a session and determine final outcome.
 */
export async function completeSession(
  sessionId: string
): Promise<CompleteResponse> {
  await delay();

  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} không tồn tại`);
  }

  if (session.scores.length === 0) {
    throw new Error('Chưa hoàn thành vòng nào');
  }

  session.completed = true;

  const scoreBeforeDebt = session.scores[session.scores.length - 1];
  const finalScore = Math.max(0, Math.round((scoreBeforeDebt - session.debtOutstanding) * 100) / 100);
  const outcomeType: OutcomeType = determineOutcome(finalScore, session.autonomyIndex, session.locksDependent);
  const outcomeMessage = getOutcomeMessage(outcomeType);

  // Add to leaderboard
  const entry: LeaderboardEntry = {
    rank: 0, // Will be recalculated
    nickname: session.nickname,
    className: session.className,
    finalScore,
    outcomeType,
    completedAt: new Date().toISOString(),
  };

  leaderboard.push(entry);

  // Sort and assign ranks
  leaderboard.sort((a, b) => b.finalScore - a.finalScore);
  leaderboard.forEach((e, i) => {
    e.rank = i + 1;
  });

  const rank = leaderboard.findIndex(
    (e) =>
      e.nickname === session.nickname &&
      e.completedAt === entry.completedAt
  ) + 1;

  // Notify SSE subscribers
  notifyLeaderboardSubscribers();

  return {
    sessionId,
    nickname: session.nickname,
    className: session.className,
    finalScore,
    outcomeType,
    outcomeMessage,
    scores: session.scores,
    rank: rank || null,
    autonomyIndex: session.autonomyIndex,
    debtOutstanding: session.debtOutstanding,
  };
}

/**
 * Get the leaderboard, sorted by score.
 */
export async function getLeaderboard(
  limit: number = 20
): Promise<LeaderboardResponse> {
  await delay(100, 300);

  const entries = leaderboard.slice(0, limit);

  return {
    entries,
    totalEntries: leaderboard.length,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Get reference trajectories for the comparison chart.
 */
export async function getReferenceTrajectories(): Promise<ReferenceTrajectories> {
  await delay(100, 200);
  return { ...REFERENCE_TRAJECTORIES };
}

// ============================================================
// Mock SSE (Leaderboard Subscription)
// ============================================================

type LeaderboardCallback = (data: LeaderboardResponse) => void;

const leaderboardSubscribers = new Set<LeaderboardCallback>();

/**
 * Notify all active leaderboard subscribers.
 */
function notifyLeaderboardSubscribers(): void {
  const response: LeaderboardResponse = {
    entries: [...leaderboard],
    totalEntries: leaderboard.length,
    updatedAt: new Date().toISOString(),
  };

  for (const callback of leaderboardSubscribers) {
    // Async to simulate SSE delivery
    setTimeout(() => callback(response), 50);
  }
}

/**
 * Subscribe to leaderboard updates (mock SSE).
 *
 * Returns a subscription handle with close() to unsubscribe.
 */
export function subscribeToLeaderboard(
  onUpdate: LeaderboardCallback,
  onError?: (error: Event | Error) => void
): LeaderboardSubscription {
  leaderboardSubscribers.add(onUpdate);

  // Send initial data immediately
  setTimeout(async () => {
    try {
      const data = await getLeaderboard();
      onUpdate(data);
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Mock SSE error'));
    }
  }, 100);

  return {
    close: () => {
      leaderboardSubscribers.delete(onUpdate);
    },
  };
}
