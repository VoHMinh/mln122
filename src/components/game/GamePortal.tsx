'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  DoorOpen,
  LoaderCircle,
  Minus,
  Plus,
  Radio,
  UsersRound,
} from 'lucide-react';
import { getGameGateway } from '@/lib/game-gateway';
import { useRoomStore } from '@/store/room-store';
import type { RoomPreview } from '@/types';
import useHydrated from '@/hooks/useHydrated';

export type PortalAccessRequest =
  | {
      mode: 'CREATE';
      roomName: string;
      groupNames: string[];
      nickname: string;
      groupName: string;
    }
  | {
      mode: 'JOIN';
      code: string;
      nickname: string;
      groupName: string;
    };

type Props = {
  onOpenBriefing: () => void;
  onBeginOnboarding: (request: PortalAccessRequest) => Promise<void>;
};

export default function GamePortal({ onOpenBriefing, onBeginOnboarding }: Props) {
  const hydrated = useHydrated();
  const [mode, setMode] = useState<'CREATE' | 'JOIN'>('CREATE');
  const [roomName, setRoomName] = useState('');
  const [groupCount, setGroupCount] = useState(6);
  const [nickname, setNickname] = useState('');
  const [groupName, setGroupName] = useState('Nhóm 1');
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState<RoomPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [compactAccess, setCompactAccess] = useState(false);
  const { isLoading, error, clearError } = useRoomStore();
  const groupNames = useMemo(
    () => Array.from({ length: groupCount }, (_, index) => `Nhóm ${index + 1}`),
    [groupCount],
  );

  useEffect(() => {
    if (mode !== 'JOIN' || code.trim().length !== 6) {
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const next = await getGameGateway().getRoomPreview(code.trim().toUpperCase());
        if (cancelled) return;
        if (next.status !== 'WAITING') {
          setPreview(null);
          setPreviewError('Phòng đã bắt đầu hoặc đã kết thúc.');
          return;
        }
        setPreview(next);
        setGroupName(next.groupNames[0] ?? '');
        setPreviewError(null);
      } catch (caught) {
        if (cancelled) return;
        setPreview(null);
        setPreviewError(caught instanceof Error ? caught.message : 'Không thể kiểm tra mã phòng.');
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    }, 320);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [code, mode]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    clearError();
    const cleanNickname = nickname.trim();
    if (!cleanNickname) {
      setValidationError('Hãy nhập tên hiển thị trước khi tiếp tục.');
      return;
    }

    if (mode === 'CREATE') {
      if (!roomName.trim()) {
        setValidationError('Hãy nhập tên phòng trước khi tiếp tục.');
        return;
      }
      setValidationError(null);
      await onBeginOnboarding({
        mode,
        roomName: roomName.trim(),
        groupNames,
        nickname: cleanNickname,
        groupName,
      });
      return;
    }

    if (!preview) {
      setValidationError('Hãy nhập đúng mã phòng và chờ hệ thống xác nhận.');
      return;
    }
    if (!groupName) {
      setValidationError('Hãy chọn nhóm trước khi vào phòng.');
      return;
    }
    setValidationError(null);
    await onBeginOnboarding({
      mode,
      code: preview.roomCode,
      nickname: cleanNickname,
      groupName,
    });
  };

  const changeMode = (nextMode: 'CREATE' | 'JOIN') => {
    setMode(nextMode);
    setPreview(null);
    setPreviewLoading(false);
    setValidationError(null);
    setPreviewError(null);
    setGroupName(nextMode === 'CREATE' ? groupNames[0] : '');
    clearError();
  };

  const changeGroupCount = (nextCount: number) => {
    const clampedCount = Math.min(12, Math.max(1, nextCount));
    setGroupCount(clampedCount);
    const nextGroups = Array.from(
      { length: clampedCount },
      (_, index) => `Nhóm ${index + 1}`,
    );
    if (!nextGroups.includes(groupName)) {
      setGroupName(nextGroups[0]);
    }
  };

  const changeRoomCode = (value: string) => {
    setCode(value.toUpperCase());
    setPreview(null);
    setPreviewError(null);
    setGroupName('');
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
          Mỗi người ra quyết định và nhận kết quả riêng. Cuối phiên, người cao điểm
          nhất của từng nhóm sẽ đại diện nhóm để so hạng.
        </p>
        <div className="game2-facts" aria-label="Tóm tắt trò chơi">
          <div><strong>04</strong><span>giai đoạn chính sách</span></div>
          <div><strong>01</strong><span>bảng giải theo nhóm</span></div>
          <div><strong>01</strong><span>lịch sử cá nhân</span></div>
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
            onClick={() => changeMode('CREATE')}
          >
            <Plus size={15} /> Tạo phòng
          </button>
          <button
            type="button"
            className={mode === 'JOIN' ? 'is-active' : ''}
            onClick={() => changeMode('JOIN')}
          >
            <DoorOpen size={15} /> Vào phòng
          </button>
        </div>

        <div className="game2-access-heading">
          <UsersRound size={18} />
          <div>
            <p className="game-overline">
              {mode === 'CREATE' ? 'Khởi tạo phiên chơi' : 'Xác lập người chơi'}
            </p>
            <h2>{mode === 'CREATE' ? 'Mở một phòng mới' : 'Tham gia bằng mã phòng'}</h2>
          </div>
        </div>

        {mode === 'CREATE' ? (
          <>
            <label>
              <span>Tên phòng</span>
              <input
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
                maxLength={48}
                placeholder="Ví dụ: Đường đến 2030 - Ca sáng"
                autoComplete="off"
              />
            </label>

            <div className="game2-group-stepper">
              <div>
                <span>Số nhóm thi đấu</span>
                <small>
                  Tạo Nhóm 1 đến Nhóm {groupCount}. Cuối buổi, người cao điểm nhất
                  mỗi nhóm sẽ đại diện nhóm để so hạng.
                </small>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => changeGroupCount(groupCount - 1)}
                  disabled={groupCount <= 1}
                  aria-label="Giảm số nhóm"
                >
                  <Minus size={14} />
                </button>
                <strong>{groupCount}</strong>
                <button
                  type="button"
                  onClick={() => changeGroupCount(groupCount + 1)}
                  disabled={groupCount >= 12}
                  aria-label="Tăng số nhóm"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <label>
              <span>Mã phòng</span>
              <div className="game2-code-input">
                <input
                  value={code}
                  onChange={(event) => changeRoomCode(event.target.value)}
                  maxLength={6}
                  placeholder="A4K9Q2"
                  autoComplete="off"
                />
                {previewLoading && <LoaderCircle className="animate-spin" size={16} />}
              </div>
            </label>
            {previewError && (
              <p className="game2-code-status is-error" role="alert">
                {previewError}
              </p>
            )}
            {!previewError && code.length > 0 && code.length < 6 && (
              <p className="game2-code-status">
                Mã phòng gồm đúng 6 ký tự.
              </p>
            )}
            {preview && (
              <div className="game2-room-preview" role="status">
                <div>
                  <strong>{preview.roomName}</strong>
                </div>
                <small>
                  {preview.participantCount} người · {preview.groupNames.length} nhóm
                </small>
              </div>
            )}
          </>
        )}

        <div className="game2-access-pair">
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
          <div className="game2-field">
            <label htmlFor="game-group-select">
              <span>Nhóm</span>
            </label>
            <select
              id="game-group-select"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              disabled={mode === 'JOIN' && !preview}
              aria-describedby={mode === 'JOIN' && !preview ? 'game-group-help' : undefined}
            >
              {mode === 'JOIN' && !preview && (
                <option value="">
                  {previewLoading
                    ? 'Đang tải nhóm...'
                    : code.trim().length === 6
                      ? 'Mã chưa hợp lệ'
                      : 'Chờ mã phòng'}
                </option>
              )}
              {(mode === 'CREATE' ? groupNames : preview?.groupNames ?? []).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            {mode === 'JOIN' && !preview && (
              <small id="game-group-help" className="game2-field-help">
                Danh sách nhóm sẽ hiện ngay khi mã phòng hợp lệ.
              </small>
            )}
          </div>
        </div>

        {(validationError || error) && (
          <p className="game2-form-error">{validationError ?? error}</p>
        )}

        <button
          type="submit"
          disabled={
            !hydrated ||
            isLoading ||
            previewLoading ||
            (mode === 'JOIN' && !preview)
          }
          className="game-primary-action game-cursor-target"
        >
          {!hydrated
            ? 'Đang khởi tạo...'
            : isLoading
              ? 'Đang kết nối...'
              : mode === 'CREATE'
                ? 'Tạo phòng và xem hướng dẫn'
                : 'Vào phòng và xem hướng dẫn'}
          <ArrowRight size={17} />
        </button>
      </form>
    </section>
  );
}
