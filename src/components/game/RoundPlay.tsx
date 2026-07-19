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
  ListRestart,
  Scale,
  ServerCog,
  ShieldCheck,
  Split,
} from 'lucide-react';
import { useGameStore } from '@/store/game-store';
import type { RoundAllocation } from '@/types';
import { getPolicyStage, INVESTMENT_AREAS } from '@/lib/game-scenarios';
import GlossaryTerm from './GlossaryTerm';

const AREA_ICONS = {
  education: GraduationCap,
  innovation: BrainCircuit,
  infrastructure: ServerCog,
  fdi: Handshake,
};

const AREA_GLOSSARY = {
  education: { term: 'education', placement: 'bottom' },
  innovation: { term: 'innovation', placement: 'bottom' },
  infrastructure: { term: 'infrastructure', placement: 'top' },
  fdi: { term: 'fdi', placement: 'top' },
} as const;

function formatValue(value: number) {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value);
}

export default function RoundPlay() {
  const [borrowingOpen, setBorrowingOpen] = useState(false);
  const {
    session,
    allocations,
    borrowedAmount,
    updateAllocation,
    balanceAllocation,
    clearAllocation,
    setBorrowedAmount,
    showEvent,
    setError,
  } = useGameStore();

  const total = useMemo(
    () => Object.values(allocations).reduce((sum, value) => sum + value, 0),
    [allocations],
  );
  if (!session) return null;

  const stage = getPolicyStage(session.currentRound);
  const available = session.budgetForRound + borrowedAmount;
  const remaining = available - total;
  const maxBorrow = Math.floor((session.budgetForRound * 0.5) / 5) * 5;
  const fdiShare = available ? allocations.fdi / available : 0;
  const hasFdiRisk = fdiShare > 0.5 && allocations.innovation < 20;
  const hasLateEducationRisk =
    session.currentRound === 4 && allocations.education > available * 0.35;
  const shockActive =
    session.currentRound === session.shockRound &&
    !session.histories.some((history) => history.shock);

  const goToEvent = () => {
    if (remaining !== 0) {
      setError(
        remaining > 0
          ? `Bạn còn ${formatValue(remaining)} RP chưa phân bổ.`
          : `Bạn đang vượt ngân sách ${formatValue(Math.abs(remaining))} RP.`,
      );
      return;
    }
    showEvent();
  };

  const metrics = [
    { label: 'Năng suất', value: session.metrics.productivity, icon: Gauge, term: 'productivity' },
    { label: 'Tự chủ', value: session.metrics.autonomy, icon: BrainCircuit, term: 'autonomy' },
    { label: 'Hấp thụ', value: session.metrics.absorption, icon: GraduationCap, term: 'absorption' },
    { label: 'Chống chịu', value: session.metrics.resilience, icon: ShieldCheck, term: 'resilience' },
  ] as const;

  return (
    <section className="game2-play">
      <header className="game2-stage-header">
        <div>
          <p className="game-overline">
            Giai đoạn {String(session.currentRound).padStart(2, '0')} · {stage.period}
          </p>
          <h1>{stage.title}</h1>
          <p>{stage.premise}</p>
        </div>
        <div className="game2-stage-index">
          <span>{stage.yearLabel}</span>
          <strong>{session.currentRound}/4</strong>
        </div>
      </header>

      <div className="game2-run-metrics">
        {metrics.map(({ label, value, icon: Icon, term }) => (
          <div key={label}>
            <Icon size={15} />
            <GlossaryTerm term={term}>{label}</GlossaryTerm>
            <strong>{value.toFixed(1)}</strong>
          </div>
        ))}
        <div className={session.metrics.debtOutstanding > 0 ? 'is-warning' : ''}>
          <Coins size={15} />
          <GlossaryTerm term="debt">Nợ tồn</GlossaryTerm>
          <strong>{session.metrics.debtOutstanding.toFixed(0)} RP</strong>
        </div>
      </div>

      <div className="game2-play-layout">
        <aside className="game2-brief-column">
          <p className="game-overline"><Landmark size={15} /> Bản tin điều hành</p>
          <div className="game2-budget-readout">
            <div><GlossaryTerm term="rp">Ngân sách cơ sở</GlossaryTerm><strong>{session.budgetForRound} RP</strong></div>
            <div><span>Vay kỳ này</span><strong>{borrowedAmount ? `+${borrowedAmount}` : '0'} RP</strong></div>
            <div><span>Đang phân bổ</span><strong>{total}/{available} RP</strong></div>
          </div>

          {shockActive && (
            <div className="game2-context-alert">
              <CircleAlert size={16} />
              <p>
                Biến cố chung đang làm hiệu quả chính sách phụ thuộc mạnh hơn vào
                năng lực bạn đã tích lũy.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setBorrowingOpen((value) => !value)}
            className="game-secondary-action game-cursor-target"
          >
            <Scale size={16} />
            {borrowingOpen ? 'Đóng bảng vay' : 'Mở tùy chọn vay'}
          </button>

          {borrowingOpen && (
            <div className="game2-borrow">
              <div><span>Khoản vay</span><strong>{borrowedAmount} RP</strong></div>
              <input
                type="range"
                min="0"
                max={maxBorrow}
                step="5"
                value={borrowedAmount}
                onChange={(event) => setBorrowedAmount(Number(event.target.value))}
                aria-label="Khoản vay công nghệ"
              />
              <p>
                Hạn mức {maxBorrow} RP. Nghĩa vụ kỳ sau bằng 120% khoản vay.
              </p>
            </div>
          )}

          <div className="game2-path-note">
            <span>Phụ thuộc đường dẫn</span>
            <p>
              <GlossaryTerm term="educationDelay">Giáo dục kỳ này</GlossaryTerm> phát huy
              ở kỳ sau. <GlossaryTerm term="fdi">FDI</GlossaryTerm> vượt 50% cùng{' '}
              <GlossaryTerm term="innovation">R&amp;D</GlossaryTerm> dưới 20 trong hai kỳ
              liên tiếp sẽ kích hoạt <GlossaryTerm term="dependency">hệ số phạt</GlossaryTerm>.
            </p>
          </div>
        </aside>

        <div className="game2-allocation">
          <div className="game2-workspace-heading">
            <div className="game2-workspace-copy">
              <p className="game-overline">Bước 1 / 2</p>
              <h2>Phân bổ nguồn lực</h2>
              <p>
                Bạn đang xây năng lực cho quốc gia. Mỗi RP đặt vào một lĩnh vực sẽ
                thay đổi điểm mạnh và giới hạn của chiến lược ở bước kế tiếp.
              </p>
            </div>
            <div className="game2-allocation-tools">
              <div className={`game2-remaining ${remaining === 0 ? 'is-complete' : ''}`}>
                <span>{remaining === 0 ? 'Đã phân bổ đủ' : 'Còn phải phân bổ'}</span>
                <strong>{Math.abs(remaining)} RP</strong>
              </div>
              <div>
                <button
                  type="button"
                  onClick={balanceAllocation}
                  className="game2-compact-command game-cursor-target"
                >
                  <Split size={14} /> Chia đều
                </button>
                <button
                  type="button"
                  onClick={clearAllocation}
                  className="game2-icon-command game-cursor-target"
                  aria-label="Đặt lại phân bổ về 0"
                  title="Đặt lại phân bổ về 0"
                >
                  <ListRestart size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="game2-allocation-bar" aria-label={`${total}/${available} RP`}>
            {INVESTMENT_AREAS.map((area) => (
              <i
                key={area.key}
                style={{
                  width: `${available ? (allocations[area.key as keyof RoundAllocation] / available) * 100 : 0}%`,
                  backgroundColor: area.color,
                }}
              />
            ))}
            {remaining > 0 && <em style={{ width: `${(remaining / available) * 100}%` }} />}
          </div>

          <div className="game2-allocation-grid">
            {INVESTMENT_AREAS.map((area) => {
              const key = area.key as keyof RoundAllocation;
              const Icon = AREA_ICONS[key];
              const glossary = AREA_GLOSSARY[key];
              const value = allocations[key];
              return (
                <div key={key} className="game2-allocation-control">
                  <div>
                    <span className="game2-area-icon" style={{ color: area.color }}>
                      <Icon size={17} />
                    </span>
                    <div>
                      <h3>
                        <GlossaryTerm
                          term={glossary.term}
                          preferredPlacement={glossary.placement}
                        >
                          {area.label}
                        </GlossaryTerm>
                      </h3>
                      <p>{area.description}</p>
                    </div>
                    <strong style={{ color: area.color }}>{value}<small> RP</small></strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={available}
                    step="1"
                    value={value}
                    onChange={(event) => updateAllocation(key, Number(event.target.value))}
                    aria-label={area.label}
                    style={{ '--game-range-color': area.color } as React.CSSProperties}
                  />
                </div>
              );
            })}
          </div>

          {(hasFdiRisk || hasLateEducationRisk) && (
            <div className="game2-strategy-alert">
              <CircleAlert size={16} />
              <p>
                {hasFdiRisk
                  ? 'Cấu trúc này tạo một kỳ rủi ro phụ thuộc FDI. Lặp lại ở kỳ sau sẽ kích hoạt hệ số phạt.'
                  : 'Nhân lực đầu tư ở chặng cuối không còn đủ một kỳ để phát huy trọn vẹn trước năm 2030.'}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={goToEvent}
            disabled={remaining !== 0}
            className="game-primary-action game-cursor-target game2-allocation-next"
          >
            Khóa nguồn lực, sang chọn chiến lược <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
