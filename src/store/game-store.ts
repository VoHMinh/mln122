'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getGameGateway } from '@/lib/game-gateway';
import { useRoomStore } from '@/store/room-store';
import {
  GamePhase,
  type CompleteResponse,
  type PolicyChoice,
  type RoundAllocation,
  type RoundResolution,
  type SessionSnapshot,
} from '@/types';

type GameState = {
  phase: GamePhase;
  session: SessionSnapshot | null;
  allocations: RoundAllocation;
  borrowedAmount: number;
  pendingResolution: RoundResolution | null;
  pendingSubmissionId: string | null;
  finalResult: CompleteResponse | null;
  seenShock: boolean;
  isLoading: boolean;
  error: string | null;
};

type GameActions = {
  loadSession: (session: SessionSnapshot, roomInProgress?: boolean) => void;
  startTerm: () => void;
  dismissShock: () => void;
  updateAllocation: (field: keyof RoundAllocation, value: number) => void;
  balanceAllocation: () => void;
  clearAllocation: () => void;
  setBorrowedAmount: (value: number) => void;
  showEvent: () => void;
  returnToAllocation: () => void;
  submitRound: (choice: PolicyChoice) => Promise<void>;
  continueFromReport: () => void;
  showDebrief: () => void;
  completeGame: () => Promise<void>;
  showRoomResult: () => void;
  showPersonalResult: () => void;
  handleRoomEnded: () => void;
  resetGame: () => void;
  setError: (error: string) => void;
  clearError: () => void;
};

function balancedAllocation(total: number): RoundAllocation {
  const base = Math.floor(total / 4);
  return {
    education: base,
    innovation: base,
    infrastructure: base,
    fdi: total - base * 3,
  };
}

function emptyAllocation(): RoundAllocation {
  return {
    education: 0,
    innovation: 0,
    infrastructure: 0,
    fdi: 0,
  };
}

function initialState(): GameState {
  return {
    phase: GamePhase.PORTAL,
    session: null,
    allocations: emptyAllocation(),
    borrowedAmount: 0,
    pendingResolution: null,
    pendingSubmissionId: null,
    finalResult: null,
    seenShock: false,
    isLoading: false,
    error: null,
  };
}

function createSubmissionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState(),

      loadSession: (session, roomInProgress = false) => {
        const current = get();
        const belongsToCurrentSession = current.session?.sessionId === session.sessionId;
        const shouldPreservePendingReport =
          belongsToCurrentSession &&
          current.pendingResolution &&
          !session.completed &&
          session.histories.length <= (current.session?.histories.length ?? 0);
        if (shouldPreservePendingReport) {
          set({ session, finalResult: session.finalResult });
          return;
        }
        let phase = GamePhase.LOBBY;
        if (session.completed && session.finalResult) phase = GamePhase.RESULT;
        else if (session.histories.length >= 4) phase = GamePhase.DEBRIEF;
        else if (roomInProgress) {
          phase = session.histories.length === 0 ? GamePhase.INTRO : GamePhase.PLAYING;
        }
        set({
          session,
          phase,
          allocations: emptyAllocation(),
          borrowedAmount: 0,
          pendingResolution: null,
          pendingSubmissionId: null,
          finalResult: session.finalResult,
          seenShock: session.histories.some((history) => Boolean(history.shock)),
          error: null,
        });
      },

      startTerm: () => {
        const { session, seenShock } = get();
        if (!session) return;
        const shouldShowShock =
          !seenShock && session.currentRound === session.shockRound;
        set({ phase: shouldShowShock ? GamePhase.SHOCK : GamePhase.PLAYING, error: null });
      },

      dismissShock: () => set({ seenShock: true, phase: GamePhase.PLAYING }),

      updateAllocation: (field, value) => {
        const { allocations, session, borrowedAmount } = get();
        if (!session) return;
        const available = session.budgetForRound + borrowedAmount;
        const otherTotal = Object.entries(allocations)
          .filter(([key]) => key !== field)
          .reduce((sum, [, allocation]) => sum + allocation, 0);
        const next = Math.max(0, Math.min(available - otherTotal, Math.round(value)));
        set({ allocations: { ...allocations, [field]: next } });
      },

      balanceAllocation: () => {
        const { session, borrowedAmount } = get();
        if (!session) return;
        set({
          allocations: balancedAllocation(session.budgetForRound + borrowedAmount),
          error: null,
        });
      },

      clearAllocation: () => set({ allocations: emptyAllocation(), error: null }),

      setBorrowedAmount: (value) => {
        const { session } = get();
        if (!session) return;
        const max = Math.floor(session.budgetForRound * 0.5);
        set({ borrowedAmount: Math.max(0, Math.min(max, Math.round(value))) });
      },

      showEvent: () => set({ phase: GamePhase.EVENT, error: null }),
      returnToAllocation: () => set({ phase: GamePhase.PLAYING, error: null }),

      submitRound: async (choice) => {
        const { session, allocations, borrowedAmount } = get();
        const { playerToken } = useRoomStore.getState();
        if (!session || !playerToken) {
          set({ error: 'Phiên người chơi không hợp lệ. Hãy vào lại phòng.' });
          return;
        }
        const available = session.budgetForRound + borrowedAmount;
        const total = Object.values(allocations).reduce((sum, value) => sum + value, 0);
        if (total !== available) {
          set({ error: `Bạn còn ${Math.abs(available - total)} RP chưa được phân bổ.` });
          return;
        }

        const submissionId = get().pendingSubmissionId ?? createSubmissionId();
        set({ isLoading: true, error: null, pendingSubmissionId: submissionId });
        try {
          const resolution = await getGameGateway().submitRound(
            session.sessionId,
            playerToken,
            {
              submissionId,
              roundNumber: session.currentRound,
              stateVersion: session.stateVersion,
              allocation: { ...allocations },
              borrowedAmount,
              eventChoice: choice,
            },
          );
          const alreadyRecorded = session.histories.some(
            (history) => history.submissionId === resolution.submissionId,
          );
          const nextSession: SessionSnapshot = {
            ...session,
            currentRound: resolution.nextRound ?? 4,
            stateVersion: resolution.stateVersion,
            budgetForRound: resolution.nextBudget,
            pendingEducationShare:
              resolution.allocation.education /
              Object.values(resolution.allocation).reduce((sum, value) => sum + value, 0),
            metrics: resolution.metricsAfter,
            histories: alreadyRecorded
              ? session.histories
              : [...session.histories, resolution],
            locksDependent: resolution.locksDependent,
          };
          set({
            session: nextSession,
            pendingResolution: resolution,
            pendingSubmissionId: null,
            phase: GamePhase.ROUND_REPORT,
            isLoading: false,
          });
        } catch (error) {
          // The server can accept a decision even when the response is interrupted.
          // Reconcile first so a retry cannot leave the player on a recorded round.
          try {
            const recovered = await getGameGateway().getSession(session.sessionId, playerToken);
            const recordedResolution = recovered.histories.find(
              (history) => history.roundNumber === session.currentRound,
            );
            if (recordedResolution) {
              useRoomStore.setState({ sessionSnapshot: recovered });
              set({
                session: recovered,
                pendingResolution: recovered.completed ? null : recordedResolution,
                pendingSubmissionId: null,
                finalResult: recovered.finalResult,
                phase: recovered.completed ? GamePhase.RESULT : GamePhase.ROUND_REPORT,
                seenShock: recovered.histories.some((history) => Boolean(history.shock)),
                isLoading: false,
                error: null,
              });
              return;
            }
          } catch {
            // Preserve the original error when the recovery request also fails.
          }
          set({
            error: errorMessage(error, 'Không thể ghi nhận quyết định. Vui lòng thử lại.'),
            isLoading: false,
          });
        }
      },

      continueFromReport: () => {
        const { session, pendingResolution, seenShock } = get();
        if (!session || !pendingResolution) return;
        const finalRoundRecorded =
          pendingResolution.roundNumber >= 4 ||
          pendingResolution.nextRound === null ||
          session.histories.length >= 4;
        if (finalRoundRecorded) {
          set({
            pendingResolution: null,
            phase: GamePhase.COUNTDOWN,
            allocations: emptyAllocation(),
            borrowedAmount: 0,
          });
          return;
        }
        const shouldShowShock =
          !seenShock && pendingResolution.nextRound === session.shockRound;
        set({
          pendingResolution: null,
          phase: shouldShowShock ? GamePhase.SHOCK : GamePhase.PLAYING,
          allocations: emptyAllocation(),
          borrowedAmount: 0,
          error: null,
        });
      },

      showDebrief: () => set({ phase: GamePhase.DEBRIEF }),

      completeGame: async () => {
        const { session } = get();
        const { playerToken } = useRoomStore.getState();
        if (!session || !playerToken) return;
        set({ isLoading: true, error: null });
        try {
          const result = await getGameGateway().completeSession(
            session.sessionId,
            playerToken,
          );
          set({
            finalResult: result,
            session: { ...session, completed: true, finalResult: result },
            phase: GamePhase.RESULT,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: errorMessage(error, 'Không thể xác định kết cục năm 2030.'),
            isLoading: false,
          });
        }
      },

      showRoomResult: () => set({ phase: GamePhase.ROOM_RESULT, error: null }),
      showPersonalResult: () => {
        const { finalResult, session } = get();
        if (finalResult && session) set({ phase: GamePhase.RESULT, error: null });
      },

      handleRoomEnded: () => {
        const { phase } = get();
        if (phase !== GamePhase.RESULT) set({ phase: GamePhase.ROOM_RESULT });
      },

      resetGame: () => set({ ...initialState() }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'mln2030-game-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        phase: state.phase,
        session: state.session,
        allocations: state.allocations,
        borrowedAmount: state.borrowedAmount,
        pendingResolution: state.pendingResolution,
        pendingSubmissionId: state.pendingSubmissionId,
        finalResult: state.finalResult,
        seenShock: state.seenShock,
      }),
    },
  ),
);
