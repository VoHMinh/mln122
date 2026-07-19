'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the GSAP plugin once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================
// Types
// ============================================================

export interface ScrollAnimationConfig {
  /** The animation to create (receives the trigger element and GSAP timeline) */
  animation: (
    element: HTMLElement,
    timeline: gsap.core.Timeline
  ) => void;

  /** ScrollTrigger configuration overrides */
  triggerOptions?: ScrollTrigger.Vars;

  /** Whether to skip this animation (e.g., reduced motion) */
  disabled?: boolean;

  /** Dependencies that should re-trigger setup (default: []) */
  dependencies?: React.DependencyList;
}

export interface UseScrollAnimationReturn {
  /** Ref to attach to the trigger element */
  ref: React.RefObject<HTMLElement | null>;

  /** Manually refresh ScrollTrigger positions (e.g., after content load) */
  refresh: () => void;
}

// ============================================================
// Hook
// ============================================================

/**
 * Hook wrapper for GSAP ScrollTrigger that handles:
 * - Plugin registration
 * - Proper cleanup on unmount
 * - Automatic refresh on window resize
 * - prefers-reduced-motion support via `disabled` flag
 *
 * Usage:
 * ```tsx
 * const { ref } = useScrollAnimation({
 *   animation: (el, tl) => {
 *     tl.from(el, { opacity: 0, y: 50, duration: 0.8 });
 *   },
 *   triggerOptions: { start: 'top 80%' },
 *   disabled: prefersReducedMotion,
 * });
 *
 * return <div ref={ref}>Animated content</div>;
 * ```
 */
export function useScrollAnimation({
  animation,
  triggerOptions = {},
  disabled = false,
  dependencies = [],
}: ScrollAnimationConfig): UseScrollAnimationReturn {
  const ref = useRef<HTMLElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const refresh = useCallback(() => {
    ScrollTrigger.refresh();
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;

    // Create a GSAP timeline with ScrollTrigger
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        ...triggerOptions,
      },
    });

    timelineRef.current = timeline;

    // Store the ScrollTrigger instance for cleanup
    if (timeline.scrollTrigger) {
      scrollTriggerRef.current = timeline.scrollTrigger;
    }

    // Execute the user's animation setup
    animation(element, timeline);

    // Handle resize — debounced refresh
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);

      // Kill the ScrollTrigger
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }

      // Kill the timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, ...dependencies]);

  return { ref, refresh };
}

// ============================================================
// Utility: Batch ScrollTrigger refresh
// ============================================================

/**
 * Refresh all ScrollTrigger instances.
 * Useful after dynamic content changes (images loaded, sections toggled, etc.)
 */
export function refreshAllScrollTriggers(): void {
  if (typeof window !== 'undefined') {
    ScrollTrigger.refresh();
  }
}
