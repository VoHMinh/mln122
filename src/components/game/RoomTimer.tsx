'use client';

import { Clock3 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { useRoomStore } from '@/store/room-store';

function remainingSeconds(endsAt: string | null) {
  if (!endsAt) return 0;
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 1000));
}

export default function RoomTimer() {
  const { room, syncRoom } = useRoomStore();
  const handleRoomEnded = useGameStore((state) => state.handleRoomEnded);
  const [seconds, setSeconds] = useState(() => remainingSeconds(room?.endsAt ?? null));

  useEffect(() => {
    if (!room?.endsAt || room.status !== 'IN_PROGRESS') return;
    const update = () => {
      const next = remainingSeconds(room.endsAt);
      setSeconds(next);
      if (next === 0) {
        window.clearInterval(timer);
        void syncRoom().finally(handleRoomEnded);
      }
    };
    const initial = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [handleRoomEnded, room?.endsAt, room?.status, syncRoom]);

  const label = useMemo(() => {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
  }, [seconds]);

  if (!room || room.status !== 'IN_PROGRESS') return null;
  return (
    <div className={`game2-timer ${seconds <= 60 ? 'is-critical' : ''}`}>
      <Clock3 size={15} />
      <span>Còn lại</span>
      <strong>{label}</strong>
    </div>
  );
}
