'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw, Trophy } from 'lucide-react';
import type { LeaderboardEntry } from '@/types';
import { getLeaderboard } from '@/lib/api';

const REFRESH_INTERVAL = 10_000;
const MAX_ENTRIES = 20;

const OUTCOME_BADGES: Record<string, { label: string; className: string }> = {
  LEAPFROG: { label: 'Nội lực', className: 'border-[#3cc7bd]/35 bg-[#3cc7bd]/10 text-[#3cc7bd]' },
  DEPENDENT: { label: 'Phụ thuộc', className: 'border-[#e9a35a]/35 bg-[#e9a35a]/10 text-[#e9a35a]' },
  DISRUPTED: { label: 'Đứt gãy', className: 'border-[#c76e58]/35 bg-[#c76e58]/10 text-[#d89180]' },
};

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const data = await getLeaderboard();
      setEntries(data.entries.slice(0, MAX_ENTRIES));
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể tải bảng xếp hạng.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(fetchLeaderboard, 0);
    const interval = window.setInterval(fetchLeaderboard, REFRESH_INTERVAL);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [fetchLeaderboard]);

  if (isLoading) {
    return <div className="grid min-h-40 place-items-center gap-3 text-center"><RefreshCw className="animate-spin text-[#3cc7bd]" size={24} /><p className="text-sm text-[#91a9b0]">Đang đồng bộ kết quả phiên mô phỏng...</p></div>;
  }

  if (error) {
    return <div className="flex min-h-40 flex-col items-center justify-center gap-3 border border-[#c76e58]/30 bg-[#c76e58]/[0.07] p-6 text-center"><p className="text-sm text-[#d89180]">{error}</p><button type="button" onClick={fetchLeaderboard} className="game-secondary-action">Tải lại</button></div>;
  }

  if (entries.length === 0) {
    return <div className="grid min-h-40 place-items-center border border-dashed border-white/15 p-6 text-center"><p className="max-w-sm text-sm leading-6 text-[#91a9b0]">Chưa có phiên mô phỏng nào hoàn tất. Kết quả đầu tiên sẽ xuất hiện tại đây.</p></div>;
  }

  return (
    <div>
      <div className="overflow-x-auto border border-white/10">
        <table className="w-full min-w-[34rem] text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.025]">
              {['Hạng', 'Người chơi', 'Lớp', 'Điểm', 'Kết cục', 'Hoàn tất'].map((label, index) => <th key={label} className={`${index === 2 || index === 5 ? 'hidden sm:table-cell' : ''} px-3 py-2.5 ${index === 3 ? 'text-right' : ''} font-mono text-[0.62rem] font-semibold uppercase tracking-wider text-[#829aa2]`}>{label}</th>)}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {entries.map((entry) => {
                const badge = OUTCOME_BADGES[entry.outcomeType] ?? OUTCOME_BADGES.DISRUPTED;
                return (
                  <motion.tr
                    key={`${entry.nickname}-${entry.completedAt}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className={`border-b border-white/[0.07] transition-colors hover:bg-white/[0.035] ${entry.rank === 1 ? 'border-l-2 border-l-[#e9a35a] bg-[#e9a35a]/[0.035]' : ''}`}
                  >
                    <td className="px-3 py-3 font-mono text-sm font-bold text-[#eff7f8]">#{entry.rank}</td>
                    <td className="px-3 py-3 font-display text-sm font-semibold text-[#dce9ea]">{entry.nickname}</td>
                    <td className="hidden px-3 py-3 text-xs text-[#8fa7ae] sm:table-cell">{entry.className || '—'}</td>
                    <td className="px-3 py-3 text-right font-mono text-sm font-bold tabular-nums text-[#3cc7bd]">{entry.finalScore.toFixed(1)}</td>
                    <td className="px-3 py-3"><span className={`inline-flex border px-2 py-1 font-mono text-[0.58rem] font-bold uppercase tracking-[0.05em] ${badge.className}`}>{badge.label}</span></td>
                    <td className="hidden px-3 py-3 text-right font-mono text-xs text-[#8fa7ae] sm:table-cell">{formatTime(entry.completedAt)}</td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-[#819aa2]"><Trophy size={14} className="text-[#e9a35a]" />Bảng phiên mô phỏng tự cập nhật mỗi 10 giây</p>
    </div>
  );
}
