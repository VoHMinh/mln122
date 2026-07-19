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
    status: 'Bứt phá có nền nội lực',
    diagnosis:
      'Năng suất và quyền làm chủ đã đi cùng nhau. Bài toán tiếp theo là giữ nhịp R&D, nhân lực và khả năng chống sốc.',
    priorities: [
      'Duy trì R&D và giáo dục như năng lực thường trực.',
      'Chuyển từ tiếp nhận sang thiết kế công nghệ lõi.',
      'Giữ dư địa ngân sách cho cú sốc tiếp theo.',
    ],
  },
  DEPENDENT: {
    label: 'Về đích nhưng chưa tự chủ',
    className: 'is-dependent',
    status: 'Tăng trưởng lệch pha',
    diagnosis:
      'Sản lượng đã tăng nhưng năng lực nội sinh chưa theo kịp. Quỹ đạo còn nhạy với vốn, công nghệ hoặc quyết định từ bên ngoài.',
    priorities: [
      'Giữ R&D tối thiểu 20 RP khi FDI vượt 50%.',
      'Ràng buộc chuyển giao và phát triển nhà cung ứng nội địa.',
      'Đầu tư giáo dục sớm để công nghệ được hấp thụ thật.',
    ],
  },
  DISRUPTED: {
    label: 'Trễ hẹn 2030: đứt gãy công nghệ',
    className: 'is-disrupted',
    status: 'Mất quỹ đạo hiện đại hóa',
    diagnosis:
      'Năng lực, dư địa tài chính hoặc sức chống chịu không đủ để giữ đà qua bốn giai đoạn. Cần phục hồi nền trước khi tăng tốc.',
    priorities: [
      'Xử lý nợ và bảo vệ ngân sách nền của vòng kế tiếp.',
      'Khôi phục hạ tầng, chống chịu và nhân lực công nghệ.',
      'Chọn một năng lực lõi để tập trung thay vì dàn trải.',
    ],
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
        <span>{config.status} · {finalResult.policyArchetype}</span>
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
          <p className="game-overline"><Sparkles size={14} /> Chẩn đoán quỹ đạo</p>
          <div className={`game2-result-status ${config.className}`}>
            <span>Trạng thái hiện tại</span>
            <strong>{config.status}</strong>
            <p>{config.diagnosis}</p>
          </div>
          <div className="game2-result-priorities">
            <span>Ba ưu tiên tiếp theo</span>
            <ol>
              {config.priorities.map((priority) => <li key={priority}>{priority}</li>)}
            </ol>
          </div>
          <div className="game2-result-turning-points">
            <span>Bước ngoặt lớn nhất</span>
            <strong>{finalResult.turningPoints[0]?.title ?? 'Không có dữ liệu'}</strong>
          </div>
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
