'use client';

import { useState } from 'react';
import { ArrowRight, Check, CircleAlert, Network } from 'lucide-react';
import type { PolicyChoice } from '@/types';
import { useGameStore } from '@/store/game-store';
import { getPolicyStage } from '@/lib/game-scenarios';

export default function EventCard() {
  const [selectedChoice, setSelectedChoice] = useState<PolicyChoice | null>(null);
  const { currentRound, submitRound, isLoading } = useGameStore();
  const stage = getPolicyStage(currentRound);

  return (
    <section className="game-event-scene">
      <header className="max-w-3xl">
        <div className="game-overline"><Network size={15} strokeWidth={1.5} />Bước 2 / 2 · {stage.period}</div>
        <h1 className="mt-3 font-display text-[clamp(2rem,4vw,4.3rem)] font-semibold leading-[1.04] text-[#f2f7f7]">Một sự kiện buộc bạn phải phản ứng.</h1>
        <p className="mt-5 text-[1rem] leading-7 text-[#b0c1c8]">{stage.premise}</p>
        <p className="mt-6 border-l-2 border-[#e9a35a] pl-4 font-display text-xl leading-7 text-[#eff5f5]">{stage.question}</p>
      </header>

      <div className="game-policy-options mt-10">
        {stage.options.map((option) => {
          const selected = selectedChoice === option.id;
          return (
            <button key={option.id} type="button" onClick={() => setSelectedChoice(option.id)} className={`game-policy-option game-cursor-target ${selected ? 'is-selected' : ''}`} aria-pressed={selected}>
              <span className="game-policy-option-key">{option.id}</span>
              <span className="min-w-0"><span className="game-policy-option-signal">{option.signal}</span><strong>{option.title}</strong><span>{option.summary}</span></span>
              {selected && <Check className="shrink-0 text-[#3cc7bd]" size={19} strokeWidth={1.8} />}
            </button>
          );
        })}
      </div>

      <div className="game-event-footer mt-9">
        <div><CircleAlert size={17} /><p>Hệ quả định lượng sẽ chỉ được ghi nhận sau khi bạn xác nhận. Đây là quyết định không thể đảo lại trong cùng nhiệm kỳ.</p></div>
        <button type="button" disabled={!selectedChoice || isLoading} onClick={() => selectedChoice && submitRound(selectedChoice)} className="game-primary-action game-cursor-target disabled:opacity-45">{isLoading ? 'Đang ghi nhận...' : 'Xác nhận chính sách'} <ArrowRight size={17} /></button>
      </div>
    </section>
  );
}
