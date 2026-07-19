'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type RevealDirection = 'up' | 'left' | 'right';

interface SectionRevealProps {
  children: ReactNode;
  /** Direction the element slides in from */
  direction?: RevealDirection;
  /** Delay in seconds before animation starts */
  delay?: number;
  /** Additional CSS class names */
  className?: string;
  /** ScrollTrigger start position */
  triggerStart?: string;
}

function getInitialTransform(direction: RevealDirection) {
  switch (direction) {
    case 'left':
      return { x: -60, y: 0 };
    case 'right':
      return { x: 60, y: 0 };
    case 'up':
    default:
      return { x: 0, y: 50 };
  }
}

export default function SectionReveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  triggerStart = 'top 85%',
}: SectionRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Show immediately, no animation
      gsap.set(el, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const { x, y } = getInitialTransform(direction);

    // Set initial state
    gsap.set(el, { opacity: 0, x, y });

    const tween = gsap.to(el, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: triggerStart,
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tween.kill();
      // Kill the associated ScrollTrigger
      tween.scrollTrigger?.kill();
    };
  }, [direction, delay, triggerStart]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
