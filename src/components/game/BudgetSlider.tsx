'use client';

import { useCallback, useRef, type ReactNode } from 'react';

interface BudgetSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: ReactNode;
  color: string;
  description: string;
}

export default function BudgetSlider({
  label,
  value,
  onChange,
  icon,
  color,
  description,
}: BudgetSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = value; // Always out of 100 RP total scale

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = parseInt(e.target.value, 10);
      const clamped = Math.round(Math.max(0, Math.min(100, isNaN(raw) ? 0 : raw)));
      onChange(clamped);
    },
    [onChange]
  );

  // Color mapping for CSS variable usage in inline styles
  const colorMap: Record<string, string> = {
    'signal-cyan': 'var(--signal-cyan)',
    'copper-trace': 'var(--copper-trace)',
    'disruption-amber': 'var(--disruption-amber)',
    'muted-steel': 'var(--muted-steel)',
  };

  const resolvedColor = colorMap[color] || color;

  return (
    <div className="space-y-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg" style={{ color: resolvedColor }}>
            {icon}
          </span>
          <span className="font-display text-sm font-semibold text-pulse-text">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="font-mono text-base font-bold tabular-nums"
            style={{ color: resolvedColor }}
          >
            {value}
          </span>
          <span className="font-mono text-xs text-muted-steel">/100 RP</span>
        </div>
      </div>

      {/* Custom slider track */}
      <div className="relative" ref={trackRef}>
        {/* Track background */}
        <div className="h-3 w-full rounded-full border border-muted-steel/30 bg-deep-circuit">
          {/* Filled portion */}
          <div
            className="h-full rounded-full transition-all duration-150 ease-out"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${resolvedColor}80, ${resolvedColor})`,
              boxShadow: value > 0 ? `0 0 8px ${resolvedColor}40` : 'none',
            }}
          />
        </div>

        {/* Native range input overlaid for accessibility */}
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={handleChange}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          className="budget-slider absolute inset-0 h-full w-full cursor-pointer opacity-0"
          style={
            {
              '--slider-color': resolvedColor,
            } as React.CSSProperties
          }
        />

        {/* Visual thumb */}
        <div
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
          style={{
            left: `${percentage}%`,
          }}
        >
          <div
            className="h-5 w-5 rounded-full border-2 bg-deep-circuit shadow-lg"
            style={{
              borderColor: resolvedColor,
              boxShadow: `0 0 6px ${resolvedColor}60`,
            }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed text-muted-steel">{description}</p>

      {/* Inline styles for the range input to make it larger/touch-friendly */}
      <style jsx>{`
        .budget-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          /* Larger touch target */
          min-height: 2.5rem;
          margin: -0.75rem 0;
          padding: 0.75rem 0;
        }
        .budget-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
        }
        .budget-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .budget-slider:focus-visible + div > div {
          outline: 2px solid var(--copper-trace);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
