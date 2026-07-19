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

function validTarget(target: HTMLElement | null) {
  if (!target || !target.isConnected) return false;
  if (target.matches(':disabled, [aria-disabled="true"]')) return false;
  const rect = target.getBoundingClientRect();
  return rect.width > 1 && rect.height > 1;
}

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
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const frame = frameRef.current;
    const mediaCoarse = window.matchMedia('(pointer: coarse)');
    const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!cursor || !frame || mediaCoarse.matches || mediaReduced.matches) return;

    const dot = cursor.querySelector<HTMLElement>('.target-cursor-dot');
    const freeCorners = Array.from(
      cursor.querySelectorAll<HTMLElement>('.target-cursor-free-corner'),
    );
    const frameCorners = Array.from(
      frame.querySelectorAll<HTMLElement>('.target-cursor-frame-corner'),
    );
    if (!dot || freeCorners.length !== 4 || frameCorners.length !== 4) return;

    const root = document.documentElement;
    const previousBodyCursor = document.body.style.cursor;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const followDuration = parallaxOn ? 0.12 : 0;
    const lockDuration = Math.min(Math.max(hoverDuration, 0.08), 0.3);
    let activeTarget: HTMLElement | null = null;
    let observer: ResizeObserver | null = null;
    let raf = 0;

    const xTo = gsap.quickTo(cursor, 'x', {
      duration: followDuration,
      ease: 'power3.out',
    });
    const yTo = gsap.quickTo(cursor, 'y', {
      duration: followDuration,
      ease: 'power3.out',
    });
    const spin = gsap.timeline({ repeat: -1, paused: true }).to(cursor, {
      rotation: 360,
      duration: Math.max(spinDuration, 0.6),
      ease: 'none',
    });

    gsap.set(cursor, {
      x: pointer.x,
      y: pointer.y,
      rotation: 0,
      transformOrigin: '0 0',
    });
    gsap.set(dot, {
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 1,
      scale: 1,
      backgroundColor: cursorColor,
    });
    freeCorners.forEach((corner, index) => {
      gsap.set(corner, {
        x: REST_OFFSETS[index][0],
        y: REST_OFFSETS[index][1],
        autoAlpha: 1,
        borderColor: cursorColor,
      });
    });
    gsap.set(frame, { autoAlpha: 0 });
    gsap.set(frameCorners, {
      borderColor: cursorColorOnTarget ?? cursorColor,
    });
    spin.play();

    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
      root.classList.add('target-cursor-native-hidden');
    }

    const measureFrame = () => {
      if (!validTarget(activeTarget)) {
        deactivate();
        return;
      }
      const rect = activeTarget!.getBoundingClientRect();
      const gap = 5;
      gsap.set(frame, {
        x: rect.left - gap,
        y: rect.top - gap,
        width: rect.width + gap * 2,
        height: rect.height + gap * 2,
      });
    };

    const disconnectObserver = () => {
      observer?.disconnect();
      observer = null;
    };

    const deactivate = () => {
      if (!activeTarget && frame.dataset.active !== 'true') return;
      activeTarget = null;
      disconnectObserver();
      delete frame.dataset.active;
      gsap.killTweensOf([frame, dot, ...freeCorners]);
      gsap.to(frame, {
        autoAlpha: 0,
        scale: 0.985,
        duration: lockDuration * 0.75,
        ease: 'power2.out',
        overwrite: true,
      });
      gsap.to(dot, {
        autoAlpha: 1,
        scale: 1,
        duration: lockDuration,
        ease: 'power2.out',
        overwrite: true,
      });
      gsap.to(freeCorners, {
        autoAlpha: 1,
        duration: lockDuration,
        ease: 'power2.out',
        overwrite: true,
      });
      gsap.set(cursor, { rotation: 0 });
      spin.restart(true);
    };

    const activate = (target: HTMLElement) => {
      if (activeTarget === target && validTarget(target)) {
        measureFrame();
        return;
      }
      deactivate();
      activeTarget = target;
      spin.pause();
      gsap.set(cursor, { rotation: 0 });
      measureFrame();
      if (!activeTarget) return;
      frame.dataset.active = 'true';
      gsap.killTweensOf([frame, dot, ...freeCorners]);
      gsap.fromTo(
        frame,
        { autoAlpha: 0, scale: 0.985 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: lockDuration,
          ease: 'power2.out',
          overwrite: true,
        },
      );
      gsap.to(dot, {
        autoAlpha: 0,
        scale: 0.65,
        duration: lockDuration,
        overwrite: true,
      });
      gsap.to(freeCorners, {
        autoAlpha: 0,
        duration: lockDuration * 0.7,
        overwrite: true,
      });
      observer = new ResizeObserver(measureFrame);
      observer.observe(target);
    };

    const targetAtPointer = () => {
      if (followOnly) return null;
      const element = document.elementFromPoint(pointer.x, pointer.y);
      const target =
        element instanceof Element
          ? element.closest<HTMLElement>(targetSelector)
          : null;
      return validTarget(target) ? target : null;
    };

    const refresh = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const target = targetAtPointer();
        if (target) activate(target);
        else deactivate();
      });
    };

    const move = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      cursor.dataset.ready = 'true';
      xTo(pointer.x);
      yTo(pointer.y);
      refresh();
    };

    const hide = () => {
      deactivate();
      delete cursor.dataset.ready;
    };

    const onVisibility = () => {
      if (document.hidden) hide();
      else refresh();
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', refresh, { passive: true });
    window.addEventListener('blur', hide);
    document.addEventListener('pointerleave', hide);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('blur', hide);
      document.removeEventListener('pointerleave', hide);
      document.removeEventListener('visibilitychange', onVisibility);
      disconnectObserver();
      spin.kill();
      gsap.killTweensOf([cursor, frame, dot, ...freeCorners, ...frameCorners]);
      document.body.style.cursor = previousBodyCursor;
      root.classList.remove('target-cursor-native-hidden');
    };
  }, [
    cursorColor,
    cursorColorOnTarget,
    followOnly,
    hideDefaultCursor,
    hoverDuration,
    parallaxOn,
    spinDuration,
    targetSelector,
  ]);

  const style = { '--target-cursor-color': cursorColor } as React.CSSProperties;
  return (
    <>
      <div ref={cursorRef} className="target-cursor-wrapper" style={style} aria-hidden="true">
        <span className="target-cursor-dot" />
        <span className="target-cursor-corner target-cursor-free-corner target-cursor-corner--tl" />
        <span className="target-cursor-corner target-cursor-free-corner target-cursor-corner--tr" />
        <span className="target-cursor-corner target-cursor-free-corner target-cursor-corner--br" />
        <span className="target-cursor-corner target-cursor-free-corner target-cursor-corner--bl" />
      </div>
      <div ref={frameRef} className="target-cursor-frame" style={style} aria-hidden="true">
        <span className="target-cursor-corner target-cursor-frame-corner target-cursor-corner--tl" />
        <span className="target-cursor-corner target-cursor-frame-corner target-cursor-corner--tr" />
        <span className="target-cursor-corner target-cursor-frame-corner target-cursor-corner--br" />
        <span className="target-cursor-corner target-cursor-frame-corner target-cursor-corner--bl" />
      </div>
    </>
  );
}
