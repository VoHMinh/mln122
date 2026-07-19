'use client';

import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  DoorOpen,
  Plus,
  Radio,
  UsersRound,
} from 'lucide-react';
import { useRoomStore } from '@/store/room-store';
import useHydrated from '@/hooks/useHydrated';

export type PortalAccessRequest = {
  mode: 'CREATE' | 'JOIN';
  nickname: string;
  className: string;
  code: string;
};

type Props = {
  onOpenBriefing: () => void;
  onBeginOnboarding: (request: PortalAccessRequest) => void;
};

export default function GamePortal({ onOpenBriefing, onBeginOnboarding }: Props) {
  const hydrated = useHydrated();
  const [mode, setMode] = useState<'CREATE' | 'JOIN'>('CREATE');
  const [nickname, setNickname] = useState('');
  const [className, setClassName] = useState('');
  const [code, setCode] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [compactAccess, setCompactAccess] = useState(false);
  const { isLoading, error, clearError } = useRoomStore();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    clearError();
    const cleanNickname = nickname.trim();
    const cleanClassName = className.trim();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanNickname) {
      setValidationError('Hãy nhập tên hiển thị trước khi tiếp tục.');
      return;
    }
    if (mode === 'JOIN' && cleanCode.length !== 6) {
      setValidationError('Mã phòng phải gồm đúng 6 ký tự.');
      return;
    }
    setValidationError(null);
    onBeginOnboarding({
      mode,
      nickname: cleanNickname,
      className: cleanClassName,
      code: cleanCode,
    });
  };

  return (
    <section className={`game2-portal ${compactAccess ? 'is-access-focused' : ''}`}>
      <div className="game2-portal-copy">
        <p className="game-overline">
          <Radio size={14} /> Mô phỏng chính sách realtime
        </p>
        <h1>
          Đường đến <span>2030</span>
        </h1>
        <p className="game2-lead">
          Bốn giai đoạn. Một hạn chót. Mỗi quyết định để lại năng lực, khoản nợ
          và giới hạn cho chặng kế tiếp.
        </p>
        <div className="game2-facts" aria-label="Tóm tắt trò chơi">
          <div><strong>04</strong><span>giai đoạn chính sách</span></div>
          <div><strong>10&apos;</strong><span>cùng một hạn phòng</span></div>
          <div><strong>01</strong><span>mục tiêu CNH-HĐH</span></div>
        </div>
        <button type="button" className="game2-text-action" onClick={onOpenBriefing}>
          <BookOpen size={16} /> Xem bối cảnh, luật và mục tiêu
        </button>
      </div>

      <form
        className="game2-access"
        onSubmit={submit}
        onFocusCapture={(event) => {
          if (event.target instanceof HTMLInputElement) setCompactAccess(true);
        }}
        noValidate
      >
        <div className="game2-segmented" aria-label="Chọn cách vào trò chơi">
          <button
            type="button"
            className={mode === 'CREATE' ? 'is-active' : ''}
            onClick={() => setMode('CREATE')}
          >
            <Plus size={15} /> Tạo phòng
          </button>
          <button
            type="button"
            className={mode === 'JOIN' ? 'is-active' : ''}
            onClick={() => setMode('JOIN')}
          >
            <DoorOpen size={15} /> Vào phòng
          </button>
        </div>

        <div className="game2-access-heading">
          <UsersRound size={18} />
          <div>
            <p className="game-overline">
              {mode === 'CREATE' ? 'Khởi tạo phiên lớp học' : 'Xác lập người chơi'}
            </p>
            <h2>{mode === 'CREATE' ? 'Mở một phòng mới' : 'Tham gia bằng mã phòng'}</h2>
          </div>
        </div>

        {mode === 'JOIN' && (
          <label>
            <span>Mã phòng</span>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              maxLength={6}
              placeholder="A4K9Q2"
              autoComplete="off"
            />
          </label>
        )}
        <label>
          <span>Tên hiển thị</span>
          <input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            maxLength={24}
            placeholder="Ví dụ: Minh"
            autoComplete="name"
          />
        </label>
        <label>
          <span>Lớp / nhóm <small>(tùy chọn)</small></span>
          <input
            value={className}
            onChange={(event) => setClassName(event.target.value)}
            maxLength={24}
            placeholder="Ví dụ: SE18A01"
          />
        </label>

        {(validationError || error) && (
          <p className="game2-form-error">{validationError ?? error}</p>
        )}

        <button
          type="submit"
          disabled={!hydrated || isLoading}
          className="game-primary-action game-cursor-target"
        >
          {!hydrated
            ? 'Đang khởi tạo...'
            : isLoading
            ? 'Đang kết nối...'
            : mode === 'CREATE'
              ? 'Tạo phòng và tham gia'
              : 'Vào phòng'}
          <ArrowRight size={17} />
        </button>
      </form>
    </section>
  );
}
