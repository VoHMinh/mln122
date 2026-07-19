'use client';

import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { MetricDelta as MetricDeltaType, MetricKey } from '@/types';
import GlossaryTerm from './GlossaryTerm';

const LABELS: Record<MetricKey, string> = {
  productivity: 'Năng suất',
  autonomy: 'Tự chủ',
  absorption: 'Hấp thụ',
  resilience: 'Chống chịu',
};

export default function MetricDelta({ item }: { item: MetricDeltaType }) {
  const positive = item.delta > 0;
  const negative = item.delta < 0;
  const Icon = positive ? ArrowUpRight : negative ? ArrowDownRight : ArrowRight;
  return (
    <div className={`game2-metric-delta ${positive ? 'is-positive' : negative ? 'is-negative' : ''}`}>
      <span><GlossaryTerm term={item.key}>{LABELS[item.key]}</GlossaryTerm></span>
      <div>
        <small>{item.before.toFixed(1)}</small>
        <Icon size={16} />
        <strong>{item.after.toFixed(1)}</strong>
      </div>
      <em>{item.delta > 0 ? '+' : ''}{item.delta.toFixed(1)}</em>
    </div>
  );
}
