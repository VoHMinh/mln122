import { describe, expect, it } from 'vitest';
import {
  createInitialSession,
  deriveShock,
  determineOutcome,
  resolveRound,
} from '@/lib/game-engine';
import type { PolicyChoice, RoundAllocation, RoundRequest, SessionSnapshot } from '@/types';

function allocation(
  total: number,
  ratios: [number, number, number, number],
): RoundAllocation {
  const education = Math.floor(total * ratios[0]);
  const innovation = Math.floor(total * ratios[1]);
  const infrastructure = Math.floor(total * ratios[2]);
  return {
    education,
    innovation,
    infrastructure,
    fdi: total - education - innovation - infrastructure,
  };
}

function request(
  session: SessionSnapshot,
  roundNumber: number,
  values: RoundAllocation,
  choice: PolicyChoice = 'B',
  borrowedAmount = 0,
): RoundRequest {
  return {
    submissionId: `submission-${roundNumber}`,
    roundNumber,
    stateVersion: session.stateVersion,
    allocation: values,
    borrowedAmount,
    eventChoice: choice,
  };
}

describe('game engine', () => {
  it('uses the same shock for the same room seed', () => {
    expect(deriveShock('room-alpha')).toEqual(deriveShock('room-alpha'));
    expect([2, 3]).toContain(deriveShock('room-alpha').round);
  });

  it('matures education one round later', () => {
    const start = createInitialSession('s1', 'r1', 'Minh', 'SE18', 'seed-a');
    const first = resolveRound(
      start,
      request(start, 1, allocation(100, [0.5, 0.2, 0.2, 0.1]), 'A'),
    );
    expect(first.resolution.metricsAfter.absorption).toBe(11);

    const total = first.nextSession.budgetForRound;
    const second = resolveRound(
      first.nextSession,
      request(first.nextSession, 2, allocation(total, [0.2, 0.3, 0.3, 0.2]), 'B'),
    );
    expect(second.resolution.metricsBefore.absorption).toBeGreaterThan(
      first.resolution.metricsAfter.absorption,
    );
    expect(second.resolution.effectCodes).toContain('EDUCATION_MATURED');
  });

  it('only triggers dependency after two consecutive risky rounds', () => {
    const start = createInitialSession('s2', 'r1', 'Lan', 'SE18', 'seed-b');
    const firstAllocation = allocation(100, [0.15, 0.1, 0.1, 0.65]);
    const first = resolveRound(start, request(start, 1, firstAllocation, 'B'));
    expect(first.resolution.metricsAfter.dependencyStreak).toBe(1);
    expect(first.resolution.metricsAfter.dependencyPenalty).toBe(0);

    const total = first.nextSession.budgetForRound;
    const secondAllocation = allocation(total, [0.15, 0.1, 0.1, 0.65]);
    const second = resolveRound(
      first.nextSession,
      request(first.nextSession, 2, secondAllocation, 'A'),
    );
    expect(second.resolution.metricsAfter.dependencyStreak).toBe(2);
    expect(second.resolution.metricsAfter.dependencyPenalty).toBe(0.15);
    expect(second.resolution.effectCodes).toContain('DEPENDENCY_TRIGGERED');
  });

  it('charges 120 percent of borrowed resources in the next budget', () => {
    const start = createInitialSession('s3', 'r1', 'Hoa', 'SE18', 'seed-c');
    const total = 150;
    const result = resolveRound(
      start,
      request(start, 1, allocation(total, [0.25, 0.25, 0.25, 0.25]), 'B', 50),
    );
    expect(result.resolution.metricsAfter.debtDueNextRound).toBe(60);
    expect(result.resolution.nextBudget).toBeLessThan(100);
  });

  it('rejects borrowing above half of the base budget', () => {
    const start = createInitialSession('s4', 'r1', 'Tuan', 'SE18', 'seed-d');
    expect(() =>
      resolveRound(
        start,
        request(start, 1, allocation(151, [0.25, 0.25, 0.25, 0.25]), 'B', 51),
      ),
    ).toThrow('tối đa');
  });

  it('locks a high-scoring path at dependent when policy does not build ownership', () => {
    expect(determineOutcome(200, 50, true)).toBe('DEPENDENT');
    expect(determineOutcome(130, 20, false)).toBe('LEAPFROG');
  });
});

