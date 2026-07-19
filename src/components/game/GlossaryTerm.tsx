'use client';

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import { CircleHelp, X } from 'lucide-react';
import { GLOSSARY, type GlossaryKey } from '@/lib/game-help-content';
import useHydrated from '@/hooks/useHydrated';

type GlossaryTermProps = {
  term: GlossaryKey;
  children?: ReactNode;
  className?: string;
  preferredPlacement?: 'auto' | 'top' | 'bottom';
};

type TooltipPosition = {
  left: number;
  top: number;
  width: number;
  placement: 'top' | 'bottom';
};

const VIEWPORT_GAP = 12;
const TOOLTIP_WIDTH = 320;
const COMPACT_QUERY = '(max-width: 640px), (pointer: coarse)';

function subscribeCompact(callback: () => void) {
  const media = window.matchMedia(COMPACT_QUERY);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function getCompactSnapshot() {
  return window.matchMedia(COMPACT_QUERY).matches;
}

export default function GlossaryTerm({
  term,
  children,
  className = '',
  preferredPlacement = 'auto',
}: GlossaryTermProps) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const tooltipId = useId();
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const mounted = useHydrated();
  const isCompact = useSyncExternalStore(
    subscribeCompact,
    getCompactSnapshot,
    () => false,
  );
  const entry = GLOSSARY[term];

  const close = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpen(false);
    setPinned(false);
  }, []);

  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current === null) return;
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const measure = useCallback(() => {
    const anchor = anchorRef.current;
    const tooltip = tooltipRef.current;
    if (!anchor || !tooltip || isCompact) return;
    const anchorRect = anchor.getBoundingClientRect();
    const tooltipHeight = tooltip.offsetHeight;
    const width = Math.min(TOOLTIP_WIDTH, window.innerWidth - VIEWPORT_GAP * 2);
    const left = Math.min(
      window.innerWidth - width - VIEWPORT_GAP,
      Math.max(VIEWPORT_GAP, anchorRect.left + anchorRect.width / 2 - width / 2),
    );
    const canPlaceAbove = anchorRect.top >= tooltipHeight + VIEWPORT_GAP * 2;
    const placement =
      preferredPlacement === 'auto'
        ? canPlaceAbove
          ? 'top'
          : 'bottom'
        : preferredPlacement;
    const rawTop =
      placement === 'top'
        ? anchorRect.top - tooltipHeight - 9
        : anchorRect.bottom + 9;
    setPosition({
      left,
      top: Math.min(
        window.innerHeight - tooltipHeight - VIEWPORT_GAP,
        Math.max(VIEWPORT_GAP, rawTop),
      ),
      width,
      placement,
    });
  }, [isCompact, preferredPlacement]);

  useEffect(() => {
    if (!open || !mounted) return;
    const frame = window.requestAnimationFrame(measure);
    const onPointerDown = (event: PointerEvent) => {
      const node = event.target as Node;
      if (
        anchorRef.current?.contains(node) ||
        tooltipRef.current?.contains(node)
      ) return;
      close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    const onViewportChange = () => {
      if (isCompact) close();
      else measure();
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, true);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange, true);
      cancelScheduledClose();
    };
  }, [cancelScheduledClose, close, isCompact, measure, mounted, open]);

  const show = () => {
    cancelScheduledClose();
    setOpen(true);
  };
  const hideIfTransient = () => {
    if (pinned) return;
    cancelScheduledClose();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setPinned((currentPinned) => {
        if (!currentPinned) setOpen(false);
        return currentPinned;
      });
    }, 140);
  };
  const togglePinned = () => {
    cancelScheduledClose();
    setPinned((value) => {
      const next = !value;
      setOpen(next);
      return next;
    });
  };

  const tooltipStyle = isCompact
    ? undefined
    : ({
        left: position?.left ?? -9999,
        top: position?.top ?? -9999,
        width: position?.width ?? TOOLTIP_WIDTH,
      } as CSSProperties);

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        className={`game2-glossary-term ${className}`}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={show}
        onMouseLeave={hideIfTransient}
        onFocus={show}
        onBlur={hideIfTransient}
        onClick={togglePinned}
      >
        {children ?? entry.label}
        <CircleHelp size={11} aria-hidden="true" />
      </button>
      {mounted && open && createPortal(
        <div
          ref={tooltipRef}
          id={tooltipId}
          role={pinned || isCompact ? 'dialog' : 'tooltip'}
          aria-label={`Giải thích: ${entry.label}`}
          className={`game2-glossary-popover ${isCompact ? 'is-compact' : ''} ${
            position ? `is-${position.placement}` : ''
          }`}
          style={tooltipStyle}
          onMouseEnter={show}
          onMouseLeave={hideIfTransient}
        >
          <div className="game2-glossary-heading">
            <div>
              <span>Thuật ngữ</span>
              <strong>{entry.label}</strong>
            </div>
            {(pinned || isCompact) && (
              <button type="button" onClick={close} aria-label="Đóng giải thích">
                <X size={15} />
              </button>
            )}
          </div>
          <p className="game2-glossary-short">{entry.short}</p>
          <dl>
            <div><dt>Là gì?</dt><dd>{entry.definition}</dd></div>
            <div><dt>Tăng bằng cách nào?</dt><dd>{entry.increase}</dd></div>
            <div><dt>Tác dụng</dt><dd>{entry.benefit}</dd></div>
            <div><dt>Cần tránh</dt><dd>{entry.risk}</dd></div>
          </dl>
          <code>{entry.formula}</code>
        </div>,
        document.body,
      )}
    </>
  );
}
