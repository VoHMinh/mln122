'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CircleAlert, LoaderCircle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { GamePhase } from '@/types';
import { useGameStore } from '@/store/game-store';
import { getPolicyStage, POLICY_STAGES } from '@/lib/game-scenarios';
import GameBriefing from './GameBriefing';
import GameIntro from './GameIntro';
import NicknameForm from './NicknameForm';
import RoundPlay from './RoundPlay';
import EventCard from './EventCard';
import YearCountdown from './YearCountdown';
import PolicyDebrief from './PolicyDebrief';
import GameResult from './GameResult';
import Leaderboard from './Leaderboard';
import useReducedMotion from '@/hooks/useReducedMotion';

function isInTerm(phase: GamePhase) {
  return [GamePhase.PLAYING, GamePhase.EVENT, GamePhase.COUNTDOWN, GamePhase.DEBRIEF, GamePhase.RESULT].includes(phase);
}

export default function GameContainer() {
  const rootRef = useRef<HTMLElement>(null);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const { phase, currentRound, error, isLoading, clearError } = useGameStore();
  const prefersReducedMotion = useReducedMotion();
  const stage = getPolicyStage(currentRound);

  useGSAP(() => {
    if (prefersReducedMotion) return;
    gsap.fromTo('.game-shell', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', overwrite: true });
  }, { scope: rootRef, dependencies: [phase, prefersReducedMotion], revertOnUpdate: true });

  return (
    <section ref={rootRef} id="game-section" className="game-container mx-auto w-full max-w-[1400px]">
      <div className="game-commandbar relative z-30">
        <div className="min-w-0">
          <p className="game-overline">Mô phỏng chính sách</p>
          <p className="mt-1 truncate font-display text-sm font-semibold text-[#f2f7f7]">{isInTerm(phase) ? `${stage.period} · ${stage.title}` : 'Đường đến 2030'}</p>
        </div>
        <ol className="game-stage-rail" aria-label="Tiến trình bốn giai đoạn">
          {POLICY_STAGES.map((item) => {
            const isActive = isInTerm(phase) && item.round === currentRound;
            const isComplete = item.round < currentRound || phase === GamePhase.DEBRIEF || phase === GamePhase.RESULT;
            return <li key={item.round} className={isActive ? 'is-active' : isComplete ? 'is-complete' : ''}><span>{item.round}</span><small>{item.period.slice(2)}</small></li>;
          })}
        </ol>
        <button type="button" onClick={() => setBriefingOpen(true)} className="game-help-action" aria-label="Mở hướng dẫn trò chơi" title="Mở hướng dẫn trò chơi"><BookOpen size={16} strokeWidth={1.5} /><span>Hướng dẫn</span></button>
      </div>

      <div className={`game-shell relative overflow-hidden border border-white/10 bg-[#08151b] ${phase === GamePhase.NICKNAME ? 'game-shell--entry' : ''}`}>
        <div className="game-shell-grid" aria-hidden="true" />
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="game-error-banner relative z-10">
              <CircleAlert size={17} /><p>{error}</p><button type="button" onClick={clearError}>Đóng</button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div key={phase} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} className="relative z-10">
            {phase === GamePhase.NICKNAME && <NicknameForm onOpenBriefing={() => setBriefingOpen(true)} />}
            {phase === GamePhase.INTRO && <GameIntro />}
            {phase === GamePhase.PLAYING && <RoundPlay />}
            {phase === GamePhase.EVENT && <EventCard />}
            {phase === GamePhase.COUNTDOWN && <YearCountdown />}
            {phase === GamePhase.DEBRIEF && <PolicyDebrief />}
            {phase === GamePhase.RESULT && <GameResult />}
          </motion.div>
        </AnimatePresence>

        {isLoading && phase !== GamePhase.NICKNAME && phase !== GamePhase.EVENT && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-[#061016]/65 backdrop-blur-[2px]"><LoaderCircle className="animate-spin text-[#3cc7bd]" size={28} /></div>
        )}
      </div>

      {phase === GamePhase.RESULT && (
        <section className="game-leaderboard-wrap mt-8 border-t border-white/10 pt-8">
          <div className="mb-5"><p className="game-overline">Bảng xếp hạng phiên mô phỏng</p><h2 className="mt-2 font-display text-2xl font-semibold text-[#f2f7f7]">Quỹ đạo của các người chơi</h2></div>
          <Leaderboard />
        </section>
      )}

      <GameBriefing isOpen={briefingOpen} onClose={() => setBriefingOpen(false)} />
    </section>
  );
}
