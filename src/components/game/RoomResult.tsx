'use client';

import { ArrowLeft, Clock3, FileText, Trophy } from 'lucide-react';
import { useGameStore } from '@/store/game-store';
import { useRoomStore } from '@/store/room-store';
import Leaderboard from './Leaderboard';

export default function RoomResult() {
  const { leaveRoom, room } = useRoomStore();
  const { resetGame, finalResult, showPersonalResult } = useGameStore();
  const exit = () => {
    resetGame();
    leaveRoom();
  };
  return (
    <section className="game2-room-result">
      <header>
        <p className="game-overline">
          {room?.status === 'ENDED' ? <Clock3 size={14} /> : <Trophy size={14} />}
          {room?.status === 'ENDED' ? 'Phòng đã khép lại' : 'Kết quả đang cập nhật'}
        </p>
        <h1>Bảng xếp hạng phòng.</h1>
        <p>
          Người hoàn thành đủ bốn giai đoạn được xếp hạng theo kết quả 2030.
          Bảng này tự cập nhật khi các thành viên còn lại hoàn tất nhiệm kỳ.
        </p>
      </header>
      <div className="game2-room-result-heading">
        <Trophy size={19} />
        <div><span>Kết quả phòng</span><strong>Đại diện cao điểm nhất mỗi nhóm</strong></div>
      </div>
      <Leaderboard />
      <div className="game2-result-actions">
        {finalResult && (
          <button
            type="button"
            onClick={showPersonalResult}
            className="game-primary-action game-cursor-target"
          >
            <FileText size={16} /> Xem lại kết quả cá nhân
          </button>
        )}
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
