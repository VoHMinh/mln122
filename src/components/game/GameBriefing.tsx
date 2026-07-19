'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen,
  CircleHelp,
  Gauge,
  LibraryBig,
  Map,
  PlayCircle,
  ShieldAlert,
  Target,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  GLOSSARY,
  GLOSSARY_ORDER,
  SHOCK_GUIDE,
  type GlossaryKey,
} from '@/lib/game-help-content';
import { SHOCK_CONTENT } from '@/lib/game-content';

type BriefingTab = 'context' | 'rules' | 'goal' | 'glossary' | 'shocks';

type GameBriefingProps = {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
};

const TABS: Array<{ id: BriefingTab; label: string; icon: LucideIcon }> = [
  { id: 'context', label: 'Bối cảnh', icon: Map },
  { id: 'rules', label: 'Cách chơi', icon: BookOpen },
  { id: 'goal', label: 'Mục tiêu', icon: Target },
  { id: 'glossary', label: 'Thuật ngữ', icon: LibraryBig },
  { id: 'shocks', label: 'Biến cố', icon: ShieldAlert },
];

export default function GameBriefing({
  isOpen,
  onClose,
  onStartTour,
}: GameBriefingProps) {
  const [activeTab, setActiveTab] = useState<BriefingTab>('context');
  const [activeTerm, setActiveTerm] = useState<GlossaryKey>('rp');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const term = GLOSSARY[activeTerm];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-[#02080c]/80 p-3 backdrop-blur-sm md:items-center md:p-6"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-briefing-title"
        className="game-briefing-panel relative flex max-h-[min(46rem,calc(100dvh-2rem))] w-full max-w-4xl flex-col overflow-hidden border border-white/10 bg-[#0a171d] shadow-[0_28px_90px_rgb(0_0_0_/_0.5)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-5 border-b border-white/10 px-5 py-4 md:px-7">
          <div>
            <div className="flex items-center gap-2 text-[#3cc7bd]">
              <CircleHelp size={16} strokeWidth={1.5} />
              <span className="font-mono text-[10px] uppercase">Trợ lý nhiệm kỳ</span>
            </div>
            <h2 id="game-briefing-title" className="mt-1.5 font-display text-2xl font-semibold text-[#f2f7f7]">
              Đường đến 2030
            </h2>
          </div>
          <div className="game2-briefing-actions">
            <button
              type="button"
              onClick={onStartTour}
              className="game2-briefing-tour"
            >
              <PlayCircle size={15} /> Xem tour tương tác
            </button>
            <button type="button" onClick={onClose} className="game-icon-button" aria-label="Đóng hướng dẫn">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="game2-briefing-tabs">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`game-briefing-tab ${activeTab === id ? 'is-active' : ''}`}
              aria-pressed={activeTab === id}
            >
              <Icon size={15} strokeWidth={1.5} />{label}
            </button>
          ))}
        </div>

        <div className="game2-briefing-body">
          {activeTab === 'context' && (
            <div className="game-briefing-copy">
              <p className="game-overline">Năm 2025</p>
              <h3>Bạn là kiến trúc sư trưởng của một nhiệm kỳ công nghệ.</h3>
              <p>
                Đất nước bước vào chặng tăng tốc đến năm 2030. Bạn có bốn giai
                đoạn để biến công nghệ, vốn và tri thức bên ngoài thành năng lực
                sản xuất, con người và quyền làm chủ trong nước.
              </p>
              <p className="game-briefing-note">
                Đây là mô hình giáo dục giản lược để minh họa độ trễ, phụ thuộc
                đường dẫn và đánh đổi chính sách; không phải dự báo thực tế.
              </p>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="game-briefing-copy">
              <p className="game-overline">Mỗi chặng có hai quyết định liên kết</p>
              <ol className="game-rule-list">
                <li><span>01</span><p><strong>Xây năng lực:</strong> tự chia toàn bộ RP cho nhân lực, R&amp;D, hạ tầng và FDI. “Chia đều” chỉ là nút hỗ trợ.</p></li>
                <li><span>02</span><p><strong>Dùng năng lực:</strong> chọn một chiến lược A/B/C. Mọi người thấy cùng lựa chọn nhưng hậu quả phụ thuộc trạng thái riêng.</p></li>
                <li><span>03</span><p><strong>Đọc hậu quả:</strong> báo cáo công bố điểm vòng, delta chỉ số, nguyên nhân và di sản sang vòng sau.</p></li>
                <li><span>04</span><p><strong>Quản trị độ trễ:</strong> giáo dục phát huy sau một vòng; vay phải trả 120%; hai kỳ FDI lệch khỏi R&amp;D kích hoạt phạt.</p></li>
              </ol>
            </div>
          )}

          {activeTab === 'goal' && (
            <div className="game-briefing-copy">
              <p className="game-overline">Đích đến 2030</p>
              <h3>Không chỉ về đích nhanh. Phải về đích bằng nội lực.</h3>
              <p>
                Điểm cuối lấy năng suất trừ nợ chưa xử lý. Để đạt kết cục bứt phá,
                bạn cần ít nhất 120 điểm, tự chủ từ 18 và không chọn quyết định
                khóa trần phụ thuộc ở vòng cuối.
              </p>
              <div className="game2-goal-equation">
                <Gauge size={18} />
                <span>Điểm cuối</span>
                <strong>= Năng suất - Nợ chưa xử lý</strong>
              </div>
              <div className="game-outcome-key">
                <span className="text-[#3cc7bd]">Bứt phá bằng nội lực</span>
                <span className="text-[#e9a35a]">Về đích còn phụ thuộc</span>
                <span className="text-[#d78c55]">Đứt gãy quỹ đạo</span>
              </div>
            </div>
          )}

          {activeTab === 'glossary' && (
            <div className="game2-briefing-glossary">
              <div className="game2-glossary-index" aria-label="Danh sách thuật ngữ">
                {GLOSSARY_ORDER.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTerm(key)}
                    className={activeTerm === key ? 'is-active' : ''}
                  >
                    <span>{String(GLOSSARY_ORDER.indexOf(key) + 1).padStart(2, '0')}</span>
                    {GLOSSARY[key].label}
                  </button>
                ))}
              </div>
              <article className="game2-glossary-detail">
                <p className="game-overline">Tra cứu nhanh</p>
                <h3>{term.label}</h3>
                <strong>{term.short}</strong>
                <dl>
                  <div><dt>Là gì?</dt><dd>{term.definition}</dd></div>
                  <div><dt>Tăng bằng cách nào?</dt><dd>{term.increase}</dd></div>
                  <div><dt>Tác dụng</dt><dd>{term.benefit}</dd></div>
                  <div><dt>Cần tránh</dt><dd>{term.risk}</dd></div>
                </dl>
                <code>{term.formula}</code>
              </article>
            </div>
          )}

          {activeTab === 'shocks' && (
            <div className="game2-briefing-shocks">
              <header>
                <p className="game-overline">Một biến cố chung · vòng 2 hoặc 3</p>
                <h3>Phòng gặp cùng cú sốc; năng lực riêng quyết định thiệt hại.</h3>
              </header>
              <div>
                {SHOCK_GUIDE.map((shock, index) => (
                  <article key={shock.id}>
                    <span>0{index + 1}</span>
                    <div>
                      <small>{SHOCK_CONTENT[shock.id].title}</small>
                      <strong>{shock.shortTitle}</strong>
                      <p>{SHOCK_CONTENT[shock.id].briefing}</p>
                    </div>
                    <aside>
                      <small>Chỉ số bảo vệ</small>
                      <strong>{shock.defense}</strong>
                      <p>{shock.threshold}</p>
                    </aside>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
