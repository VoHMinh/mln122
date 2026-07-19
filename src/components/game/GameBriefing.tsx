'use client';

import { useEffect, useState } from 'react';
import { BookOpen, CircleHelp, Map, Target, X, type LucideIcon } from 'lucide-react';

type BriefingTab = 'context' | 'rules' | 'goal';

type GameBriefingProps = {
  isOpen: boolean;
  onClose: () => void;
};

const TABS: Array<{ id: BriefingTab; label: string; icon: LucideIcon }> = [
  { id: 'context', label: 'Bối cảnh', icon: Map },
  { id: 'rules', label: 'Cách chơi', icon: BookOpen },
  { id: 'goal', label: 'Mục tiêu', icon: Target },
];

export default function GameBriefing({ isOpen, onClose }: GameBriefingProps) {
  const [activeTab, setActiveTab] = useState<BriefingTab>('context');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-[#02080c]/80 p-3 backdrop-blur-sm md:items-center md:p-6" role="presentation" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-briefing-title"
        className="game-briefing-panel relative w-full max-w-3xl overflow-hidden border border-white/10 bg-[#0a171d] shadow-[0_28px_90px_rgb(0_0_0_/_0.5)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-5 border-b border-white/10 px-5 py-5 md:px-8">
          <div>
            <div className="flex items-center gap-2 text-[#3cc7bd]"><CircleHelp size={16} strokeWidth={1.5} /><span className="font-mono text-[10px] uppercase tracking-[0.16em]">Trợ lý nhiệm kỳ</span></div>
            <h2 id="game-briefing-title" className="mt-2 font-display text-2xl font-semibold text-[#f2f7f7]">Đường đến 2030</h2>
          </div>
          <button type="button" onClick={onClose} className="game-icon-button" aria-label="Đóng hướng dẫn"><X size={18} /></button>
        </div>

        <div className="grid border-b border-white/10 sm:grid-cols-3">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`game-briefing-tab ${activeTab === id ? 'is-active' : ''}`}
              aria-pressed={activeTab === id}
            >
              <Icon size={16} strokeWidth={1.5} />{label}
            </button>
          ))}
        </div>

        <div className="min-h-[19rem] px-5 py-6 md:px-8 md:py-8">
          {activeTab === 'context' && (
            <div className="game-briefing-copy">
              <p className="game-overline">Năm 2025</p>
              <h3>Bạn là Kiến trúc sư trưởng Chính sách Công nghệ Quốc gia.</h3>
              <p>Đất nước bước vào chặng tăng tốc đến năm 2030, mốc đặt ra trong mục tiêu CNH-HĐH. Bạn có bốn giai đoạn để biến công nghệ bên ngoài thành năng lực sản xuất, tri thức và thể chế trong nước.</p>
              <p className="game-briefing-note">Mô phỏng này giản lược hóa cơ chế kinh tế để phục vụ học tập, không phải dự báo hay đánh giá chính sách thực tế.</p>
            </div>
          )}
          {activeTab === 'rules' && (
            <div className="game-briefing-copy">
              <p className="game-overline">Bốn chặng, hai quyết định mỗi chặng</p>
              <ol className="game-rule-list">
                <li><span>01</span><p>Phân bổ toàn bộ nguồn lực hiện có cho nhân lực, R&D, hạ tầng và FDI.</p></li>
                <li><span>02</span><p>Chọn một phản ứng trước sự kiện chính sách của giai đoạn.</p></li>
                <li><span>03</span><p>Nhân lực có độ trễ một chặng; R&D cộng dồn vào chỉ số tự chủ.</p></li>
                <li><span>04</span><p>Bạn có thể vay tối đa 50 RP, nhưng nợ làm giảm nguồn lực chặng sau và trừ ở kết cục.</p></li>
              </ol>
            </div>
          )}
          {activeTab === 'goal' && (
            <div className="game-briefing-copy">
              <p className="game-overline">Đích đến 2030</p>
              <h3>Không chỉ về đích nhanh. Phải về đích bằng nội lực.</h3>
              <p>Kết cục dựa trên năng suất tích lũy sau bốn giai đoạn và Chỉ số Tự chủ. Năng suất cao nhưng tự chủ thấp vẫn là một nền kinh tế phụ thuộc công nghệ.</p>
              <div className="game-outcome-key"><span className="text-[#3cc7bd]">Đạt bằng nội lực</span><span className="text-[#e9a35a]">Về đích chưa tự chủ</span><span className="text-[#d78c55]">Trễ hẹn 2030</span></div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
