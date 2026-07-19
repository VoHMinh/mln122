'use client';

import Leaderboard from '@/components/game/Leaderboard';
import CircuitBackground from '@/components/ui/CircuitBackground';

export default function LeaderboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center py-20 px-6 w-full relative bg-deep-circuit overflow-hidden">
      <CircuitBackground intensity={0.15} />
      
      <div className="z-10 relative w-full max-w-6xl flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-copper-trace via-yellow-500 to-signal-cyan mb-4 text-center">
          🏆 BẢNG XẾP HẠNG TRỰC TIẾP
        </h1>
        <p className="text-xl md:text-2xl text-pulse-text mb-16 text-center opacity-80">
          Mô phỏng đứt gãy công nghệ
        </p>

        <div className="w-full">
          <Leaderboard />
        </div>
      </div>
    </main>
  );
}
