'use client';

import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  Coins,
  Gauge,
  GraduationCap,
  Handshake,
  Lightbulb,
  Network,
  ServerCog,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  GLOSSARY,
  SHOCK_GUIDE,
  TUTORIAL_STEPS,
  type TutorialView,
} from '@/lib/game-help-content';
import { SHOCK_CONTENT } from '@/lib/game-content';
import useReducedMotion from '@/hooks/useReducedMotion';

type GameOnboardingProps = {
  isOpen: boolean;
  entryMode: boolean;
  onFinish: () => void;
};

type FocusRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const VIEW_LABELS: Record<TutorialView, string> = {
  MISSION: 'Mục tiêu',
  ALLOCATION: 'Phân bổ',
  STRATEGY: 'Chiến lược',
  SHOCKS: 'Biến cố',
};

function MissionBoard() {
  return (
    <div className="game2-tour-mission" data-tour-focus="mission">
      <p className="game-overline"><Sparkles size={14} /> Nhiệm kỳ chính sách 2025-2030</p>
      <h2>Đưa năng suất đi lên mà không đánh đổi quyền làm chủ.</h2>
      <p>
        Bốn quyết định tạo thành một quỹ đạo. Điểm số chỉ là phần nổi; nội lực,
        nợ và khả năng vượt sốc mới quyết định chất lượng về đích.
      </p>
      <div className="game2-tour-outcomes">
        <div className="is-positive"><span>01</span><strong>Bứt phá</strong><small>Điểm &gt;= 120 · Tự chủ &gt;= 18</small></div>
        <div className="is-warning"><span>02</span><strong>Phụ thuộc</strong><small>Tăng trưởng nhưng chưa làm chủ</small></div>
        <div><span>03</span><strong>Đứt gãy</strong><small>Không đủ năng lực giữ quỹ đạo</small></div>
      </div>
    </div>
  );
}

