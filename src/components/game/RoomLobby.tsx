'use client';

import { Check, Copy, Play, Radio, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { useRoomStore } from '@/store/room-store';

export default function RoomLobby() {
  const [copied, setCopied] = useState(false);
  const { room, role, startRoom, isLoading } = useRoomStore();
  if (!room) return null;

  const copyCode = async () => {
    await navigator.clipboard.writeText(room.roomCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section className="game2-lobby">
      <header>
        <p className="game-overline"><Radio size={14} /> Phòng đang chờ</p>
        <h1>Tập hợp đội ngũ trước nhiệm kỳ.</h1>
        <p>
          Khi chủ phòng bắt đầu, mọi người nhận cùng một hạn 10 phút và cùng một
          biến cố nền. Mỗi người vẫn tự đi theo quỹ đạo quyết định của mình.
        </p>
      </header>

      <div className="game2-lobby-layout">
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

        <div className="game2-participants">
          <div className="game2-section-heading">
            <UsersRound size={17} />
            <div>
              <span>Người tham gia</span>
              <strong>{room.participants.length}</strong>
            </div>
          </div>
          <ul>
            {room.participants.map((participant, index) => (
              <li key={participant.sessionId}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{participant.nickname}</strong>
                  <small>{participant.className || 'Không khai báo lớp'}</small>
                </div>
                <i>Đã sẵn sàng</i>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="game2-lobby-footer">
        <p>
          {role === 'HOST'
            ? 'Bạn là chủ phòng. Bắt đầu khi danh sách đã sẵn sàng.'
            : 'Đã kết nối. Đang chờ chủ phòng mở nhiệm kỳ.'}
        </p>
        {role === 'HOST' && (
          <button
            type="button"
            disabled={isLoading || room.participants.length === 0}
            onClick={startRoom}
            className="game-primary-action game-cursor-target"
          >
            <Play size={16} /> Bắt đầu phòng
          </button>
        )}
      </footer>
    </section>
  );
}

