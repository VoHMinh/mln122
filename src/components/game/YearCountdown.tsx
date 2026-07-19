'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGameStore } from '@/store/game-store';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function YearCountdown() {
  const rootRef = useRef<HTMLElement>(null);
  const showDebrief = useGameStore((state) => state.showDebrief);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion) {
      showDebrief();
      return;
    }
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: showDebrief });
    timeline
      .from('.game-countdown-kicker', { autoAlpha: 0, y: 16, duration: 0.35 })
      .fromTo('.game-countdown-number', { autoAlpha: 0, scale: 1.35 }, { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.42 }, '-=0.05')
      .to('.game-countdown-number', { autoAlpha: 0, scale: 0.78, duration: 0.25, stagger: 0.32 }, '+=0.05')
      .from('.game-countdown-year', { autoAlpha: 0, y: 34, duration: 0.72 }, '-=0.05')
      .to('.game-countdown-year', { autoAlpha: 0, duration: 0.35 }, '+=1.05');
  }, { scope: rootRef, dependencies: [prefersReducedMotion, showDebrief] });

  return (
    <section ref={rootRef} className="game-countdown-scene text-center">
      <p className="game-countdown-kicker game-overline">Giai đoạn bốn đã được ghi nhận</p>
      <div className="mt-8 flex justify-center gap-6 font-mono text-[clamp(4rem,11vw,9rem)] font-semibold leading-none text-[#e9a35a]">
        <span className="game-countdown-number">3</span><span className="game-countdown-number">2</span><span className="game-countdown-number">1</span>
      </div>
      <p className="game-countdown-year mt-8 font-display text-[clamp(2.4rem,6vw,6.5rem)] font-semibold leading-none text-[#f2f7f7]">NĂM 2030 ĐÃ ĐẾN.</p>
    </section>
  );
}
