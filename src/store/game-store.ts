'use client';

import { create } from 'zustand';
import type {
  CompleteResponse,
  GameActions,
  GameState,
  PolicyChoice,
  RoundAllocation,
} from '@/types';
import { GamePhase } from '@/types';
import * as api from '@/lib/api';

const BASE_BUDGET = 100;
const MAX_BORROW = 50;

function balancedAllocation(total: number): RoundAllocation {
  const base = Math.floor(total / 4);
  return {
    education: base,
    innovation: base,
    infrastructure: base,
    fdi: total - base * 3,
  };
}

const INITIAL_STATE: GameState = {
  phase: GamePhase.NICKNAME,
  sessionId: null,
  nickname: '',
  className: '',
  currentRound: 1,
  allocations: balancedAllocation(BASE_BUDGET),
  borrowedAmount: 0,
  budgetForRound: BASE_BUDGET,
  debtOutstanding: 0,
  autonomyIndex: 0,
  roundHistories: [],
  scores: [],
  finalResult: null,
  error: null,
  isLoading: false,
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...INITIAL_STATE,

  setNickname: (nickname) => set({ nickname }),
  setClassName: (className) => set({ className }),

  startSession: async () => {
    const { nickname, className } = get();
    if (!nickname.trim()) {
      set({ error: 'Hãy nhập tên hiển thị trước khi bắt đầu nhiệm kỳ.' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await api.createSession(nickname.trim(), className.trim());
      set({
        sessionId: response.sessionId,
        currentRound: 1,
        phase: GamePhase.INTRO,
        allocations: balancedAllocation(BASE_BUDGET),
        borrowedAmount: 0,
        budgetForRound: BASE_BUDGET,
        debtOutstanding: 0,
        autonomyIndex: 0,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Không thể tạo phiên mô phỏng. Vui lòng thử lại.',
        isLoading: false,
      });
    }
  },

  startTerm: () => set({ phase: GamePhase.PLAYING, error: null }),

  updateAllocation: (field, value) => {
    const { allocations, budgetForRound, borrowedAmount } = get();
    const available = budgetForRound + borrowedAmount;
    const otherTotal = Object.entries(allocations)
      .filter(([key]) => key !== field)
      .reduce((sum, [, allocation]) => sum + allocation, 0);
    const next = Math.max(0, Math.min(available - otherTotal, Math.round(value)));
    set({ allocations: { ...allocations, [field]: next } });
  },

  setBorrowedAmount: (amount) => {
    const nextBorrowed = Math.max(0, Math.min(MAX_BORROW, Math.round(amount)));
    set({ borrowedAmount: nextBorrowed });
  },

  showEvent: () => set({ phase: GamePhase.EVENT, error: null }),

  submitRound: async (choice: PolicyChoice) => {
    const { sessionId, currentRound, allocations, borrowedAmount, budgetForRound } = get();
    if (!sessionId) {
      set({ error: 'Phiên mô phỏng không hợp lệ. Hãy bắt đầu lại.' });
      return;
    }

    const total = Object.values(allocations).reduce((sum, value) => sum + value, 0);
    const available = budgetForRound + borrowedAmount;
    if (total !== available) {
      set({ error: `Bạn cần phân bổ đủ ${available} RP trước khi xác nhận chính sách.` });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await api.submitRound(sessionId, {
        roundNumber: currentRound,
        allocation: { ...allocations },
        borrowedAmount,
        eventChoice: choice,
      });

      const { roundHistories, scores, autonomyIndex, debtOutstanding } = get();
      const nextAutonomy = response.autonomyIndex ?? autonomyIndex;
      const nextDebt = response.debtOutstanding ?? debtOutstanding + borrowedAmount;
      const history = {
        roundNumber: currentRound,
        allocation: { ...allocations },
        score: response.score,
        dependencyPenalty: response.dependencyPenalty,
        feedback: response.feedback,
        budgetForRound,
        borrowedAmount,
        debtOutstanding: nextDebt,
        autonomyIndex: nextAutonomy,
        eventChoice: choice,
      };
      const isLastRound = currentRound === 4;
      const nextBudget = response.budgetForRound ?? BASE_BUDGET + Math.floor(response.score / 10);

      set({
        roundHistories: [...roundHistories, history],
        scores: [...scores, response.score],
        currentRound: isLastRound ? currentRound : currentRound + 1,
        allocations: isLastRound ? allocations : balancedAllocation(nextBudget),
        borrowedAmount: 0,
        budgetForRound: nextBudget,
        autonomyIndex: nextAutonomy,
        debtOutstanding: nextDebt,
        phase: isLastRound ? GamePhase.COUNTDOWN : GamePhase.PLAYING,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Không thể ghi nhận quyết định. Vui lòng thử lại.',
        isLoading: false,
      });
    }
  },

  nextRound: () => set({ phase: GamePhase.PLAYING, error: null }),
  showDebrief: () => set({ phase: GamePhase.DEBRIEF }),

  completeGame: async () => {
    const { sessionId } = get();
    if (!sessionId) {
      set({ error: 'Phiên mô phỏng không hợp lệ.' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const result: CompleteResponse = await api.completeSession(sessionId);
      set({ finalResult: result, phase: GamePhase.RESULT, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Không thể xác định kết quả phiên mô phỏng.',
        isLoading: false,
      });
    }
  },

  resetGame: () => set({
    ...INITIAL_STATE,
    allocations: balancedAllocation(BASE_BUDGET),
  }),

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
