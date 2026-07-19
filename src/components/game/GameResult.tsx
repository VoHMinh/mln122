'use client';

import { ArrowRight, BrainCircuit, CircleAlert, RotateCcw, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useGameStore } from '@/store/game-store';
import { getOutcomeMessage } from '@/lib/game-logic';
import ResultChart from './ResultChart';

const OUTCOMES = {
  LEAPFROG: {
    label: 'Đạt mục tiêu 2030 bằng nội lực',
    className: 'is-leapfrog',
    explanation: 'Năng suất đủ cao và năng lực tự chủ được tích lũy qua các chặng. Tăng trưởng không chỉ đến từ vốn hay công nghệ đi qua nền kinh tế.',
  },
  DEPENDENT: {
    label: 'Về đích nhưng chưa tự chủ',
    className: 'is-dependent',
    explanation: 'Mô hình tăng trưởng đạt yêu cầu, nhưng nền công nghệ nội sinh chưa đủ dày để giảm phụ thuộc vào đối tác bên ngoài.',
  },
  DISRUPTED: {
    label: 'Trễ hẹn 2030: đứt gãy công nghệ',
    className: 'is-disrupted',
    explanation: 'Nguồn lực không được tích lũy đồng bộ cho R&D, nhân lực và hạ tầng; các quyết định ngắn hạn không tạo đủ lực cho chặng cuối.',
  },
} as const;

export default function GameResult() {
  const { finalResult, scores, autonomyIndex, debtOutstanding, resetGame } = useGameStore();
  const outcome = finalResult?.outcomeType ?? 'DISRUPTED';
  const config = OUTCOMES[outcome];
  const finalScore = finalResult?.finalScore ?? (scores.length ? scores[scores.length - 1] : 0);
  const finalAutonomy = finalResult?.autonomyIndex ?? autonomyIndex;
  const finalDebt = finalResult?.debtOutstanding ?? debtOutstanding;

  return (
    <section className="game-result-scene">
      <header className={`game-result-header ${config.className}`}>
        <p className="game-overline">Kết cục nhiệm kỳ 2025-2030</p>
        <h1>{config.label}</h1>
        <p>{config.explanation}</p>
      </header>

      <div className="game-result-metrics mt-8">
        <div><span>Năng suất cuối</span><strong>{finalScore.toFixed(1)}</strong></div>
        <div><span>Chỉ số tự chủ</span><strong>{finalAutonomy.toFixed(1)}</strong></div>
        <div><span>Nợ công nghệ</span><strong>{finalDebt.toFixed(0)} RP</strong></div>
        <div><span>Xếp hạng phiên</span><strong>{finalResult?.rank ? `#${finalResult.rank}` : '—'}</strong></div>
      </div>

      <div className="mt-10 grid gap-9 xl:grid-cols-[minmax(0,1.25fr)_minmax(17rem,0.75fr)] xl:items-start">
        <div className="game-result-chart"><ResultChart playerScores={scores} /></div>
        <aside className="game-result-reading">
          <div className="flex items-center gap-2 text-[#3cc7bd]"><BrainCircuit size={17} strokeWidth={1.5} /><span className="game-overline">Cách đọc kết quả</span></div>
          <p className="mt-4">{getOutcomeMessage(outcome)}</p>
          <div className="mt-6 border-t border-white/10 pt-5"><div className="flex gap-2 text-[#e9a35a]"><CircleAlert size={16} /><span className="game-overline">Lưu ý học thuật</span></div><p className="mt-3 text-sm leading-6">Đây là mô hình sư phạm: nó minh họa quan hệ giữa đầu tư, tự chủ và phụ thuộc công nghệ; không dự báo kết quả chính sách thực tế của Việt Nam.</p></div>
        </aside>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row">
        <button type="button" onClick={resetGame} className="game-primary-action game-cursor-target"><RotateCcw size={16} />Bắt đầu một nhiệm kỳ mới</button>
        <Link href="/#sources" className="game-secondary-action game-cursor-target"><Trophy size={16} />Đối chiếu dữ liệu nguồn <ArrowRight size={16} /></Link>
      </div>
    </section>
  );
}
