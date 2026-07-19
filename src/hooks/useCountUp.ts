'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCountUpOptions {
  /** The target number to count up to */
  target: number;
  /** Duration of the animation in ms (default: 2000) */
  duration?: number;
  /** Easing function (default: easeOutCubic) */
  easing?: (t: number) => number;
  /** Number of decimal places (default: 0) */
  decimals?: number;
  /** Whether to skip animation (e.g., for reduced motion) */
  skipAnimation?: boolean;
  /** IntersectionObserver threshold (default: 0.3) */
  threshold?: number;
}

interface UseCountUpReturn {
  /** The current animated value */
  value: number;
  /** Formatted string representation */
  formattedValue: string;
  /** Ref to attach to the element being observed */
  ref: React.RefObject<HTMLElement | null>;
  /** Whether the animation has completed */
  hasAnimated: boolean;
}

/** Default easeOutCubic easing */
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Hook that animates a number from 0 to a target value when the
 * attached element scrolls into view (IntersectionObserver-based).
 *
 * The animation only triggers once — on the first intersection.
 *
 * Usage:
 * ```tsx
 * const { value, ref } = useCountUp({ target: 44, duration: 1500 });
 * return <span ref={ref}>{value}</span>;
 * ```
 */
export function useCountUp({
  target,
  duration = 2000,
  easing = easeOutCubic,
  decimals = 0,
  skipAnimation = false,
  threshold = 0.3,
}: UseCountUpOptions): UseCountUpReturn {
  const [value, setValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    if (skipAnimation) {
      setValue(target);
      setHasAnimated(true);
      return;
    }

    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);

      const currentValue = easedProgress * target;
      setValue(
        decimals > 0
          ? parseFloat(currentValue.toFixed(decimals))
          : Math.round(currentValue)
      );

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        setValue(target);
        setHasAnimated(true);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, [target, duration, easing, decimals, skipAnimation]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already animated, don't observe again
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasAnimated) {
          animate();
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate, hasAnimated, threshold]);

  const formattedValue =
    decimals > 0 ? value.toFixed(decimals) : value.toLocaleString('vi-VN');

  return { value, formattedValue, ref, hasAnimated };
}
