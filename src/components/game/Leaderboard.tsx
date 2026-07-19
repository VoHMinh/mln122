'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Medal,
  Minus,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { getGameGateway } from '@/lib/game-gateway';
import { useRoomStore } from '@/store/room-store';
import type { LeaderboardResponse } from '@/types';

const OUTCOME_LABELS = {
  LEAPFROG: 'Nội lực',
  DEPENDENT: 'Phụ thuộc',
  DISRUPTED: 'Đứt gãy',
};

type Props = {
  roomId?: string;
  token?: string;
  compact?: boolean;
};

export default function Leaderboard({ roomId, token, compact = false }: Props) {
  const { room, playerToken, hostToken } = useRoomStore();
  const resolvedRoomId = roomId ?? room?.roomId;
  const resolvedToken = token ?? playerToken ?? hostToken ?? undefined;
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [view, setView] = useState<'GROUPS' | 'PLAYERS'>('GROUPS');
  const pageSize = compact ? 4 : 6;

  const fetchLeaderboard = useCallback(async () => {
    if (!resolvedRoomId) return;
    try {
      setData(await getGameGateway().getLeaderboard(resolvedRoomId, resolvedToken));
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Không thể tải bảng xếp hạng.');
    }
  }, [resolvedRoomId, resolvedToken]);

  useEffect(() => {
    const initial = window.setTimeout(fetchLeaderboard, 0);
    const timer = window.setInterval(fetchLeaderboard, 3000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [fetchLeaderboard]);

  if (!resolvedRoomId) {
    return <div className="game2-leaderboard-loading">Chọn một phòng trong lịch sử để xem kết quả.</div>;
  }
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
  const activeGroups = data.groups.filter((group) => group.memberCount > 0);

  return (
    <div className="game2-leaderboard">
      <header className="game2-leaderboard-title">
        <div>
          <span>Mã phòng {data.roomCode}</span>
          <strong>{data.roomName}</strong>
        </div>
        <div className="game2-leaderboard-switch" aria-label="Chọn loại bảng xếp hạng">
          <button
            type="button"
            className={view === 'GROUPS' ? 'is-active' : ''}
            onClick={() => setView('GROUPS')}
          >
            <UsersRound size={14} /> Đại diện nhóm
          </button>
          <button
            type="button"
            className={view === 'PLAYERS' ? 'is-active' : ''}
            onClick={() => setView('PLAYERS')}
          >
            <UserRound size={14} /> Cá nhân
          </button>
        </div>
      </header>

      <div className="game2-room-insights">
        <div><UsersRound size={16} /><span>Hoàn thành</span><strong>{data.insights.completionCount}/{data.insights.totalPlayers}</strong></div>
        <div className="is-positive"><span>Nội lực</span><strong>{data.insights.outcomeCounts.LEAPFROG}</strong></div>
        <div className="is-warning"><span>Phụ thuộc</span><strong>{data.insights.outcomeCounts.DEPENDENT}</strong></div>
        <div className="is-danger"><span>Đứt gãy</span><strong>{data.insights.outcomeCounts.DISRUPTED}</strong></div>
      </div>

      {view === 'GROUPS' ? (
        <div className="game2-group-ranking">
          {activeGroups.map((group) => (
            <article key={group.groupName} className={group.rank === 1 ? 'is-leading' : ''}>
              <span>{group.rank ? String(group.rank).padStart(2, '0') : '—'}</span>
              <div>
                <strong>{group.groupName}</strong>
                <small>
                  {group.championName
                    ? `Đại diện: ${group.championName}`
                    : `${group.completionCount}/${group.memberCount} thành viên hoàn thành`}
                </small>
              </div>
              <div>
                <small>Điểm đại diện</small>
                <strong>{group.championScore?.toFixed(1) ?? '—'}</strong>
              </div>
              <div>
                <small>Đã hoàn thành</small>
                <strong>{group.completionCount}/{group.memberCount}</strong>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <>
          <div className="game2-table-wrap">
            <table>
              <thead>
                <tr><th>Hạng</th><th>Người chơi</th><th>Nhóm</th><th>Kết cục</th><th>Điểm</th></tr>
              </thead>
              <tbody>
                {visibleEntries.map((entry) => (
                  <tr key={entry.sessionId}>
                    <td>
                      {entry.rank && entry.rank <= 3
                        ? <Medal size={16} />
                        : entry.rank ?? <Minus size={14} />}
                    </td>
                    <td>
                      <strong>{entry.nickname}</strong>
                      <small>
                        {entry.completed
                          ? <><CheckCircle2 size={12} /> Hoàn thành</>
                          : 'Chưa hoàn thành'}
                      </small>
                    </td>
                    <td>{entry.groupName}</td>
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
        </>
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
