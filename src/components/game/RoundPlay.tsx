'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  CircleAlert,
  Coins,
  Gauge,
  GraduationCap,
  Handshake,
  Landmark,
  Scale,
  ServerCog,
} from 'lucide-react';
import { useGameStore } from '@/store/game-store';
import type { RoundAllocation } from '@/types';
import { getPolicyStage, INVESTMENT_AREAS } from '@/lib/game-scenarios';

const AREA_ICONS = {
  education: GraduationCap,
  innovation: BrainCircuit,
  infrastructure: ServerCog,
  fdi: Handshake,
};

function formatValue(value: number) {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value);
}

export default function RoundPlay() {
  const [borrowingOpen, setBorrowingOpen] = useState(false);
  const {
    currentRound,
    allocations,
    borrowedAmount,
    budgetForRound,
    debtOutstanding,
    autonomyIndex,
    scores,
    updateAllocation,
    setBorrowedAmount,
    showEvent,
    setError,
  } = useGameStore();
  const stage = getPolicyStage(currentRound);
  const available = budgetForRound + borrowedAmount;
  const total = useMemo(() => Object.values(allocations).reduce((sum, value) => sum + value, 0), [allocations]);
  const remaining = available - total;
  const hasFdiRisk = allocations.fdi > available * 0.5 && allocations.innovation < 20;
  const hasLateEducationRisk = currentRound === 4 && allocations.education > available * 0.35;

  const goToEvent = () => {
    if (remaining !== 0) {
      setError(`Cần phân bổ đủ ${formatValue(available)} RP. Bạn còn ${formatValue(Math.abs(remaining))} RP ${remaining > 0 ? 'chưa dùng' : 'vượt ngân sách'}.`);
      return;
    }
    showEvent();
  };

  return (
    <section className="game-play-scene">
      <header className="game-stage-header">
        <div><p className="game-overline">Giai đoạn {String(currentRound).padStart(2, '0')} · {stage.period}</p><h1>{stage.title}</h1></div>
        <div className="game-stage-status"><span>{stage.yearLabel}</span><i /><span>{currentRound}/4</span></div>
      </header>

      <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)] xl:gap-10">
        <aside className="game-stage-brief">
          <div className="flex items-center gap-2 text-[#3cc7bd]"><Landmark size={17} strokeWidth={1.5} /><span className="game-overline">Bản tin điều hành</span></div>
          <p className="mt-4 font-display text-2xl font-medium leading-tight text-[#f2f7f7]">{stage.premise}</p>
          <p className="mt-5 text-sm leading-6 text-[#9eb4bc]">Ở cuối chặng, bạn sẽ phải chọn một phản ứng chính sách. Phân bổ hôm nay quyết định mức độ linh hoạt của lựa chọn đó.</p>

          <dl className="game-run-metrics">
            <div><dt><Gauge size={15} />Năng suất tích lũy</dt><dd>{scores.length ? scores[scores.length - 1].toFixed(1) : '0.0'}</dd></div>
            <div><dt><BrainCircuit size={15} />Chỉ số tự chủ</dt><dd>{autonomyIndex.toFixed(1)}</dd></div>
            <div><dt><Coins size={15} />Nợ công nghệ</dt><dd>{formatValue(debtOutstanding)} RP</dd></div>
          </dl>

          <div className="game-budget-summary">
            <div><span>Nguồn lực cơ sở</span><strong>{formatValue(budgetForRound)} RP</strong></div>
            <div><span>Vay công nghệ</span><strong className={borrowedAmount ? 'text-[#e9a35a]' : ''}>{borrowedAmount ? `+${formatValue(borrowedAmount)} RP` : 'Không'}</strong></div>
            <div><span>Khả dụng chặng này</span><strong>{formatValue(available)} RP</strong></div>
          </div>

          <button type="button" onClick={() => setBorrowingOpen((value) => !value)} className="game-secondary-action mt-5"><Scale size={16} />{borrowingOpen ? 'Đóng tùy chọn vay' : 'Tùy chọn vay công nghệ'}</button>
          {borrowingOpen && (
            <div className="game-borrow-control">
              <div><p>Vay thêm nguồn lực</p><strong>{borrowedAmount} RP</strong></div>
              <input type="range" min="0" max="50" step="5" value={borrowedAmount} onChange={(event) => setBorrowedAmount(Number(event.target.value))} aria-label="Vay thêm nguồn lực công nghệ" />
              <p>Nợ bị tính lãi ở chặng sau và trừ trực tiếp khi xác định kết cục năm 2030.</p>
            </div>
          )}
        </aside>

        <div className="game-allocation-workspace">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div><p className="game-overline">Bước 1 / 2</p><h2>Phân bổ nguồn lực</h2></div>
            <div className={`game-rp-counter ${remaining === 0 ? 'is-complete' : ''}`}><span>{remaining === 0 ? 'Đã khóa ngân sách' : 'Còn lại'}</span><strong>{formatValue(Math.abs(remaining))} RP</strong></div>
          </div>

          <div className="game-allocation-bar mt-6" aria-label={`Đã phân bổ ${total} trên ${available} RP`}>
            {INVESTMENT_AREAS.map((area) => <i key={area.key} style={{ width: `${available ? (allocations[area.key as keyof RoundAllocation] / available) * 100 : 0}%`, backgroundColor: area.color }} />)}
            {remaining > 0 && <em style={{ width: `${(remaining / available) * 100}%` }} />}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-[#849aa3]">{INVESTMENT_AREAS.map((area) => <span key={area.key}><b style={{ color: area.color }}>{area.shortLabel}</b> {allocations[area.key as keyof RoundAllocation]}</span>)}</div>

          <div className="mt-8 space-y-7">
            {INVESTMENT_AREAS.map((area) => {
              const key = area.key as keyof RoundAllocation;
              const Icon = AREA_ICONS[key];
              const value = allocations[key];
              return (
                <div key={key} className="game-allocation-control">
                  <div className="flex items-start justify-between gap-4"><div className="flex gap-3"><span className="game-area-icon" style={{ color: area.color }}><Icon size={18} strokeWidth={1.5} /></span><div><h3>{area.label}</h3><p>{area.description}</p></div></div><strong style={{ color: area.color }}>{formatValue(value)} <small>RP</small></strong></div>
                  <input type="range" min="0" max={available} step="1" value={value} onChange={(event) => updateAllocation(key, Number(event.target.value))} aria-label={area.label} style={{ '--game-range-color': area.color, '--game-range-value': `${available ? (value / available) * 100 : 0}%` } as React.CSSProperties} />
                </div>
              );
            })}
          </div>

          {(hasFdiRisk || hasLateEducationRisk) && <div className="game-strategy-alert mt-7"><CircleAlert size={17} />{hasFdiRisk ? <p>FDI đang chiếm tỷ trọng lớn khi R&D mỏng. Nếu lặp lại, mô hình sẽ tích lũy rủi ro phụ thuộc công nghệ.</p> : <p>Đầu tư nhân lực ở chặng cuối sẽ không kịp phát huy toàn bộ độ trễ một giai đoạn trước năm 2030.</p>}</div>}

          <button type="button" onClick={goToEvent} className="game-primary-action game-cursor-target mt-8 w-full justify-center" disabled={remaining !== 0}>Sang bước 2: chọn phản ứng chính sách <ArrowRight size={17} /></button>
        </div>
      </div>
    </section>
  );
}
