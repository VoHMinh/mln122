import { beforeEach, describe, expect, it } from 'vitest';
import { MockGameGateway } from '@/lib/gateways/mock-game-gateway';

function createRoom(gateway: MockGameGateway, durationSeconds = 600) {
  return gateway.createRoom({
    roomName: 'Ca học thử',
    groupNames: ['Nhóm 1', 'Nhóm 2'],
    durationSeconds,
  });
}

function joinRoom(
  gateway: MockGameGateway,
  roomCode: string,
  nickname = 'Minh',
  groupName = 'Nhóm 1',
) {
  return gateway.joinRoom({
    roomCode,
    nickname,
    groupName,
    profileToken: `profile-${nickname}`,
  });
}

async function completePlayer(
  gateway: MockGameGateway,
  joined: Awaited<ReturnType<typeof joinRoom>>,
  focus: 'education' | 'innovation' | 'infrastructure' | 'fdi',
) {
  let session = joined.session;
  for (let roundNumber = 1; roundNumber <= 4; roundNumber += 1) {
    const allocation = {
      education: 0,
      innovation: 0,
      infrastructure: 0,
      fdi: 0,
    };
    allocation[focus] = session.budgetForRound;
    await gateway.submitRound(
      session.sessionId,
      joined.playerToken,
      {
        submissionId: `${session.sessionId}-${roundNumber}`,
        roundNumber,
        stateVersion: session.stateVersion,
        allocation,
        borrowedAmount: 0,
        eventChoice: roundNumber === 4 ? 'A' : 'B',
      },
    );
    session = await gateway.getSession(session.sessionId, joined.playerToken);
  }
  return gateway.completeSession(session.sessionId, joined.playerToken);
}

