'use client';

import { ArrowRight, GitCommitHorizontal, Lightbulb, TrendingUp } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGameStore } from '@/store/game-store';
import useReducedMotion from '@/hooks/useReducedMotion';
import MetricDelta from './MetricDelta';
import CarryOverLedger from './CarryOverLedger';

export default function RoundReport() {
  const rootRef = useRef<HTMLElement>(null);
  const { pendingResolution, continueFromReport } = useGameStore();
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (!pendingResolution || reducedMotion) return;
    gsap.timeline()
      .from('.game2-report-kicker', { autoAlpha: 0, y: 12, duration: 0.3 })
      .from('.game2-report-title', { autoAlpha: 0, y: 22, duration: 0.46 }, '<0.08')
      .from('.game2-report-score', { autoAlpha: 0, scale: 0.92, duration: 0.32 }, '<0.08')
      .from('.game2-metric-delta', {
        autoAlpha: 0,
        y: 14,
        duration: 0.3,
        stagger: 0.04,
      }, '<0.1')
      .from('.game2-report-lower > *', {
        autoAlpha: 0,
        y: 14,
        duration: 0.32,
        stagger: 0.05,
      }, '<0.12');
  }, { scope: rootRef, dependencies: [pendingResolution, reducedMotion] });

  if (!pendingResolution) return null;
  const resolution = pendingResolution;
  return (
    <section ref={rootRef} className="game2-report">
      <header>
        <div>
          <p className="game2-report-kicker game-overline">
            <GitCommitHorizontal size={15} />
            Báo cáo giai đoạn {String(resolution.roundNumber).padStart(2, '0')}
          </p>
          <h1 className="game2-report-title">{resolution.headline}</h1>
          <p>{resolution.explanation}</p>
        </div>
        <div className="game2-report-score">
          <span>Thay đổi năng suất</span>
          <strong>{resolution.roundGain >= 0 ? '+' : ''}{resolution.roundGain.toFixed(1)}</strong>
          <small>Tổng {resolution.metricsAfter.productivity.toFixed(1)}</small>
        </div>
      </header>

      <div className="game2-report-metrics">
        {resolution.metricDeltas.map((item) => (
          <MetricDelta key={item.key} item={item} />
        ))}
      </div>

      <div className="game2-report-lower">
        <article className="game2-causal-chain">
          <p className="game-overline"><TrendingUp size={14} /> Cơ chế tác động</p>
          <div>
            <span>Quyết định</span>
            <i />
            <span>Năng lực</span>
            <i />
            <span>Kết quả</span>
          </div>
          <p>{resolution.explanation}</p>
          {resolution.shock && (
            <small>
              Biến cố: {resolution.shock.title} · {resolution.shock.impact}
            </small>
          )}
        </article>

        <article>
          <p className="game-overline">Mang sang chặng kế tiếp</p>
          <CarryOverLedger items={resolution.carryOver} />
        </article>

        <article className="game2-report-lesson">
          <Lightbulb size={18} />
          <div>
            <span>Bài học CNH-HĐH</span>
            <p>{resolution.lesson}</p>
          </div>
        </article>
      </div>

      <footer>
        <p>
          {resolution.nextRound
            ? `Ngân sách cơ sở chặng sau: ${resolution.nextBudget} RP`
            : 'Bốn giai đoạn đã hoàn tất. Đã đến lúc đối chiếu mục tiêu 2030.'}
        </p>
        <button
          type="button"
          onClick={continueFromReport}
          className="game-primary-action game-cursor-target"
        >
          {resolution.nextRound ? `Sang giai đoạn ${resolution.nextRound}` : 'Tiến đến năm 2030'}
          <ArrowRight size={17} />
        </button>
      </footer>
    </section>
  );
}
