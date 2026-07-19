'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface CountUpNumberProps {
  /** Target number to count up to */
  value: number;
  /** Text after the number (e.g. '%', 'triệu') */
  suffix?: string;
  /** Text before the number (e.g. '$', '~') */
  prefix?: string;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Number of decimal places */
  decimals?: number;
  /** Additional CSS class names */
  className?: string;
  /** Locale for number formatting */
  locale?: string;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function CountUpNumber({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
  decimals = 0,
  className = '',
  locale = 'vi-VN',
}: CountUpNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion.current) {
      setDisplayValue(value);
      setHasAnimated(true);
    }
  }, [value]);

  const startAnimation = useCallback(() => {
    if (hasAnimated) return;
    setHasAnimated(true);

    if (prefersReducedMotion.current) {
      setDisplayValue(value);
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      setDisplayValue(easedProgress * value);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [value, duration, hasAnimated]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [startAnimation]);

  const formatted = displayValue.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span
      ref={elementRef}
      className={`font-mono tabular-nums ${className}`}
      aria-label={`${prefix}${value.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`}
    >
      {prefix}
      {formatted}
      {suffix && <span className="ml-1">{suffix}</span>}
    </span>
  );
}
