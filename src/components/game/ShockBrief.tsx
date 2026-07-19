'use client';

import { ArrowRight, ShieldAlert, Waves } from 'lucide-react';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SHOCK_CONTENT } from '@/lib/game-content';
import { useGameStore } from '@/store/game-store';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function ShockBrief() {
  const rootRef = useRef<HTMLElement>(null);
  const { session, dismissShock } = useGameStore();
  const reducedMotion = useReducedMotion();
  const shock = session ? SHOCK_CONTENT[session.shockId] : null;

  useGSAP(() => {
    if (reducedMotion) return;
    gsap.timeline()
      .from('.game2-shock-signal', { autoAlpha: 0, scale: 0.7, duration: 0.35 })
      .from('.game2-shock-copy > *', {
        autoAlpha: 0,
        y: 18,
        duration: 0.45,
        stagger: 0.08,
      }, '-=0.1');
  }, { scope: rootRef, dependencies: [reducedMotion] });

  if (!session || !shock) return null;
  return (
    <section ref={rootRef} className="game2-shock">
      <div className="game2-shock-signal" aria-hidden="true">
        <Waves size={46} />
        <i />
      </div>
      <div className="game2-shock-copy">
        <p className="game-overline"><ShieldAlert size={15} /> Biến cố chung của phòng</p>
        <span className="game2-shock-period">
          Giai đoạn {session.currentRound}/4 · Điều kiện chính sách đã thay đổi
        </span>
        <h1>{shock.title}</h1>
        <p>{shock.briefing}</p>
        <div className="game2-shock-protection">
          <span>Năng lực giúp giảm thiệt hại</span>
          <strong>{shock.protectedBy}</strong>
        </div>
        <button
          type="button"
          onClick={dismissShock}
          className="game-primary-action game-cursor-target"
        >
          Đánh giá lại nguồn lực <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}

