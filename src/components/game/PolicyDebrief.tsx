'use client';

import { ArrowRight, CircleAlert, GitBranch, Network, Sparkles } from 'lucide-react';
import { useGameStore } from '@/store/game-store';
import { getPolicyStage } from '@/lib/game-scenarios';

export default function PolicyDebrief() {
  const { session, completeGame, isLoading } = useGameStore();
  if (!session) return null;

  const turningPointIds = [...session.histories]
    .map((history) => ({
      id: history.roundNumber,
      magnitude:
        Math.abs(history.roundGain) +
        history.metricDeltas.reduce((sum, item) => sum + Math.abs(item.delta), 0),
    }))
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, 2)
    .map((item) => item.id);

  return (
    <section className="game2-debrief">
      <header>
        <p className="game-overline"><Network size={15} /> Hồ sơ chính sách 2025-2030</p>
        <h1>Bốn quyết định đã tạo nên một quỹ đạo.</h1>
        <p>
          Đọc từ trái sang phải để thấy mỗi lựa chọn đã mở rộng hoặc thu hẹp
          không gian chính sách của chặng tiếp theo như thế nào.
        </p>
      </header>

      <div className="game2-debrief-metrics">
        <div><span>Năng suất</span><strong>{session.metrics.productivity.toFixed(1)}</strong></div>
        <div><span>Tự chủ</span><strong>{session.metrics.autonomy.toFixed(1)}</strong></div>
        <div><span>Hấp thụ</span><strong>{session.metrics.absorption.toFixed(1)}</strong></div>
        <div><span>Nợ còn lại</span><strong>{session.metrics.debtOutstanding.toFixed(0)} RP</strong></div>
      </div>

      <ol className="game2-policy-timeline">
        {session.histories.map((history) => {
          const stage = getPolicyStage(history.roundNumber);
          const choice = stage.options.find((option) => option.id === history.eventChoice);
          const turningPoint = turningPointIds.includes(history.roundNumber);
          return (
            <li key={history.roundNumber} className={turningPoint ? 'is-turning-point' : ''}>
              <div className="game2-policy-marker">{history.roundNumber}</div>
              <div>
                <div className="game2-timeline-meta">
                  <span>{stage.period}</span>
                  <i>Lựa chọn {history.eventChoice}</i>
                  {turningPoint && <b><Sparkles size={13} /> Bước ngoặt</b>}
                </div>
                <h2>{choice?.title}</h2>
                <p>{history.explanation}</p>
                <div className="game2-timeline-impact">
                  <strong>{history.roundGain >= 0 ? '+' : ''}{history.roundGain.toFixed(1)} năng suất</strong>
                  <span>Tự chủ {history.metricsAfter.autonomy.toFixed(1)}</span>
                  <span>Nợ {history.metricsAfter.debtOutstanding.toFixed(0)} RP</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="game2-debrief-reflection">
        <GitBranch size={18} />
        <div>
          <span>Câu hỏi phản tư</span>
          <p>
            Quyết định nào tạo ra con số tốt nhất trước mắt nhưng đồng thời làm
            giảm quyền lựa chọn của bạn ở chặng sau?
          </p>
        </div>
        <CircleAlert size={17} />
      </div>

      <button
        type="button"
        disabled={isLoading}
        onClick={completeGame}
        className="game-primary-action game-cursor-target"
      >
        Xác định kết cục năm 2030 <ArrowRight size={17} />
      </button>
    </section>
  );
}
