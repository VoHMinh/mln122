import { afterEach, describe, expect, it } from 'vitest';
import { HttpGameGateway } from '@/lib/gateways/http-game-gateway';
import { MockGameGateway } from '@/lib/gateways/mock-game-gateway';
import { getGameGateway, resetGameGatewayForTests } from '@/lib/game-gateway';

const originalMode = process.env.NEXT_PUBLIC_GAME_API_MODE;

afterEach(() => {
  if (originalMode === undefined) {
    delete process.env.NEXT_PUBLIC_GAME_API_MODE;
  } else {
    process.env.NEXT_PUBLIC_GAME_API_MODE = originalMode;
  }
  resetGameGatewayForTests();
});

describe('game gateway selection', () => {
  it('uses the mock adapter for tests when no mode is configured', () => {
    delete process.env.NEXT_PUBLIC_GAME_API_MODE;

    expect(getGameGateway()).toBeInstanceOf(MockGameGateway);
  });

  it('uses the HTTP adapter when live mode is configured', () => {
    process.env.NEXT_PUBLIC_GAME_API_MODE = 'http';

    expect(getGameGateway()).toBeInstanceOf(HttpGameGateway);
  });
});
