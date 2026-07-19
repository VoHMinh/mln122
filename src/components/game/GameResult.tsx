'use client';

import {
  ArrowLeft,
  CircleAlert,
  GitBranch,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { useGameStore } from '@/store/game-store';
import { useRoomStore } from '@/store/room-store';
import ResultChart from './ResultChart';
import GlossaryTerm from './GlossaryTerm';

const OUTCOMES = {
  LEAPFROG: {
    label: 'Đạt mục tiêu 2030 bằng nội lực',
    className: 'is-leapfrog',
  },
  DEPENDENT: {
    label: 'Về đích nhưng chưa tự chủ',
    className: 'is-dependent',
  },
  DISRUPTED: {
    label: 'Trễ hẹn 2030: đứt gãy công nghệ',
    className: 'is-disrupted',
  },
} as const;

export default function GameResult() {
  const { finalResult, session, resetGame, showRoomResult } = useGameStore();
  const leaveRoom = useRoomStore((state) => state.leaveRoom);
  if (!finalResult || !session) return null;
  const config = OUTCOMES[finalResult.outcomeType];

  const exit = () => {
    resetGame();
    leaveRoom();
  };

  return (
    <section className="game2-result">
      <header className={config.className}>
        <p className="game-overline">Kết cục nhiệm kỳ 2025-2030</p>
        <span>{finalResult.policyArchetype}</span>
        <h1>{config.label}</h1>
        <p>{finalResult.outcomeMessage}</p>
      </header>

      <div className="game2-result-metrics">
        <div><GlossaryTerm term="productivity">Năng suất cuối</GlossaryTerm><strong>{finalResult.finalScore.toFixed(1)}</strong></div>
        <div><GlossaryTerm term="autonomy">Tự chủ</GlossaryTerm><strong>{finalResult.autonomyIndex.toFixed(1)}</strong></div>
        <div><GlossaryTerm term="debt">Nợ công nghệ</GlossaryTerm><strong>{finalResult.debtOutstanding.toFixed(0)} RP</strong></div>
        <div><span>Xếp hạng hiện tại</span><strong>{finalResult.rank ? `#${finalResult.rank}` : 'Đang chờ'}</strong></div>
      </div>

      <div className="game2-result-layout">
        <div className="game2-result-chart"><ResultChart playerScores={finalResult.scores} /></div>
        <aside className="game2-result-reading">
          <p className="game-overline"><Sparkles size={14} /> Hai bước ngoặt</p>
          {finalResult.turningPoints.map((point) => (
            <div key={point.roundNumber}>
              <span>Giai đoạn {point.roundNumber}</span>
              <strong>{point.title}</strong>
              <p>{point.impact}</p>
            </div>
          ))}
        </aside>
      </div>

      <div className="game2-counterfactual">
        <GitBranch size={19} />
        <div>
          <span>Một quỹ đạo khác có thể xảy ra</span>
          <p>{finalResult.counterfactual}</p>
        </div>
      </div>

      <div className="game2-academic-note">
        <CircleAlert size={16} />
        <p>
          Đây là mô hình sư phạm giản lược để minh họa độ trễ giáo dục, phụ thuộc
          FDI và chi phí nợ; không phải dự báo chính sách thực tế của Việt Nam.
        </p>
      </div>

      <div className="game2-result-actions">
        <button
          type="button"
          onClick={showRoomResult}
          className="game-primary-action game-cursor-target"
        >
          <Trophy size={16} /> Xem bảng xếp hạng phòng
        </button>
        <button
          type="button"
          onClick={exit}
          className="game-secondary-action game-cursor-target"
        >
          <ArrowLeft size={16} /> Về sảnh
        </button>
      </div>
    </section>
  );
}
