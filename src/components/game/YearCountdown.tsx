'use client';

import { ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGameStore } from '@/store/game-store';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function YearCountdown() {
  const rootRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const showDebrief = useGameStore((state) => state.showDebrief);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion) return;
    gsap.timeline({ onComplete: () => setReady(true) })
      .from('.game2-countdown-number', {
        autoAlpha: 0,
        scale: 1.3,
        duration: 0.36,
        stagger: 0.34,
      })
      .to('.game2-countdown-number', {
        autoAlpha: 0.16,
        scale: 0.82,
        duration: 0.22,
        stagger: 0.24,
      }, '+=0.05')
      .from('.game2-countdown-year', {
        autoAlpha: 0,
        y: 28,
        duration: 0.65,
      }, '-=0.05')
      .from('.game2-countdown-copy', {
        autoAlpha: 0,
        y: 14,
        duration: 0.4,
      }, '-=0.22');
  }, { scope: rootRef, dependencies: [reducedMotion] });

  return (
    <section ref={rootRef} className="game2-countdown">
      <p className="game-overline">Bốn giai đoạn đã được ghi nhận</p>
      <div className="game2-countdown-digits" aria-hidden="true">
        <span className="game2-countdown-number">3</span>
        <span className="game2-countdown-number">2</span>
        <span className="game2-countdown-number">1</span>
      </div>
      <h1 className="game2-countdown-year">Năm 2030 đã đến.</h1>
      <p className="game2-countdown-copy">
        Điểm số chỉ cho biết bạn đi được bao xa. Hồ sơ chính sách sẽ cho biết
        bạn đã đi bằng nội lực, bằng đòn bẩy hay bằng sự phụ thuộc.
      </p>
      {(ready || reducedMotion) && (
        <button
          type="button"
          onClick={showDebrief}
          className="game-primary-action game-cursor-target"
        >
          Mở hồ sơ nhiệm kỳ <ArrowRight size={17} />
        </button>
      )}
    </section>
  );
}
