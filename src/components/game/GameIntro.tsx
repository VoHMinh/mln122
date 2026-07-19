'use client';

import { ArrowRight, Flag, Landmark, Route, TimerReset } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGameStore } from '@/store/game-store';
import { useRoomStore } from '@/store/room-store';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function GameIntro() {
  const rootRef = useRef<HTMLElement>(null);
  const startTerm = useGameStore((state) => state.startTerm);
  const session = useGameStore((state) => state.session);
  const room = useRoomStore((state) => state.room);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion) return;
    gsap.timeline()
      .from('.game2-intro-mark', { autoAlpha: 0, scale: 0.75, duration: 0.4 })
      .from('.game2-intro-copy > *', {
        autoAlpha: 0,
        y: 18,
        duration: 0.45,
        stagger: 0.08,
      }, '-=0.12')
      .from('.game2-intro-route i', {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 0.5,
        stagger: 0.08,
      }, '-=0.18');
  }, { scope: rootRef, dependencies: [reducedMotion] });

  return (
    <section ref={rootRef} className="game2-intro">
      <div className="game2-intro-mark" aria-hidden="true"><Flag size={42} /></div>
      <div className="game2-intro-copy">
        <p className="game-overline"><Landmark size={14} /> Mở nhiệm kỳ chính sách</p>
        <span>{session?.nickname} · {session?.groupName} · {room?.roomName}</span>
        <h1>Năm 2025. Đồng hồ đã bắt đầu chạy.</h1>
        <p>
          Bạn có bốn giai đoạn để đưa năng suất tiến lên mà không đánh đổi quyền
          làm chủ công nghệ. Quyết định sớm sẽ thay đổi nguồn lực và giới hạn của
          những chặng sau.
        </p>
        <div className="game2-intro-route">
          <span>2025</span><i /><span>2026</span><i /><span>2027</span>
          <i /><span>2028</span><i /><strong>2030</strong>
        </div>
        <div className="game2-intro-notes">
          <div><Route size={16} /><span>Phụ thuộc đường dẫn</span></div>
          <div><TimerReset size={16} /><span>Không có lượt phụ</span></div>
        </div>
        <button
          type="button"
          onClick={startTerm}
          className="game-primary-action game-cursor-target"
        >
          Bắt đầu giai đoạn 1 <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}
