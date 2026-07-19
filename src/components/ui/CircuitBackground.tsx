'use client';

import { useRef, useMemo } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

interface CircuitBackgroundProps {
  className?: string;
  /** Opacity multiplier for the entire pattern (0-1) */
  intensity?: number;
}

// Deterministic pseudo-random for consistent SSR/CSR rendering
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface TraceLine {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface TraceNode {
  id: number;
  cx: number;
  cy: number;
  r: number;
}

function generateCircuit(
  width: number,
  height: number,
  seed: number = 42
): { lines: TraceLine[]; nodes: TraceNode[] } {
  const rand = seededRandom(seed);
  const lines: TraceLine[] = [];
  const nodes: TraceNode[] = [];

  const gridSize = 80;
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);

  let lineId = 0;
  let nodeId = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * gridSize;
      const y = row * gridSize;

      // ~30% chance of node at grid intersection
      if (rand() < 0.3) {
        nodes.push({
          id: nodeId++,
          cx: x + gridSize * 0.5,
          cy: y + gridSize * 0.5,
          r: rand() < 0.3 ? 3 : 1.5,
        });
      }

      // Horizontal trace (~25%)
      if (rand() < 0.25 && col < cols - 1) {
        const startX = x + gridSize * 0.5;
        const endX = startX + gridSize;
        const traceY = y + gridSize * 0.5;
        lines.push({
          id: lineId++,
          x1: startX,
          y1: traceY,
          x2: endX,
          y2: traceY,
        });
      }

      // Vertical trace (~20%)
      if (rand() < 0.2 && row < rows - 1) {
        const traceX = x + gridSize * 0.5;
        const startY = y + gridSize * 0.5;
        const endY = startY + gridSize;
        lines.push({
          id: lineId++,
          x1: traceX,
          y1: startY,
          x2: traceX,
          y2: endY,
        });
      }

      // Diagonal trace (~8%)
      if (rand() < 0.08 && col < cols - 1 && row < rows - 1) {
        lines.push({
          id: lineId++,
          x1: x + gridSize * 0.5,
          y1: y + gridSize * 0.5,
          x2: x + gridSize * 1.5,
          y2: y + gridSize * 1.5,
        });
      }
    }
  }

  return { lines, nodes };
}

export default function CircuitBackground({
  className = '',
  intensity = 1,
}: CircuitBackgroundProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { lines, nodes } = useMemo(() => generateCircuit(1920, 1080, 42), []);

  const baseOpacity = 0.05 * intensity;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        className="h-full w-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Trace lines */}
        {lines.map((line) => (
          <line
            key={`line-${line.id}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="var(--copper-trace)"
            strokeWidth="1"
            opacity={baseOpacity}
          />
        ))}

        {/* Nodes / solder points */}
        {nodes.map((node) => (
          <circle
            key={`node-${node.id}`}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="var(--copper-trace)"
            opacity={baseOpacity * 1.5}
          />
        ))}

        {/* Animated pulse traces — only if motion is OK */}
        {!prefersReducedMotion && (
          <>
            {lines.slice(0, 6).map((line, i) => (
              <line
                key={`pulse-${line.id}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="var(--copper-trace)"
                strokeWidth="2"
                opacity={0}
                strokeLinecap="round"
              >
                <animate
                  attributeName="opacity"
                  values={`0;${0.3 * intensity};0`}
                  dur={`${3 + i * 0.7}s`}
                  begin={`${i * 1.2}s`}
                  repeatCount="indefinite"
                />
              </line>
            ))}

            {nodes.slice(0, 4).map((node, i) => (
              <circle
                key={`glow-${node.id}`}
                cx={node.cx}
                cy={node.cy}
                r={node.r * 3}
                fill="var(--copper-trace)"
                opacity={0}
              >
                <animate
                  attributeName="opacity"
                  values={`0;${0.15 * intensity};0`}
                  dur={`${4 + i}s`}
                  begin={`${i * 2}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values={`${node.r * 2};${node.r * 5};${node.r * 2}`}
                  dur={`${4 + i}s`}
                  begin={`${i * 2}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
