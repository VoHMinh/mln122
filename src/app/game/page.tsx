import GameContainer from '@/components/game/GameContainer';
import TargetCursor from '@/components/ui/TargetCursor';

export default function GamePage() {
  return (
    <main className="game-route bg-[#061016] px-3 pb-3 pt-[4.65rem] text-[#f2f7f7] md:px-8 lg:px-12">
      <div className="game-page-grid" aria-hidden="true" />
      <TargetCursor
        targetSelector="#game-section .game-cursor-target:not(:disabled):not([aria-disabled='true'])"
        cursorColor="#3cc7bd"
        cursorColorOnTarget="#3cc7bd"
        spinDuration={3.4}
      />
      <div className="game-route-frame relative mx-auto w-full max-w-[1400px]">
        <GameContainer />
      </div>
    </main>
  );
}
