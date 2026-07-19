'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './TargetCursor.css';

type TargetCursorProps = {
  targetSelector?: string;
  cursorColor?: string;
  cursorColorOnTarget?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
  followOnly?: boolean;
};

const REST_OFFSETS = [
  [-18, -18],
  [4, -18],
  [4, 4],
  [-18, 4],
] as const;

type Point = { x: number; y: number };

export default function TargetCursor({
  targetSelector = '.cursor-target',
  cursorColor = '#41d6c3',
  cursorColorOnTarget,
  spinDuration = 3,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  followOnly = false,
}: TargetCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

    const dot = cursor.querySelector<HTMLElement>('.target-cursor-dot');
    const corners = Array.from(cursor.querySelectorAll<HTMLElement>('.target-cursor-corner'));
    if (!dot || corners.length !== 4) return;

    const previousCursor = document.body.style.cursor;
    const cursorRoot = document.documentElement;
    const pointer: Point = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let activeTarget: HTMLElement | null = null;
    let hasPointer = false;
    let targetCorners: Point[] | null = null;

    const movementDuration = parallaxOn ? 0.16 : 0;
    const lockDuration = Math.min(Math.max(hoverDuration, 0.08), 0.35);
    const xTo = gsap.quickTo(cursor, 'x', { duration: movementDuration, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: movementDuration, ease: 'power3.out' });
    const spin = gsap.timeline({ repeat: -1, paused: true }).to(cursor, {
      rotation: 360,
      duration: Math.max(spinDuration, 0.6),
      ease: 'none',
    });

    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
      cursorRoot.classList.add('target-cursor-native-hidden');
    }

    gsap.set(cursor, { x: pointer.x, y: pointer.y, rotation: 0, transformOrigin: '0 0' });
    gsap.set(dot, { xPercent: -50, yPercent: -50, autoAlpha: 1, scale: 1, backgroundColor: cursorColor });
    corners.forEach((corner, index) => {
      gsap.set(corner, {
        x: REST_OFFSETS[index][0],
        y: REST_OFFSETS[index][1],
        autoAlpha: 1,
        borderColor: cursorColor,
      });
    });
    spin.play();

    const getTarget = (element: EventTarget | null) => {
      if (followOnly || !(element instanceof Element)) return null;
      const target = element.closest<HTMLElement>(targetSelector);
      return target && !target.matches(':disabled, [aria-disabled="true"]') ? target : null;
    };

    const measureTarget = (target: HTMLElement) => {
      const rect = target.getBoundingClientRect();
      const gap = 5;
      const cornerSize = 14;
      targetCorners = [
        { x: rect.left - gap, y: rect.top - gap },
        { x: rect.right - cornerSize + gap, y: rect.top - gap },
        { x: rect.right - cornerSize + gap, y: rect.bottom - cornerSize + gap },
        { x: rect.left - gap, y: rect.bottom - cornerSize + gap },
      ];
    };

    // The wrapper follows the pointer while each bracket compensates for that
    // movement. This keeps the target frame anchored without spawning tweens on every pointer event.
    const syncTargetFrame = () => {
      if (!activeTarget || !targetCorners) return;
      const cursorX = Number(gsap.getProperty(cursor, 'x')) || pointer.x;
      const cursorY = Number(gsap.getProperty(cursor, 'y')) || pointer.y;
      corners.forEach((corner, index) => {
        gsap.set(corner, {
          x: targetCorners![index].x - cursorX,
          y: targetCorners![index].y - cursorY,
        });
      });
    };

    const restoreFreeCursor = () => {
      gsap.killTweensOf([dot, ...corners]);
      gsap.set(cursor, { rotation: 0 });
      gsap.set(dot, { autoAlpha: 1, scale: 1, backgroundColor: cursorColor });
      corners.forEach((corner, index) => {
        gsap.set(corner, {
          x: REST_OFFSETS[index][0],
          y: REST_OFFSETS[index][1],
          autoAlpha: 1,
          borderColor: cursorColor,
        });
      });
      spin.restart(true);
    };

    const activateTarget = (target: HTMLElement) => {
      if (activeTarget === target) return;

      const wasTargeting = activeTarget !== null;
      activeTarget = target;
      measureTarget(target);
      spin.pause();
      gsap.killTweensOf([dot, ...corners]);
      gsap.set(cursor, { rotation: 0 });
      gsap.to(dot, { autoAlpha: 0, scale: 0.65, duration: lockDuration, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(corners, {
        autoAlpha: 1,
        borderColor: cursorColorOnTarget ?? cursorColor,
        duration: lockDuration,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      if (!wasTargeting) gsap.ticker.add(syncTargetFrame);
      syncTargetFrame();
      cursor.dataset.active = 'true';
    };

    const deactivateTarget = () => {
      if (!activeTarget) return;
      activeTarget = null;
      targetCorners = null;
      delete cursor.dataset.active;
      gsap.ticker.remove(syncTargetFrame);
      restoreFreeCursor();
    };

    const move = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      hasPointer = true;
      cursor.dataset.ready = 'true';
      xTo(pointer.x);
      yTo(pointer.y);

      const nextTarget = getTarget(event.target);
      if (nextTarget) activateTarget(nextTarget);
      else deactivateTarget();
    };

    const refreshTarget = () => {
      if (!hasPointer || followOnly) return;
      const nextTarget = getTarget(document.elementFromPoint(pointer.x, pointer.y));
      if (nextTarget) {
        activateTarget(nextTarget);
        measureTarget(nextTarget);
        syncTargetFrame();
      } else {
        deactivateTarget();
      }
    };

    const hideCursor = () => {
      deactivateTarget();
      delete cursor.dataset.ready;
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', refreshTarget, { passive: true });
    window.addEventListener('resize', refreshTarget, { passive: true });
    document.addEventListener('pointerleave', hideCursor, { passive: true });

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', refreshTarget);
      window.removeEventListener('resize', refreshTarget);
      document.removeEventListener('pointerleave', hideCursor);
      gsap.ticker.remove(syncTargetFrame);
      spin.kill();
      gsap.killTweensOf([cursor, dot, ...corners]);
      document.body.style.cursor = previousCursor;
      cursorRoot.classList.remove('target-cursor-native-hidden');
    };
  }, [cursorColor, cursorColorOnTarget, followOnly, hideDefaultCursor, hoverDuration, parallaxOn, spinDuration, targetSelector]);

  return (
    <div
      ref={cursorRef}
      className="target-cursor-wrapper"
      style={{ '--target-cursor-color': cursorColor } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="target-cursor-dot" />
      <span className="target-cursor-corner target-cursor-corner--tl" />
      <span className="target-cursor-corner target-cursor-corner--tr" />
      <span className="target-cursor-corner target-cursor-corner--br" />
      <span className="target-cursor-corner target-cursor-corner--bl" />
    </div>
  );
}
