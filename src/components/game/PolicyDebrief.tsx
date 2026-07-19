'use client';

import { ArrowRight, CircleAlert, Network } from 'lucide-react';
import { useGameStore } from '@/store/game-store';
import { getPolicyStage } from '@/lib/game-scenarios';

function reflectionFor(round: number, choice: string) {
  if (round === 2 && choice === 'A') return 'Dòng vốn vào nhanh đã đổi lấy điều gì khi R&D nội địa chưa đủ dày?';
  if (round === 3 && choice === 'C') return 'Việc chuyển nguồn lực sang R&D ở thời điểm cú sốc đã thay đổi năng lực tự chủ ra sao?';
  if (round === 4 && choice === 'C') return 'Vì sao điểm tăng ngắn hạn từ chuyển giao bên ngoài vẫn không thay thế được quyền làm chủ công nghệ?';
  return 'Lựa chọn ở chặng này đã mở rộng hay thu hẹp nguồn lực cho chặng kế tiếp như thế nào?';
}

export default function PolicyDebrief() {
  const { roundHistories, autonomyIndex, debtOutstanding, completeGame, isLoading } = useGameStore();

  return (
    <section className="game-debrief-scene">
      <div className="max-w-3xl">
        <div className="game-overline"><Network size={15} strokeWidth={1.5} />Hồ sơ chính sách 2025-2030</div>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.8rem)] font-semibold leading-[1.05] text-[#f2f7f7]">Bốn lựa chọn đã tạo nên một quỹ đạo.</h2>
        <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-[#aebfc8]">Trước khi xác định kết cục, hãy nhìn lại cách từng phản ứng đã tác động đến năng lực tự chủ và khoản nợ công nghệ còn lại.</p>
      </div>

      <div className="game-debrief-metrics mt-8">
        <div><span>Chỉ số tự chủ</span><strong>{autonomyIndex.toFixed(1)}</strong></div>
        <div><span>Nợ công nghệ</span><strong>{debtOutstanding.toFixed(0)} RP</strong></div>
        <div><span>Chặng hoàn tất</span><strong>{roundHistories.length}/4</strong></div>
      </div>

      <ol className="game-policy-timeline mt-10">
        {roundHistories.map((history) => {
          const stage = getPolicyStage(history.roundNumber);
          const choice = stage.options.find((option) => option.id === history.eventChoice);
          return (
            <li key={history.roundNumber}>
              <div className="game-policy-marker">{history.roundNumber}</div>
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><p className="game-overline">{stage.period}</p><span className="font-mono text-[10px] text-[#e9a35a]">Lựa chọn {history.eventChoice}</span></div>
                <h3>{stage.title}</h3>
                <p className="text-[#d6e3e5]"><strong>{choice?.title}</strong> — {choice?.summary}</p>
                <p className="game-reflection"><CircleAlert size={15} />{reflectionFor(history.roundNumber, history.eventChoice)}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <button type="button" disabled={isLoading} onClick={completeGame} className="game-primary-action mt-10 disabled:opacity-50">Xác định kết cục năm 2030 <ArrowRight size={17} /></button>
    </section>
  );
}
