import { beforeEach, describe, expect, it } from 'vitest';
import { MockGameGateway } from '@/lib/gateways/mock-game-gateway';

describe('mock room gateway', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates a room, joins a player and starts a shared deadline', async () => {
    const gateway = new MockGameGateway();
    const created = await gateway.createRoom('Minh', 600);
    const joined = await gateway.joinRoom(created.room.roomCode, 'Minh', 'SE18');
    const started = await gateway.startRoom(created.room.roomId, created.hostToken);

    expect(joined.room.participants).toHaveLength(1);
    expect(started.status).toBe('IN_PROGRESS');
    expect(started.endsAt).not.toBeNull();
  });

  it('returns the same resolution for a duplicate submission id', async () => {
    const gateway = new MockGameGateway();
    const created = await gateway.createRoom('Minh', 600);
    const joined = await gateway.joinRoom(created.room.roomCode, 'Minh', 'SE18');
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
    const created = await gateway.createRoom('Minh', 0);
    await gateway.joinRoom(created.room.roomCode, 'Minh', 'SE18');
    await gateway.startRoom(created.room.roomId, created.hostToken);

    const expired = await gateway.getRoom(created.room.roomId);
    expect(expired.status).toBe('ENDED');
  });

  it('publishes shared room progress to active subscribers', async () => {
    const gateway = new MockGameGateway();
    const created = await gateway.createRoom('Minh', 600);
    await gateway.joinRoom(created.room.roomCode, 'Minh', 'SE18');
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
    const created = await gateway.createRoom('Minh', 600);
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
});