describe('mock room gateway', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates a room, joins a player and starts a shared deadline', async () => {
    const gateway = new MockGameGateway();
    const created = await createRoom(gateway);
    const joined = await joinRoom(gateway, created.room.roomCode);
    await gateway.markReady(joined.session.sessionId, joined.playerToken);
    const started = await gateway.startRoom(created.room.roomId, created.hostToken);

    expect(joined.room.participants).toHaveLength(1);
    expect(started.status).toBe('IN_PROGRESS');
    expect(started.endsAt).not.toBeNull();
  });

  it('returns the same resolution for a duplicate submission id', async () => {
    const gateway = new MockGameGateway();
    const created = await createRoom(gateway);
    const joined = await joinRoom(gateway, created.room.roomCode);
    await gateway.markReady(joined.session.sessionId, joined.playerToken);
    await gateway.startRoom(created.room.roomId, created.hostToken);
    const request = {
      submissionId: 'fixed-id',
      roundNumber: 1,
      stateVersion: joined.session.stateVersion,
      allocation: { education: 25, innovation: 25, infrastructure: 25, fdi: 25 },
      borrowedAmount: 0,
      eventChoice: 'B' as const,
    };

    const first = await gateway.submitRound(
      joined.session.sessionId,
      joined.playerToken,
      request,
    );
    const duplicate = await gateway.submitRound(
      joined.session.sessionId,
      joined.playerToken,
      request,
    );
    const restored = await gateway.getSession(
      joined.session.sessionId,
      joined.playerToken,
    );

    expect(duplicate).toEqual(first);
    expect(restored.histories).toHaveLength(1);
  });

  it('ends the room from the server deadline instead of a client countdown', async () => {
    const gateway = new MockGameGateway();
    const created = await createRoom(gateway, 0);
    const joined = await joinRoom(gateway, created.room.roomCode);
    await gateway.markReady(joined.session.sessionId, joined.playerToken);
    await gateway.startRoom(created.room.roomId, created.hostToken);

    const expired = await gateway.getRoom(created.room.roomId);
    expect(expired.status).toBe('ENDED');
  });

  it('publishes shared room progress to active subscribers', async () => {
    const gateway = new MockGameGateway();
    const created = await createRoom(gateway);
    const joined = await joinRoom(gateway, created.room.roomCode);
    await gateway.markReady(joined.session.sessionId, joined.playerToken);
    const statuses: string[] = [];
    const subscription = gateway.subscribeRoom(
      created.room.roomId,
      created.hostToken,
      (room) => statuses.push(room.status),
    );

    await gateway.startRoom(created.room.roomId, created.hostToken);
    await new Promise((resolve) => setTimeout(resolve, 80));
    subscription.close();

    expect(statuses).toContain('IN_PROGRESS');
  });

  it('does not deliver a pending room snapshot after subscription close', async () => {
    const gateway = new MockGameGateway();
    const created = await createRoom(gateway);
    const statuses: string[] = [];
    const subscription = gateway.subscribeRoom(
      created.room.roomId,
      created.hostToken,
      (room) => statuses.push(room.status),
    );

    subscription.close();
    await new Promise((resolve) => setTimeout(resolve, 60));

    expect(statuses).toEqual([]);
  });

  it('allows multiple players in the same group and aggregates their ranking', async () => {
    const gateway = new MockGameGateway();
    const created = await createRoom(gateway);
    const first = await joinRoom(gateway, created.room.roomCode, 'Minh');
    const second = await joinRoom(gateway, created.room.roomCode, 'Lan');

    await gateway.markReady(first.session.sessionId, first.playerToken);
    await gateway.markReady(second.session.sessionId, second.playerToken);
    await gateway.startRoom(created.room.roomId, created.hostToken);

    const leaderboard = await gateway.getLeaderboard(created.room.roomId);
    expect(leaderboard.groups[0]).toMatchObject({
      groupName: first.session.groupName,
      memberCount: 2,
    });
  });

  it('ranks each group by its highest-scoring representative', async () => {
    const gateway = new MockGameGateway();
    const created = await createRoom(gateway);
    const first = await joinRoom(gateway, created.room.roomCode, 'Minh', 'Nhóm 1');
    const second = await joinRoom(gateway, created.room.roomCode, 'Lan', 'Nhóm 1');
    const third = await joinRoom(gateway, created.room.roomCode, 'An', 'Nhóm 2');

    for (const player of [first, second, third]) {
      await gateway.markReady(player.session.sessionId, player.playerToken);
    }
    await gateway.startRoom(created.room.roomId, created.hostToken);

    const firstResult = await completePlayer(gateway, first, 'innovation');
    const secondResult = await completePlayer(gateway, second, 'infrastructure');
    const thirdResult = await completePlayer(gateway, third, 'education');
    const leaderboard = await gateway.getLeaderboard(created.room.roomId);
    const groupOne = leaderboard.groups.find((group) => group.groupName === 'Nhóm 1');
    const groupTwo = leaderboard.groups.find((group) => group.groupName === 'Nhóm 2');
    const expectedGroupOne =
      firstResult.finalScore >= secondResult.finalScore
        ? { name: 'Minh', score: firstResult.finalScore }
        : { name: 'Lan', score: secondResult.finalScore };

    expect(groupOne).toMatchObject({
      championName: expectedGroupOne.name,
      championScore: expectedGroupOne.score,
      completionCount: 2,
      memberCount: 2,
    });
    expect(groupTwo).toMatchObject({
      championName: 'An',
      championScore: thirdResult.finalScore,
      completionCount: 1,
      memberCount: 1,
    });
    expect(groupOne?.rank).toBe(
      expectedGroupOne.score >= thirdResult.finalScore ? 1 : 2,
    );
  });

  it('blocks a normal start while someone is onboarding and allows a host override', async () => {
    const gateway = new MockGameGateway();
    const created = await createRoom(gateway);
    const readyPlayer = await joinRoom(gateway, created.room.roomCode, 'Minh');
    await joinRoom(gateway, created.room.roomCode, 'Lan');
    await gateway.markReady(readyPlayer.session.sessionId, readyPlayer.playerToken);

    await expect(
      gateway.startRoom(created.room.roomId, created.hostToken),
    ).rejects.toThrow(/chua san sang|chưa sẵn sàng/i);

    const started = await gateway.startRoom(
      created.room.roomId,
      created.hostToken,
      true,
    );
    expect(started.status).toBe('IN_PROGRESS');
  });

  it('keeps room-specific history for the anonymous player profile', async () => {
    const gateway = new MockGameGateway();
    const created = await createRoom(gateway);
    const joined = await joinRoom(gateway, created.room.roomCode, 'Minh');

    const history = await gateway.getPlayerHistory('profile-Minh');
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      roomId: created.room.roomId,
      roomName: created.room.roomName,
      groupName: joined.session.groupName,
    });
  });
});
