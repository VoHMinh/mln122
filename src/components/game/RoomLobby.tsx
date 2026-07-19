'use client';

import {
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Play,
  Radio,
  ShieldAlert,
  UsersRound,
  X,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useRoomStore } from '@/store/room-store';
import type { RoomParticipant } from '@/types';

function isReady(participant: RoomParticipant) {
  return participant.readiness !== 'ONBOARDING';
}

export default function RoomLobby() {
  const [copied, setCopied] = useState(false);
  const [confirmStart, setConfirmStart] = useState(false);
  const { room, role, startRoom, isLoading } = useRoomStore();
  if (!room) return null;

  const readyCount = room.participants.filter(isReady).length;
  const pendingCount = room.participants.length - readyCount;
  const groups = room.groupNames.map((groupName) => ({
    groupName,
    members: room.participants.filter((participant) => participant.groupName === groupName),
  }));

  const copyCode = async () => {
    await navigator.clipboard.writeText(room.roomCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const requestStart = () => {
    if (pendingCount > 0) {
      setConfirmStart(true);
      return;
    }
    void startRoom();
  };

  return (
    <section className="game2-lobby">
      <header className="game2-lobby-heading">
        <div>
          <p className="game-overline"><Radio size={14} /> Phòng đang chờ</p>
          <h1>{room.roomName}</h1>
          <p>Mỗi thành viên có quỹ đạo riêng; nhóm chỉ dùng để tổng hợp và trao giải cuối buổi.</p>
        </div>
        <div className="game2-ready-summary">
          <span>Sẵn sàng</span>
          <strong>{readyCount}/{room.participants.length}</strong>
          <i style={{ '--ready-progress': `${room.participants.length ? readyCount / room.participants.length * 100 : 0}%` } as CSSProperties} />
        </div>
      </header>

      <div className="game2-lobby-layout">
        <aside className="game2-room-identity">
          <div className="game2-room-code">
            <span>Mã phòng</span>
            <strong>{room.roomCode}</strong>
            <button
              type="button"
              className="game2-icon-command game-cursor-target"
              onClick={copyCode}
              title="Sao chép mã phòng"
              aria-label="Sao chép mã phòng"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <small>{copied ? 'Đã sao chép' : 'Chia sẻ mã này cho người chơi'}</small>
          </div>

          <div className="game2-readiness-legend">
            <div><Clock3 size={15} /><span>Đang hướng dẫn</span><strong>{pendingCount}</strong></div>
            <div><CheckCircle2 size={15} /><span>Đã sẵn sàng</span><strong>{readyCount}</strong></div>
            <p>Đồng hồ 10 phút chỉ bắt đầu khi chủ phòng mở phiên.</p>
          </div>
        </aside>

        <div className="game2-group-roster">
          <div className="game2-section-heading">
            <UsersRound size={17} />
            <div>
              <span>Danh sách theo nhóm</span>
              <strong>{room.participants.length} thành viên · {room.groupNames.length} nhóm</strong>
            </div>
          </div>

          <div className="game2-group-list">
            {groups.map((group) => (
              <article key={group.groupName}>
                <header>
                  <strong>{group.groupName}</strong>
                  <span>{group.members.length} người</span>
                </header>
                {group.members.length > 0 ? (
                  <ul>
                    {group.members.map((participant) => (
                      <li key={participant.sessionId}>
                        <span aria-hidden="true">
                          {participant.nickname.slice(0, 1).toLocaleUpperCase('vi')}
                        </span>
                        <strong>{participant.nickname}</strong>
                        <i className={isReady(participant) ? 'is-ready' : 'is-onboarding'}>
                          {isReady(participant) ? 'Sẵn sàng' : 'Đang hướng dẫn'}
                        </i>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Chưa có thành viên</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>

      <footer className="game2-lobby-footer">
        <p>
          {role === 'HOST'
            ? pendingCount > 0
              ? `Còn ${pendingCount} người đang xem hướng dẫn. Bạn vẫn có thể bắt đầu sớm sau khi xác nhận.`
              : 'Toàn bộ thành viên đã sẵn sàng. Có thể bắt đầu phiên.'
            : 'Bạn đã sẵn sàng. Đang chờ chủ phòng mở nhiệm kỳ.'}
        </p>
        {role === 'HOST' && (
          <button
            type="button"
            disabled={isLoading || room.participants.length === 0}
            onClick={requestStart}
            className="game-primary-action game-cursor-target"
          >
            <Play size={16} /> {pendingCount > 0 ? `Kiểm tra ${pendingCount} người chưa sẵn sàng` : 'Bắt đầu phòng'}
          </button>
        )}
      </footer>

      {confirmStart && (
        <div className="game2-start-confirm" role="presentation" onMouseDown={() => setConfirmStart(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="start-confirm-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <ShieldAlert size={20} />
              <div>
                <span>Xác nhận bắt đầu sớm</span>
                <h2 id="start-confirm-title">Còn {pendingCount} người chưa sẵn sàng.</h2>
              </div>
              <button type="button" onClick={() => setConfirmStart(false)} aria-label="Đóng xác nhận">
                <X size={16} />
              </button>
            </header>
            <p>
              Những người này vẫn có thể hoàn tất hướng dẫn và vào phiên sau khi đồng hồ đã chạy,
              nhưng họ sẽ có ít thời gian ra quyết định hơn.
            </p>
            <div>
              <button type="button" className="game-secondary-action" onClick={() => setConfirmStart(false)}>
                Tiếp tục chờ
              </button>
              <button
                type="button"
                className="game-primary-action game-cursor-target"
                onClick={() => {
                  setConfirmStart(false);
                  void startRoom(true);
                }}
              >
                <Play size={15} /> Bắt đầu với {readyCount} người
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
