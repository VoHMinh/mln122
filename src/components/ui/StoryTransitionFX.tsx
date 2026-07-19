'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import useReducedMotion from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function StoryTransitionFX() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !overlayRef.current) return;

      const pulse = () => {
        gsap
          .timeline()
          .set(overlayRef.current, { autoAlpha: 1 })
          .fromTo(
            '.story-transition-rift',
            { scaleX: 0, opacity: 0, xPercent: -18 },
            { scaleX: 1, opacity: 0.8, xPercent: 0, duration: 0.18, ease: 'power2.out' },
          )
          .fromTo(
            '.story-transition-scan',
            { xPercent: -120, opacity: 0 },
            { xPercent: 120, opacity: 0.46, duration: 0.32, ease: 'power3.inOut' },
            '<',
          )
          .to('.story-transition-rift', { scaleX: 1.18, opacity: 0, duration: 0.2, ease: 'power2.in' })
          .set(overlayRef.current, { autoAlpha: 0 });
      };

      const triggers = gsap.utils.toArray<HTMLElement>(
        '#data-story-1, #cta, #lessons, #opportunities, #solutions, #conclusion',
      );

      triggers.forEach((trigger) => {
        ScrollTrigger.create({
          trigger,
          start: 'top 68%',
          onEnter: pulse,
          onEnterBack: pulse,
        });
      });
    },
    { scope: overlayRef, dependencies: [prefersReducedMotion] },
  );

  return (
    <div ref={overlayRef} className="story-transition-fx" aria-hidden="true">
      <div className="story-transition-rift" />
      <div className="story-transition-scan" />
    </div>
  );
}
