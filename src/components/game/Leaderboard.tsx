'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Medal, Minus, UsersRound } from 'lucide-react';
import { getGameGateway } from '@/lib/game-gateway';
import { useRoomStore } from '@/store/room-store';
import type { LeaderboardResponse } from '@/types';

const OUTCOME_LABELS = {
  LEAPFROG: 'Nội lực',
  DEPENDENT: 'Phụ thuộc',
  DISRUPTED: 'Đứt gãy',
};

export default function Leaderboard() {
  const { room, playerToken, hostToken } = useRoomStore();
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const fetchLeaderboard = useCallback(async () => {
    if (!room) return;
    try {
      setData(
        await getGameGateway().getLeaderboard(
          room.roomId,
          playerToken ?? hostToken ?? undefined,
        ),
      );
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Không thể tải bảng xếp hạng.');
    }
  }, [hostToken, playerToken, room]);

  useEffect(() => {
    const initial = window.setTimeout(fetchLeaderboard, 0);
    const timer = window.setInterval(fetchLeaderboard, 3000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [fetchLeaderboard]);

  if (error) {
    return (
      <div className="game2-leaderboard-error">
        <p>{error}</p>
        <button type="button" onClick={fetchLeaderboard} className="game-secondary-action">
          Tải lại
        </button>
      </div>
    );
  }
  if (!data) return <div className="game2-leaderboard-loading">Đang tổng hợp kết quả phòng...</div>;
  const totalPages = Math.max(1, Math.ceil(data.entries.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const visibleEntries = data.entries.slice(safePage * pageSize, (safePage + 1) * pageSize);

  return (
    <div className="game2-leaderboard">
      <div className="game2-room-insights">
        <div><UsersRound size={16} /><span>Hoàn thành</span><strong>{data.insights.completionCount}/{data.insights.totalPlayers}</strong></div>
        <div className="is-positive"><span>Nội lực</span><strong>{data.insights.outcomeCounts.LEAPFROG}</strong></div>
        <div className="is-warning"><span>Phụ thuộc</span><strong>{data.insights.outcomeCounts.DEPENDENT}</strong></div>
        <div className="is-danger"><span>Đứt gãy</span><strong>{data.insights.outcomeCounts.DISRUPTED}</strong></div>
      </div>

      <div className="game2-table-wrap">
        <table>
          <thead>
            <tr><th>Hạng</th><th>Người chơi</th><th>Tiến độ</th><th>Kết cục</th><th>Điểm</th></tr>
          </thead>
          <tbody>
            {visibleEntries.map((entry) => (
              <tr key={entry.sessionId}>
                <td>
                  {entry.rank && entry.rank <= 3
                    ? <Medal size={16} />
                    : entry.rank ?? <Minus size={14} />}
                </td>
                <td><strong>{entry.nickname}</strong><small>{entry.className || '—'}</small></td>
                <td>
                  {entry.completed
                    ? <span className="game2-complete"><CheckCircle2 size={14} /> Hoàn thành</span>
                    : <span>Chưa hoàn thành</span>}
                </td>
                <td>{entry.outcomeType ? OUTCOME_LABELS[entry.outcomeType] : '—'}</td>
                <td><strong>{entry.finalScore?.toFixed(1) ?? '—'}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="game2-table-pagination">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={safePage === 0}
            aria-label="Trang xếp hạng trước"
          >
            <ChevronLeft size={15} />
          </button>
          <span>Trang {safePage + 1}/{totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
            disabled={safePage === totalPages - 1}
            aria-label="Trang xếp hạng sau"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      <div className="game2-common-choices">
        <span>Lựa chọn phổ biến</span>
        {data.insights.commonChoices.map((item) => (
          <div key={item.roundNumber}>
            <small>Vòng {item.roundNumber}</small>
            <strong>{item.choice ?? '—'}</strong>
            <em>{item.count} người</em>
          </div>
        ))}
      </div>
    </div>
  );
}