function AllocationBoard() {
  const metrics = [
    { id: 'productivity', label: 'Năng suất', value: '0.0', icon: Gauge },
    { id: 'autonomy', label: 'Tự chủ', value: '0.0', icon: BrainCircuit },
    { id: 'absorption', label: 'Hấp thụ', value: '8.0', icon: GraduationCap },
    { id: 'resilience', label: 'Chống chịu', value: '16.0', icon: ShieldCheck },
    { id: 'debt', label: 'Nợ tồn', value: '0 RP', icon: Coins },
  ];
  const areas = [
    { label: 'Giáo dục & nhân lực', value: 25, icon: GraduationCap, color: '#3cc7bd' },
    { label: 'R&D & đổi mới', value: 25, icon: BrainCircuit, color: '#e9a35a' },
    { label: 'Hạ tầng số', value: 25, icon: ServerCog, color: '#7ba7b7' },
    { label: 'FDI & chuyển giao', value: 25, icon: Handshake, color: '#a2a7ac' },
  ];
  return (
    <div className="game2-tour-allocation">
      <header>
        <div>
          <p className="game-overline">Giai đoạn 01 · 2025-2026</p>
          <h2>Củng cố nền tảng</h2>
        </div>
        <strong>1/4</strong>
      </header>
      <div className="game2-tour-metrics">
        {metrics.map(({ id, label, value, icon: Icon }) => (
          <div key={id} data-tour-focus={id}>
            <Icon size={14} /><span>{label}</span><strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="game2-tour-allocation-layout">
        <aside data-tour-focus="rp">
          <p className="game-overline">Bản tin điều hành</p>
          <div><span>Ngân sách cơ sở</span><strong>100 RP</strong></div>
          <div><span>Đã phân bổ</span><strong>100/100 RP</strong></div>
          <div><span>Còn lại</span><strong>0 RP</strong></div>
          <small>RP là nguồn lực để xây năng lực, không phải điểm thắng.</small>
        </aside>
        <section data-tour-focus="investment-areas">
          <div className="game2-tour-area-heading">
            <div><span>Bước 1 / 2</span><strong>Phân bổ nguồn lực</strong></div>
            <button type="button" tabIndex={-1}>Chia đều</button>
          </div>
          <div className="game2-tour-area-grid">
            {areas.map(({ label, value, icon: Icon, color }) => (
              <div key={label}>
                <Icon size={16} style={{ color }} />
                <span>{label}</span>
                <strong style={{ color }}>{value} RP</strong>
                <i><b style={{ width: `${value * 2.8}%`, background: color }} /></i>
              </div>
            ))}
          </div>
          <div className="game2-tour-lock">Khóa nguồn lực, sang chọn chiến lược <ArrowRight size={14} /></div>
        </section>
      </div>
    </div>
  );
}

function StrategyBoard() {
  const cards = [
    {
      id: 'A',
      title: 'Mở cửa tối đa cho FDI',
      signal: 'Tăng nhanh · phụ thuộc cao',
      detail: 'Công suất tăng mạnh nhưng tự chủ chịu sức ép nếu R&D còn mỏng.',
    },
    {
      id: 'B',
      title: 'FDI có điều kiện chuyển giao',
      signal: 'Tăng trưởng có liên kết',
      detail: 'Đổi một phần tốc độ lấy đào tạo và hợp tác công nghệ.',
    },
    {
      id: 'C',
      title: 'Ưu tiên doanh nghiệp nội địa',
      signal: 'Đầu tư chiều sâu',
      detail: 'Tự chủ tăng mạnh hơn nhưng bỏ lỡ một phần dòng vốn ngắn hạn.',
    },
  ];
  return (
    <div className="game2-tour-strategy" data-tour-focus="strategy">
      <p className="game-overline"><Network size={14} /> Bước 2 / 2 · 2026-2027</p>
      <h2>Dùng nền năng lực vừa xây để chọn chiến lược.</h2>
      <div className="game2-tour-locked">
        <span>Nguồn lực đã khóa</span>
        <b>Nhân lực 20</b><b>R&D 30</b><b>Hạ tầng 20</b><b>FDI 30</b>
      </div>
      <div className="game2-tour-policy-grid">
        {cards.map((card, index) => (
          <article key={card.id} className={index === 1 ? 'is-selected' : ''}>
            <span>{card.id}</span>
            <small>{card.signal}</small>
            <strong>{card.title}</strong>
            <p>{card.detail}</p>
            {index === 1 && <Check size={17} />}
          </article>
        ))}
      </div>
      <p className="game2-tour-dependency">
        <Lightbulb size={14} /> Cùng lựa chọn B, người có R&D và tự chủ cao sẽ nhận
        kết quả khác người đang mang nợ và chuỗi phụ thuộc.
      </p>
    </div>
  );
}

function ShocksBoard() {
  return (
    <div className="game2-tour-shocks" data-tour-focus="shocks">
      <p className="game-overline"><ShieldCheck size={14} /> Một biến cố ở vòng 2 hoặc 3</p>
      <h2>RoomSeed chọn cú sốc; năng lực của bạn chọn mức thiệt hại.</h2>
      <div>
        {SHOCK_GUIDE.map((shock, index) => (
          <article key={shock.id}>
            <span>0{index + 1}</span>
            <div>
              <small>{SHOCK_CONTENT[shock.id].title}</small>
              <strong>{shock.shortTitle}</strong>
              <p>Bảo vệ bởi <b>{shock.defense}</b></p>
            </div>
            <em>{shock.threshold}</em>
          </article>
        ))}
      </div>
      <footer>
        <div><span>Mức thấp</span><strong>-1.5 năng suất</strong></div>
        <div><span>Mức vừa</span><strong>-3.5 năng suất</strong></div>
        <div><span>Mức cao</span><strong>-6 năng suất</strong></div>
      </footer>
    </div>
  );
}

function TutorialBoard({ view }: { view: TutorialView }) {
  return (
    <div className="game2-tour-board" aria-hidden="true">
      <div className="game-shell-grid" />
      <div className="game2-tour-boardbar">
        <div><span>ĐƯỜNG ĐẾN 2030</span><strong>Phòng thử nghiệm</strong></div>
        <ol>
          {Object.entries(VIEW_LABELS).map(([key, label], index) => (
            <li key={key} className={view === key ? 'is-active' : ''}>
              <span>{index + 1}</span><small>{label}</small>
            </li>
          ))}
        </ol>
      </div>
      <div className="game2-tour-board-content">
        {view === 'MISSION' && <MissionBoard />}
        {view === 'ALLOCATION' && <AllocationBoard />}
        {view === 'STRATEGY' && <StrategyBoard />}
        {view === 'SHOCKS' && <ShocksBoard />}
      </div>
    </div>
  );
}

export default function GameOnboarding({
  isOpen,
  entryMode,
  onFinish,
}: GameOnboardingProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [focusRect, setFocusRect] = useState<FocusRect | null>(null);
  const reducedMotion = useReducedMotion();
  const step = TUTORIAL_STEPS[stepIndex];
  const isLast = stepIndex === TUTORIAL_STEPS.length - 1;
  const detailedTerm = step.term ? GLOSSARY[step.term] : null;

  const finish = useCallback(() => {
    setStepIndex(0);
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    root.classList.add('game-onboarding-open');
    return () => root.classList.remove('game-onboarding-open');
  }, [isOpen]);

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const target = root.querySelector<HTMLElement>(
      `[data-tour-focus="${step.focusId}"]`,
    );
    if (!target) {
      setFocusRect(null);
      return;
    }
    const rect = target.getBoundingClientRect();
    const gap = window.innerWidth <= 640 ? 5 : 9;
    const nextRect = {
      left: rect.left - gap,
      top: rect.top - gap,
      width: rect.width + gap * 2,
      height: rect.height + gap * 2,
    };
    setFocusRect((current) => {
      if (
        current &&
        Math.abs(current.left - nextRect.left) < 0.5 &&
        Math.abs(current.top - nextRect.top) < 0.5 &&
        Math.abs(current.width - nextRect.width) < 0.5 &&
        Math.abs(current.height - nextRect.height) < 0.5
      ) return current;
      return nextRect;
    });
  }, [step.focusId]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = window.requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    if (rootRef.current) observer.observe(rootRef.current);
    window.addEventListener('resize', measure);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [isOpen, measure, step.view]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (isLast) finish();
        else setStepIndex((value) => value + 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setStepIndex((value) => Math.max(0, value - 1));
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        finish();
      }
      if (event.key === 'Tab') {
        const focusables = Array.from(
          panelRef.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), [tabindex]:not([tabindex="-1"])',
          ) ?? [],
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [finish, isLast, isOpen]);

  useGSAP(() => {
    if (!isOpen || reducedMotion) return;
    const timeline = gsap.timeline();
    timeline
      .fromTo(
        '.game2-tour-board-content > *',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.36, ease: 'power3.out' },
      )
      .fromTo(
        panelRef.current,
        { autoAlpha: 0, x: 18 },
        { autoAlpha: 1, x: 0, duration: 0.32, ease: 'power3.out' },
        '<0.06',
      );
    if (outlineRef.current) {
      gsap.fromTo(
        outlineRef.current,
        { autoAlpha: 0, scale: 0.985 },
        { autoAlpha: 1, scale: 1, duration: 0.28, ease: 'power2.out' },
      );
    }
  }, {
    scope: rootRef,
    dependencies: [isOpen, reducedMotion, stepIndex],
    revertOnUpdate: true,
  });

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen, stepIndex]);

  const outlineStyle = useMemo(() => {
    if (!focusRect) return undefined;
    return {
      left: focusRect.left,
      top: focusRect.top,
      width: focusRect.width,
      height: focusRect.height,
    } as CSSProperties;
  }, [focusRect]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={rootRef}
      className="game2-onboarding"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game2-tour-title"
    >
      <TutorialBoard view={step.view} />
      {focusRect && (
        <div
          ref={outlineRef}
          className="game2-tour-outline"
          style={outlineStyle}
          aria-hidden="true"
        />
      )}

      <section
        ref={panelRef}
        className="game2-tour-coach"
        tabIndex={-1}
      >
        <header>
          <div>
            <span>Hướng dẫn nhanh</span>
            <strong>{String(stepIndex + 1).padStart(2, '0')} / {TUTORIAL_STEPS.length}</strong>
          </div>
          <button type="button" onClick={finish} aria-label="Bỏ qua hướng dẫn">
            <X size={17} />
          </button>
        </header>
        <div className="game2-tour-progress" aria-hidden="true">
          <i style={{ width: `${((stepIndex + 1) / TUTORIAL_STEPS.length) * 100}%` }} />
        </div>
        <div className="game2-tour-copy">
          <p>{step.eyebrow}</p>
          <h1 id="game2-tour-title">{step.title}</h1>
          <span>{step.description}</span>
          <ul>
            {step.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
          {detailedTerm && (
            <code>{detailedTerm.formula}</code>
          )}
        </div>
        <footer>
          <button
            type="button"
            onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
            disabled={stepIndex === 0}
            className="game2-tour-back"
          >
            <ArrowLeft size={15} /> Quay lại
          </button>
          <button
            type="button"
            onClick={finish}
            className="game2-tour-skip"
          >
            {entryMode ? 'Bỏ qua' : 'Đóng tour'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (isLast) finish();
              else setStepIndex((value) => value + 1);
            }}
            className="game2-tour-next"
          >
            {isLast
              ? entryMode
                ? 'Tôi đã hiểu, vào phòng'
                : 'Hoàn tất'
              : 'Tiếp theo'}
            <ArrowRight size={15} />
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
