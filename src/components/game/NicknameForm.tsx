'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, BookOpen, CircleUserRound, UsersRound } from 'lucide-react';
import { useGameStore } from '@/store/game-store';

type NicknameFormProps = {
  onOpenBriefing: () => void;
};

export default function NicknameForm({ onOpenBriefing }: NicknameFormProps) {
  const { nickname, className, setNickname, setClassName, startSession, isLoading } = useGameStore();
  const [touched, setTouched] = useState(false);
  const invalid = touched && !nickname.trim();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (nickname.trim()) startSession();
  };

  return (
    <section className="game-entry-scene">
      <div className="game-entry-layout">
        <div className="game-entry-copy">
          <p className="game-overline">Phiên mô phỏng cá nhân</p>
          <h1 className="game-entry-title">Đường đến <span>2030</span></h1>
          <p className="game-entry-summary">Bạn sẽ điều hành bốn chặng chính sách, từ năm 2025 đến hạn 2030. Mỗi quyết định tạo ra năng lực, khoản nợ và giới hạn mới cho chặng kế tiếp.</p>
          <div className="game-entry-facts">
            <div><span>01</span><p>4 giai đoạn chính sách</p></div>
            <div><span>02</span><p>1 mục tiêu CNH-HĐH</p></div>
            <div><span>03</span><p>Không có lượt phụ</p></div>
          </div>
          <p className="game-entry-note">Mô hình mô phỏng giáo dục giản lược hóa các cơ chế kinh tế: độ trễ đầu tư nhân lực, rủi ro phụ thuộc FDI, chi phí nợ công nghệ và tính phụ thuộc đường dẫn.</p>
        </div>

        <form onSubmit={submit} className="game-entry-form" noValidate>
          <div className="flex items-center gap-2 text-[#3cc7bd]"><CircleUserRound size={17} strokeWidth={1.5} /><span className="game-overline">Xác lập phiên</span></div>
          <div className="mt-6">
            <label htmlFor="game-nickname">Tên hiển thị</label>
            <input id="game-nickname" value={nickname} maxLength={20} onChange={(event) => setNickname(event.target.value)} onBlur={() => setTouched(true)} placeholder="Ví dụ: Minh" aria-invalid={invalid} />
            {invalid && <p className="game-input-error">Tên hiển thị là bắt buộc.</p>}
          </div>
          <div className="mt-4">
            <label htmlFor="game-class">Lớp / nhóm <span>(tùy chọn)</span></label>
            <div className="game-input-with-icon"><UsersRound size={16} /><input id="game-class" value={className} maxLength={32} onChange={(event) => setClassName(event.target.value)} placeholder="Ví dụ: SE18A01" /></div>
          </div>
          <button type="submit" disabled={isLoading} className="game-primary-action mt-7 w-full justify-center disabled:opacity-50">{isLoading ? 'Đang tạo phiên...' : 'Nhận nhiệm kỳ'} <ArrowRight size={17} /></button>
          <button type="button" onClick={onOpenBriefing} className="game-secondary-action mt-3 w-full justify-center"><BookOpen size={16} />Xem bối cảnh, luật và mục tiêu</button>
        </form>
      </div>
    </section>
  );
}
