'use client';

import { useMemo, useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ReferenceTrajectories } from '@/types';
import { getReferenceTrajectories } from '@/lib/api';

interface ResultChartProps {
  playerScores: number[];
}

interface ChartDataPoint {
  wave: string;
  player: number;
  korea: number | null;
  china: number | null;
  disrupted: number | null;
}

// Vietnamese custom tooltip
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const nameMap: Record<string, string> = {
    player: 'Quỹ đạo của bạn',
    korea: 'Tuyến tham chiếu: Hàn Quốc',
    china: 'Tuyến tham chiếu: Trung Quốc',
    disrupted: 'Kịch bản đứt gãy',
  };

  return (
    <div className="border border-white/15 bg-[#0a171d] px-4 py-3 shadow-xl">
      <p className="mb-2 font-display text-sm font-semibold text-[#eff7f8]">
        {label}
      </p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-body text-xs text-[#97afb5]">
              {nameMap[entry.name] || entry.name}:
            </span>
            <span className="font-mono text-xs font-semibold text-[#eff7f8]">
              {entry.value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Vietnamese custom legend
function CustomLegend({
  payload,
}: {
  payload?: Array<{
    value: string;
    color: string;
    type: string;
  }>;
}) {
  if (!payload) return null;

  const nameMap: Record<string, string> = {
    player: 'Quỹ đạo của bạn',
    korea: 'Tham chiếu Hàn Quốc',
    china: 'Tham chiếu Trung Quốc',
    disrupted: 'Kịch bản đứt gãy',
  };

  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <div
            className="h-2 w-4 rounded-sm"
            style={{
              backgroundColor: entry.color,
              opacity: entry.type === 'dashed' ? 0.6 : 1,
            }}
          />
          <span className="font-body text-xs text-[#8ea7af]">
            {nameMap[entry.value] || entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// Default reference data if API fails
const FALLBACK_REFS: ReferenceTrajectories = {
  korea: [20, 45, 75, 95],
  china: [15, 30, 60, 85],
  disrupted: [25, 35, 30, 20],
  labels: ['2025-2026', '2026-2027', '2027-2028', '2028-2030'],
};

export default function ResultChart({ playerScores }: ResultChartProps) {
  const [refs, setRefs] = useState<ReferenceTrajectories>(FALLBACK_REFS);

  useEffect(() => {
    let cancelled = false;
    getReferenceTrajectories()
      .then((data) => {
        if (!cancelled && data) setRefs(data);
      })
      .catch(() => {
        // Use fallback silently
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const chartData: ChartDataPoint[] = useMemo(() => {
    const labels = refs.labels || FALLBACK_REFS.labels;
    return labels.map((label, i) => ({
      wave: label,
      player: playerScores[i] ?? 0,
      korea: refs.korea[i] ?? null,
      china: refs.china[i] ?? null,
      disrupted: refs.disrupted[i] ?? null,
    }));
  }, [playerScores, refs]);

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div><p className="game-overline">Đối chiếu mô phỏng</p><h3 className="mt-1 font-display text-xl font-semibold text-[#eff7f8]">Quỹ đạo năng suất</h3></div>
        <p className="max-w-sm text-right text-[0.72rem] leading-5 text-[#819aa2]">Các tuyến tham chiếu là thang minh họa học tập, không phải chuỗi số liệu quốc gia.</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(145,184,190,0.14)"
            vertical={false}
          />
          <XAxis
            dataKey="wave"
            stroke="#718992"
            tick={{ fill: '#8ea7af', fontSize: 11, fontFamily: 'var(--font-body)' }}
            axisLine={{ stroke: 'rgba(145,184,190,0.2)' }}
          />
          <YAxis
            stroke="#718992"
            tick={{ fill: '#8ea7af', fontSize: 11, fontFamily: 'var(--font-mono)' }}
            axisLine={{ stroke: 'rgba(145,184,190,0.2)' }}
            label={{
              value: 'Điểm năng suất',
              angle: -90,
              position: 'insideLeft',
              fill: '#8ea7af',
              fontSize: 11,
              fontFamily: 'var(--font-body)',
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />

          {/* Player line - thick, animated */}
          <Line
            type="monotone"
            dataKey="player"
            name="player"
            stroke="#e9a35a"
            strokeWidth={3}
            dot={{ r: 5, fill: '#e9a35a', strokeWidth: 2, stroke: '#08151b' }}
            activeDot={{ r: 7, fill: '#e9a35a' }}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />

          {/* Korea reference */}
          <Line
            type="monotone"
            dataKey="korea"
            name="korea"
            stroke="#3cc7bd"
            strokeWidth={2}
            strokeOpacity={0.7}
            dot={{ r: 3, fill: '#3cc7bd' }}
            animationDuration={1800}
            animationEasing="ease-in-out"
          />

          {/* China reference */}
          <Line
            type="monotone"
            dataKey="china"
            name="china"
            stroke="#7ba7b7"
            strokeWidth={2}
            strokeOpacity={0.7}
            dot={{ r: 3, fill: '#7ba7b7' }}
            animationDuration={2000}
            animationEasing="ease-in-out"
          />

          {/* Disrupted reference - dashed */}
          <Line
            type="monotone"
            dataKey="disrupted"
            name="disrupted"
            stroke="#c76e58"
            strokeWidth={2}
            strokeDasharray="8 4"
            strokeOpacity={0.6}
            dot={{ r: 3, fill: '#c76e58' }}
            animationDuration={2200}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
