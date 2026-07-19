import GameHistory from '@/components/game/GameHistory';

export default function LeaderboardPage() {
  return (
    <main className="game-history-route">
      <div className="game-page-grid" aria-hidden="true" />
      <GameHistory />
    </main>
  );
}
