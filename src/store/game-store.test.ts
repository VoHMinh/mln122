import { beforeEach, describe, expect, it } from 'vitest';
import { getGameGateway, resetGameGatewayForTests } from '@/lib/game-gateway';
import { useGameStore } from '@/store/game-store';
import { useRoomStore } from '@/store/room-store';
import { GamePhase } from '@/types';

async function createReadyRoom(nickname: string) {
  await useRoomStore.getState().createRoom({
    roomName: 'Ca hoc thu',
    groupNames: ['Nhom 1', 'Nhom 2'],
    nickname,
    groupName: 'Nhom 1',
  });
  await useRoomStore.getState().markReady();
}

describe('game store report lifecycle', () => {
  beforeEach(() => {
    resetGameGatewayForTests();
    useGameStore.getState().resetGame();
    useRoomStore.getState().leaveRoom();
    localStorage.clear();
  });

  it('does not advance before the player accepts the round report', async () => {
    await createReadyRoom('Minh');
    await useRoomStore.getState().startRoom();
    const snapshot = useRoomStore.getState().sessionSnapshot;
    expect(snapshot).not.toBeNull();

    useGameStore.getState().loadSession(snapshot!, true);
    useGameStore.getState().startTerm();
    useGameStore.getState().balanceAllocation();
    await useGameStore.getState().submitRound('B');

    expect(useGameStore.getState().phase).toBe(GamePhase.ROUND_REPORT);
    expect(useGameStore.getState().pendingResolution?.roundNumber).toBe(1);
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(useGameStore.getState().phase).toBe(GamePhase.ROUND_REPORT);
  });

  it('restores the exact pending report after a reload', async () => {
    await createReadyRoom('Lan');
    await useRoomStore.getState().startRoom();
    const snapshot = useRoomStore.getState().sessionSnapshot;
    useGameStore.getState().loadSession(snapshot!, true);
    useGameStore.getState().startTerm();
    useGameStore.getState().balanceAllocation();
    await useGameStore.getState().submitRound('A');

    const persisted = localStorage.getItem('mln2030-game-store');
    expect(persisted).toBeTruthy();
    useGameStore.getState().resetGame();
    localStorage.setItem('mln2030-game-store', persisted!);
    await useGameStore.persist.rehydrate();

    expect(useGameStore.getState().phase).toBe(GamePhase.ROUND_REPORT);
    expect(useGameStore.getState().pendingResolution?.roundNumber).toBe(1);
    expect(useGameStore.getState().session?.histories).toHaveLength(1);
  });

  it('starts each round at zero and only splits resources on command', async () => {
    await createReadyRoom('An');
    await useRoomStore.getState().startRoom();
    const snapshot = useRoomStore.getState().sessionSnapshot;

    useGameStore.getState().loadSession(snapshot!, true);
    expect(Object.values(useGameStore.getState().allocations)).toEqual([0, 0, 0, 0]);

    useGameStore.getState().balanceAllocation();
    expect(
      Object.values(useGameStore.getState().allocations).reduce((sum, value) => sum + value, 0),
    ).toBe(snapshot!.budgetForRound);
  });

  it('reconciles a stale final-round view to the debrief after the server recorded it', async () => {
    await createReadyRoom('Binh');
    await useRoomStore.getState().startRoom();
    const snapshot = useRoomStore.getState().sessionSnapshot!;
    const playerToken = useRoomStore.getState().playerToken!;
    const gateway = getGameGateway();

    useGameStore.getState().loadSession(snapshot, true);
    useGameStore.getState().startTerm();
    useGameStore.getState().balanceAllocation();
    await useGameStore.getState().submitRound('B');

    let remote = await gateway.getSession(snapshot.sessionId, playerToken);
    while (remote.histories.length < 4) {
      await gateway.submitRound(snapshot.sessionId, playerToken, {
        submissionId: crypto.randomUUID(),
        roundNumber: remote.currentRound,
        stateVersion: remote.stateVersion,
        allocation: {
          innovation: remote.budgetForRound,
          education: 0,
          infrastructure: 0,
          fdi: 0,
        },
        borrowedAmount: 0,
        eventChoice: 'B',
      });
      remote = await gateway.getSession(snapshot.sessionId, playerToken);
    }

    useGameStore.getState().loadSession(remote, true);

    expect(useGameStore.getState().session?.histories).toHaveLength(4);
    expect(useGameStore.getState().phase).toBe(GamePhase.DEBRIEF);
  });
});
