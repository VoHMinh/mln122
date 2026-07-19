'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  History,
  Play,
  RefreshCw,
  Trophy,
  UsersRound,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { getGameGateway } from '@/lib/game-gateway';
import { useRoomStore } from '@/store/room-store';
import type { PlayerHistoryEntry } from '@/types';
import Leaderboard from './Leaderboard';
import useReducedMotion from '@/hooks/useReducedMotion';

const OUTCOME_LABELS = {
  LEAPFROG: 'Bứt phá bằng nội lực',
  DEPENDENT: 'Về đích còn phụ thuộc',
  DISRUPTED: 'Đứt gãy quỹ đạo',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

export default function GameHistory() {
  const rootRef = useRef<HTMLDivElement>(null);
  const profileToken = useRoomStore((state) => state.profileToken);
  const reducedMotion = useReducedMotion();
  const [entries, setEntries] = useState<PlayerHistoryEntry[]>([]);
  const [selected, setSelected] = useState<PlayerHistoryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!profileToken) {
      setEntries([]);
      setSelected(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const next = await getGameGateway().getPlayerHistory(profileToken);
      setEntries(next);
      setSelected((current) =>
        current
          ? next.find((entry) => entry.sessionId === current.sessionId) ?? next[0] ?? null
          : next[0] ?? null,
      );
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Không thể tải lịch sử chơi.');
    } finally {
      setLoading(false);
    }
  }, [profileToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadHistory();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadHistory]);

  useGSAP(() => {
    if (reducedMotion || entries.length === 0) return;
    gsap.fromTo(
      '.game-history-room',
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: .36, stagger: .05, ease: 'power2.out' },
    );
  }, { scope: rootRef, dependencies: [entries.length, reducedMotion], revertOnUpdate: true });

  return (
    <div ref={rootRef} className="game-history">
      <header className="game-history-header">
        <div>
          <p className="game-overline"><History size={15} /> Hồ sơ mô phỏng cá nhân</p>
          <h1>Lịch sử các phòng đã tham gia.</h1>
          <p>Mỗi phòng giữ lại điểm, nhóm, kết cục và vị trí của bạn tại thời điểm tổng hợp.</p>
        </div>
        <div>
          <button type="button" onClick={loadHistory} aria-label="Làm mới lịch sử">
            <RefreshCw size={16} />
          </button>
          <Link href="/game"><Play size={15} /> Vào phòng mới</Link>
        </div>
      </header>

      {loading ? (
        <div className="game-history-state">Đang tải lịch sử trên thiết bị này...</div>
      ) : error ? (
        <div className="game-history-state is-error">
          <p>{error}</p>
          <button type="button" onClick={loadHistory}>Thử lại</button>
        </div>
      ) : entries.length === 0 ? (
        <div className="game-history-empty">
          <History size={28} />
          <h2>Chưa có phòng nào trong lịch sử.</h2>
          <p>Hoàn thành hoặc tham gia một phòng để kết quả xuất hiện tại đây.</p>
          <Link href="/game">Bắt đầu phiên đầu tiên</Link>
        </div>
      ) : (
        <div className="game-history-layout">
          <aside className="game-history-list" aria-label="Các phòng đã tham gia">
            <div>
              <span>{entries.length} phòng</span>
              <small>Lưu trên hồ sơ ẩn danh của thiết bị</small>
            </div>
            {entries.map((entry) => (
              <button
                key={entry.sessionId}
                type="button"
                className={`game-history-room ${selected?.sessionId === entry.sessionId ? 'is-active' : ''}`}
                onClick={() => setSelected(entry)}
              >
                <span>{entry.roomCode}</span>
                <strong>{entry.roomName}</strong>
                <small>{entry.groupName}</small>
                <div>
                  <span><CalendarDays size={12} /> {formatDate(entry.joinedAt)}</span>
                  <b>{entry.finalScore?.toFixed(1) ?? 'Đang chơi'}</b>
                </div>
              </button>
            ))}
          </aside>

          {selected && (
            <section className="game-history-detail">
              <header>
                <div>
                  <p className="game-overline"><Trophy size={14} /> Kết quả của bạn</p>
                  <h2>{selected.roomName}</h2>
                  <span>{selected.groupName}</span>
                </div>
                <div className="game-history-score">
                  <span>Điểm cá nhân</span>
                  <strong>{selected.finalScore?.toFixed(1) ?? '—'}</strong>
                  <small>{selected.rank ? `Hạng #${selected.rank}` : 'Chưa có hạng'}</small>
                </div>
              </header>

              <div className="game-history-personal">
                <div>
                  <span>Trạng thái</span>
                  <strong>{selected.completedAt ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</strong>
                </div>
                <div>
                  <span>Kết cục</span>
                  <strong>{selected.outcomeType ? OUTCOME_LABELS[selected.outcomeType] : 'Chưa xác định'}</strong>
                </div>
                <div>
                  <span>Nhóm</span>
                  <strong><UsersRound size={14} /> {selected.groupName}</strong>
                </div>
              </div>

              <Leaderboard
                roomId={selected.roomId}
                token={selected.playerToken}
                compact
              />
            </section>
          )}
        </div>
      )}

      <Link href="/game" className="game-history-back"><ArrowLeft size={14} /> Trở lại trò chơi</Link>
    </div>
  );
}
