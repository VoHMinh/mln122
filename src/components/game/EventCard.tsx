'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Network,
  TimerReset,
} from 'lucide-react';
import type { PolicyChoice } from '@/types';
import { useGameStore } from '@/store/game-store';
import { getPolicyStage } from '@/lib/game-scenarios';

function forecast(option: ReturnType<typeof getPolicyStage>['options'][number]) {
  const signals: string[] = [];
  if (option.effect.scoreDelta >= 4) signals.push('Năng suất ngắn hạn tăng mạnh');
  else if (option.effect.scoreDelta > 0) signals.push('Năng suất tăng vừa');
  else signals.push('Năng suất ngắn hạn chịu sức ép');
  if (option.effect.autonomyDelta >= 4) signals.push('Tự chủ được củng cố');
  if (option.effect.autonomyDelta < 0) signals.push('Rủi ro suy giảm tự chủ');
  if (option.effect.debtDelta) signals.push('Phát sinh nghĩa vụ nợ');
  if (option.effect.locksDependent) signals.push('Giới hạn kết cục tự chủ');
  return signals;
}

export default function EventCard() {
  const [selectedChoice, setSelectedChoice] = useState<PolicyChoice | null>(null);
  const { session, allocations, submitRound, returnToAllocation, isLoading } = useGameStore();
  if (!session) return null;
  const stage = getPolicyStage(session.currentRound);

  return (
    <section className="game2-event">
      <header>
        <button
          type="button"
          onClick={returnToAllocation}
          className="game2-icon-command game-cursor-target"
          aria-label="Quay lại phân bổ"
          title="Quay lại phân bổ"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="game-overline"><Network size={14} /> Bước 2 / 2 · {stage.period}</p>
          <h1>Dùng năng lực vừa xây để chọn chiến lược.</h1>
          <p>
            Phân bổ quyết định bạn mạnh ở đâu; chiến lược quyết định bạn dùng sức mạnh đó
            để xử lý tình huống thế nào. {stage.question}
          </p>
        </div>
      </header>

      <div className="game2-step-bridge" aria-label="Nguồn lực đã khóa">
        <span>Nguồn lực đã khóa</span>
        <div><small>Nhân lực</small><strong>{allocations.education}</strong></div>
        <div><small>R&amp;D</small><strong>{allocations.innovation}</strong></div>
        <div><small>Hạ tầng</small><strong>{allocations.infrastructure}</strong></div>
        <div><small>FDI</small><strong>{allocations.fdi}</strong></div>
        <p>Cùng một chiến lược có thể cho kết quả khác khi nền năng lực khác nhau.</p>
      </div>

      <div className="game2-policy-grid">
        {stage.options.map((option) => {
          const selected = selectedChoice === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedChoice(option.id)}
              className={`game2-policy-option game-cursor-target ${selected ? 'is-selected' : ''}`}
              aria-pressed={selected}
            >
              <span className="game2-policy-key">{option.id}</span>
              <div>
                <small>{option.signal}</small>
                <strong>{option.title}</strong>
                <p>{option.summary}</p>
                <ul>
                  {forecast(option).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              {selected && <Check size={19} />}
            </button>
          );
        })}
      </div>

      <footer className="game2-event-footer">
        <div>
          <CircleAlert size={16} />
          <p>
            Dự báo chỉ cho biết hướng tác động. Delta chính xác và cơ chế nhân-quả
            sẽ được công bố ở báo cáo vòng, trước khi bạn sang giai đoạn tiếp theo.
          </p>
        </div>
        <div className="game2-event-commit">
          <span><TimerReset size={14} /> Không thể hoàn tác trong nhiệm kỳ</span>
          <button
            type="button"
            disabled={!selectedChoice || isLoading}
            onClick={() => selectedChoice && submitRound(selectedChoice)}
            className="game-primary-action game-cursor-target"
          >
            {isLoading ? 'Đang tính hệ quả...' : 'Xác nhận chính sách'}
            <ArrowRight size={17} />
          </button>
        </div>
      </footer>
    </section>
  );
}
