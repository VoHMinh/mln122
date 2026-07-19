'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import './OptionWheel.css';

export type OptionWheelItem = {
  label: string;
  value: string;
  description?: string;
};

type OptionWheelProps = {
  items: OptionWheelItem[];
  defaultSelected?: number | string;
  onChange?: (item: OptionWheelItem, index: number) => void;
  className?: string;
  side?: 'left' | 'right';
  textColor?: string;
  activeColor?: string;
  fontSize?: number;
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  minOpacity?: number;
  smoothing?: number;
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
};

function getInitialIndex(items: OptionWheelItem[], selected?: number | string) {
  if (typeof selected === 'number') return Math.min(Math.max(selected, 0), Math.max(items.length - 1, 0));
  const matched = items.findIndex((item) => item.value === selected);
  return matched < 0 ? 0 : matched;
}

export default function OptionWheel({
  items,
  defaultSelected = 0,
  onChange,
  className,
  side = 'left',
  textColor = '#718994',
  activeColor = '#f2f7f7',
  fontSize = 1.25,
  spacing = 2.25,
  curve = 0.9,
  tilt = 7,
  blur = 1.2,
  fade = 0.26,
  minOpacity = 0.18,
  smoothing = 180,
  inset = 42,
  loop = false,
  draggable = true,
}: OptionWheelProps) {
  const safeItems = useMemo(() => items.filter(Boolean), [items]);
  const initialIndex = getInitialIndex(safeItems, defaultSelected);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const positionRef = useRef(initialIndex);
  const targetRef = useRef(initialIndex);
  const rafRef = useRef<number | null>(null);
  const animateRef = useRef<(now: number) => void>(() => undefined);
  const lastFrameRef = useRef(0);
  const dragRef = useRef<{ y: number; position: number; pointerId: number } | null>(null);
  const didDragRef = useRef(false);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedRef = useRef(initialIndex);
  const configRef = useRef({
    count: safeItems.length,
    rowHeight: 42,
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
  });

  const animate = useCallback((now: number) => {
    const config = configRef.current;
    const deltaSeconds = Math.min((now - lastFrameRef.current) / 1000, 0.05);
    lastFrameRef.current = now;
    const ease = 1 - Math.exp(-deltaSeconds / (Math.max(config.smoothing, 1) / 1000));
    let next = positionRef.current + (targetRef.current - positionRef.current) * ease;
    const isSettled = Math.abs(targetRef.current - next) < 0.001;
    if (isSettled) next = targetRef.current;
    positionRef.current = next;

    const tiltRadians = (config.tilt * Math.PI) / 180;
    const radius = tiltRadians > 0.0005 ? config.rowHeight / tiltRadians : 0;
    const mirror = config.side === 'right' ? -1 : 1;

    itemRefs.current.forEach((element, index) => {
      if (!element) return;
      let distance = index - next;
      if (config.loop && config.count > 1) {
        distance = ((distance % config.count) + config.count) % config.count;
        if (distance > config.count / 2) distance -= config.count;
      }
      const absoluteDistance = Math.abs(distance);
      const angle = radius ? Math.max(-Math.PI / 2, Math.min(Math.PI / 2, distance * tiltRadians)) : 0;
      const x = radius ? -mirror * radius * (1 - Math.cos(angle)) * config.curve : 0;
      const y = radius ? radius * Math.sin(angle) : distance * config.rowHeight;
      const rotation = radius ? (mirror * angle * 180) / Math.PI : 0;
      element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translateY(-50%) rotate(${rotation.toFixed(2)}deg)`;
      element.style.opacity = String(Math.max(config.minOpacity, 1 - absoluteDistance * config.fade));
      element.style.filter = config.blur ? `blur(${(absoluteDistance * config.blur).toFixed(2)}px)` : 'none';
      element.style.setProperty('--ow-progress', Math.max(0, 1 - Math.min(absoluteDistance, 1)).toFixed(4));
    });

    rafRef.current = isSettled ? null : requestAnimationFrame(animateRef.current);
  }, []);

  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  const startAnimation = useCallback(() => {
    if (rafRef.current !== null) return;
    lastFrameRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const applyTarget = useCallback((value: number, snap: boolean) => {
    const config = configRef.current;
    if (!config.count) return;
    let next = value;
    if (!config.loop) next = Math.min(Math.max(next, 0), config.count - 1);
    if (snap) next = Math.round(next);
    targetRef.current = next;

    const index = ((Math.round(next) % config.count) + config.count) % config.count;
    if (index !== selectedRef.current) {
      selectedRef.current = index;
      setSelectedIndex(index);
      onChange?.(safeItems[index], index);
    }
    startAnimation();
  }, [onChange, safeItems, startAnimation]);

  useLayoutEffect(() => {
    const remSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    configRef.current = {
      count: safeItems.length,
      rowHeight: Math.max(fontSize * spacing * remSize, 1),
      curve,
      tilt,
      blur,
      fade,
      minOpacity,
      side,
      loop,
      smoothing,
    };
    const index = getInitialIndex(safeItems, defaultSelected);
    positionRef.current = index;
    targetRef.current = index;
    selectedRef.current = index;
    lastFrameRef.current = performance.now();
    animate(lastFrameRef.current);
  }, [animate, blur, curve, defaultSelected, fade, fontSize, loop, minOpacity, safeItems, side, smoothing, spacing, tilt]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onWheel = (event: WheelEvent) => {
      const delta = event.deltaMode === 1 ? event.deltaY * 24 : event.deltaY;
      const isMovingForward = delta > 0;
      const isMovingBackward = delta < 0;
      const atFirstItem = targetRef.current <= 0.001;
      const atLastItem = targetRef.current >= configRef.current.count - 1.001;

      // Let the document continue once the wheel reaches either boundary in
      // the same direction. This avoids trapping the user in a bounded list.
      if (!configRef.current.loop && ((isMovingForward && atLastItem) || (isMovingBackward && atFirstItem))) {
        return;
      }

      event.preventDefault();
      const step = Math.max(-1, Math.min(1, delta / configRef.current.rowHeight));
      applyTarget(targetRef.current + step, false);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => applyTarget(targetRef.current, true), 120);
    };
    root.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      root.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [applyTarget]);

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    dragRef.current = { y: event.clientY, position: targetRef.current, pointerId: event.pointerId };
    didDragRef.current = false;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const offset = event.clientY - drag.y;
    if (!didDragRef.current && Math.abs(offset) > 4) {
      didDragRef.current = true;
      event.currentTarget.setPointerCapture(drag.pointerId);
    }
    if (didDragRef.current) applyTarget(drag.position - offset / configRef.current.rowHeight, false);
  };

  const finishPointer = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    if (didDragRef.current) applyTarget(targetRef.current, true);
  };

  return (
    <div
      ref={rootRef}
      role="listbox"
      tabIndex={0}
      aria-label="Chọn luận điểm tác động"
      className={cn('option-wheel', side === 'right' && 'option-wheel--right', className)}
      style={{
        '--ow-text-color': textColor,
        '--ow-active-color': activeColor,
        '--ow-font-size': `${fontSize}rem`,
        '--ow-inset': `${inset}px`,
      } as React.CSSProperties}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
      onKeyDown={(event) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        applyTarget(Math.round(targetRef.current) + (event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 1), true);
      }}
    >
      {safeItems.map((item, index) => (
        <button
          key={item.value}
          ref={(element) => { itemRefs.current[index] = element; }}
          type="button"
          role="option"
          aria-selected={selectedIndex === index}
          className={cn('option-wheel__item', 'cursor-target', selectedIndex === index && 'option-wheel__item--selected')}
          onClick={() => {
            if (!didDragRef.current) applyTarget(index, true);
          }}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}
