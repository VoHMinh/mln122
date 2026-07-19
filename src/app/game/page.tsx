import GameContainer from '@/components/game/GameContainer';
import TargetCursor from '@/components/ui/TargetCursor';

export default function GamePage() {
  return (
    <main className="game-route min-h-[100dvh] overflow-x-hidden bg-[#061016] px-4 pb-8 pt-[5rem] text-[#f2f7f7] md:px-8 lg:px-12">
      <div className="game-page-grid" aria-hidden="true" />
      <TargetCursor
        targetSelector="#game-section button:not(:disabled), #game-section input[type='range']:not(:disabled), #game-section select:not(:disabled), #game-section [role='button']:not([aria-disabled='true'])"
        cursorColor="#3cc7bd"
        cursorColorOnTarget="#3cc7bd"
        spinDuration={3.4}
      />
      <div className="relative mx-auto w-full max-w-[1400px]">
        <GameContainer />
      </div>
    </main>
  );
}
