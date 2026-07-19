'use client';

import { useRef } from 'react';
import { ArrowRight, Landmark, Network } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGameStore } from '@/store/game-store';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function GameIntro() {
  const rootRef = useRef<HTMLElement>(null);
  const startTerm = useGameStore((state) => state.startTerm);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion) return;
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.game-intro-kicker', { autoAlpha: 0, y: 16, duration: 0.45 })
      .from('.game-intro-line', { autoAlpha: 0, y: 20, duration: 0.58, stagger: 0.12 }, '-=0.05')
      .from('.game-intro-route', { autoAlpha: 0, scaleX: 0.5, transformOrigin: 'left', duration: 0.7 }, '-=0.2')
      .from('.game-intro-action', { autoAlpha: 0, y: 14, duration: 0.45 }, '-=0.22');
  }, { scope: rootRef, dependencies: [prefersReducedMotion] });

  return (
    <section ref={rootRef} className="game-intro-scene">
      <div className="game-intro-grid" aria-hidden="true" />
      <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
        <div>
          <div className="game-intro-kicker game-overline"><Landmark size={15} strokeWidth={1.5} />Mở nhiệm kỳ chính sách</div>
          <p className="game-intro-line mt-6 max-w-3xl font-display text-[clamp(2rem,4.4vw,4.9rem)] font-semibold leading-[1.03] text-[#f2f7f7]">Năm 2025. Đồng hồ đã bắt đầu chạy.</p>
          <p className="game-intro-line mt-6 max-w-2xl text-[0.97rem] leading-7 text-[#afc0c7]">Đến năm 2030, mục tiêu là cơ bản hoàn thành CNH-HĐH, trở thành nước công nghiệp hiện đại, thu nhập trung bình cao. Bạn có bốn giai đoạn để quyết định con đường đến đó.</p>
          <div className="game-intro-route mt-10"><span>2025</span><i /><span>2026</span><i /><span>2027</span><i /><span>2028</span><i /><strong>2030</strong></div>
          <button type="button" onClick={startTerm} className="game-intro-action game-primary-action mt-10">Bắt đầu nhiệm kỳ <ArrowRight size={17} /></button>
        </div>
        <div className="game-intro-side game-intro-line">
          <Network size={28} strokeWidth={1.3} />
          <p className="game-overline">Vai trò</p>
          <p className="font-display text-xl font-medium text-[#f2f7f7]">Kiến trúc sư trưởng Chính sách Công nghệ Quốc gia</p>
          <p>Không có đáp án tuyệt đối. Mỗi lựa chọn sẽ mở hoặc thu hẹp năng lực của chặng sau.</p>
        </div>
      </div>
      <p className="relative z-10 mt-14 max-w-3xl font-mono text-[10px] leading-5 tracking-[0.05em] text-[#718994]">Mô phỏng giáo dục đơn giản hóa dựa trên mục tiêu chính thức đã công bố; không nhằm dự báo hay đánh giá chính sách thực tế.</p>
    </section>
  );
}
