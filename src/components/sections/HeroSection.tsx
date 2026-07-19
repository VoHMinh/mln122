'use client';

import { useRef } from 'react';
import { ArrowDown, ScanLine } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import useReducedMotion from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current || prefersReducedMotion) return;

      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .from('.atlas-hero-intro', { autoAlpha: 0, y: 20, stagger: 0.1, duration: 0.65 })
        .from('.atlas-hero-diagram', { autoAlpha: 0, scale: 0.96, y: 18, duration: 0.9 }, '-=0.45')
        .fromTo(
          '.atlas-hero-path',
          { strokeDashoffset: 640 },
          { strokeDashoffset: 0, duration: 1.1, stagger: 0.08, ease: 'power2.inOut' },
          '-=0.55',
        )
        .from('.atlas-hero-node', { autoAlpha: 0, scale: 0.4, transformOrigin: 'center', stagger: 0.1, duration: 0.45 }, '-=0.65');

      gsap.to('.atlas-hero-grid', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.7,
        },
      });
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] },
  );

  return (
    <section id="hero" ref={sectionRef} className="atlas-hero relative z-10 overflow-hidden">
      <div className="atlas-hero-grid absolute inset-0" aria-hidden="true" />
      <div className="atlas-shell grid min-h-[100dvh] items-center gap-8 px-6 pb-14 pt-20 md:px-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:px-16 lg:pb-16">
        <div className="max-w-2xl">
          <div className="atlas-hero-intro atlas-eyebrow">
            <ScanLine size={14} strokeWidth={1.5} />
            Tiểu luận kinh tế chính trị
          </div>
          <p className="atlas-hero-intro mt-8 font-mono text-[11px] uppercase tracking-[0.17em] text-[#8ea5b1]">CNH-HĐH / CMCN 4.0 / Việt Nam</p>
          <h1 className="atlas-hero-intro mt-4 font-display text-[clamp(2.25rem,3.6vw,4rem)] font-semibold leading-[1.04] text-[#f5f8f9]">
            Đứt gãy công nghệ tác động thế nào đến CNH-HĐH ở Việt Nam?
          </h1>
          <p className="atlas-hero-intro mt-5 max-w-xl text-[0.95rem] leading-7 text-[#aebfc8] md:text-[1.05rem] md:leading-7">
            Câu chuyện không chỉ là tốc độ tiếp nhận AI hay tự động hóa. Vấn đề quyết định là khả năng biến công nghệ bên ngoài thành năng lực sản xuất, tri thức và thể chế của chính Việt Nam.
          </p>
          <div className="atlas-hero-intro atlas-question mt-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#e9a35a]">Luận điểm trung tâm</span>
            <p>Đứt gãy xuất hiện khi tốc độ tham gia chuỗi giá trị nhanh hơn tốc độ làm chủ công nghệ.</p>
          </div>
        </div>

        <div className="atlas-hero-diagram cursor-target relative" aria-label="Sơ đồ mối quan hệ giữa công nghệ, năng lực nội sinh và CNH-HĐH">
          <svg viewBox="0 0 640 420" className="block w-full" role="img">
            <defs>
              <linearGradient id="atlas-diagram-line" x1="0" x2="1">
                <stop stopColor="#3cc7bd" stopOpacity="0.15" />
                <stop offset="0.5" stopColor="#3cc7bd" />
                <stop offset="1" stopColor="#e9a35a" />
              </linearGradient>
              <filter id="atlas-node-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <g className="atlas-hero-diagram-lines" fill="none" stroke="url(#atlas-diagram-line)" strokeWidth="1.5" strokeDasharray="8 10">
              <path className="atlas-hero-path" d="M102 92 C204 92 226 192 322 210" />
              <path className="atlas-hero-path" d="M538 92 C436 92 415 192 322 210" />
              <path className="atlas-hero-path" d="M322 210 C256 278 252 326 148 344" />
              <path className="atlas-hero-path" d="M322 210 C388 278 413 326 502 344" />
            </g>
            <g className="atlas-hero-node">
              <circle cx="102" cy="92" r="43" fill="#0e2028" stroke="#3cc7bd" />
              <text x="102" y="88" textAnchor="middle" fill="#eaf4f5" fontSize="15" fontFamily="var(--font-mono)">CÔNG NGHỆ</text>
              <text x="102" y="107" textAnchor="middle" fill="#91aab2" fontSize="11" fontFamily="var(--font-mono)">MỚI</text>
            </g>
            <g className="atlas-hero-node">
              <circle cx="538" cy="92" r="43" fill="#0e2028" stroke="#3cc7bd" />
              <text x="538" y="87" textAnchor="middle" fill="#eaf4f5" fontSize="14" fontFamily="var(--font-mono)">HỘI NHẬP</text>
              <text x="538" y="106" textAnchor="middle" fill="#91aab2" fontSize="10" fontFamily="var(--font-mono)">CHUỖI GIÁ TRỊ</text>
            </g>
            <g className="atlas-hero-node" filter="url(#atlas-node-glow)">
              <circle cx="322" cy="210" r="86" fill="#10262c" stroke="#3cc7bd" strokeWidth="1.6" />
              <circle cx="322" cy="210" r="67" fill="none" stroke="#3cc7bd" strokeOpacity="0.38" strokeDasharray="3 7" />
              <text x="322" y="197" textAnchor="middle" fill="#f5f8f9" fontSize="20" fontFamily="var(--font-display)">NĂNG LỰC</text>
              <text x="322" y="222" textAnchor="middle" fill="#f5f8f9" fontSize="20" fontFamily="var(--font-display)">NỘI SINH</text>
              <text x="322" y="246" textAnchor="middle" fill="#91aab2" fontSize="11" fontFamily="var(--font-mono)">R&D · NHÂN LỰC</text>
              <text x="322" y="262" textAnchor="middle" fill="#91aab2" fontSize="11" fontFamily="var(--font-mono)">THỂ CHẾ DỮ LIỆU</text>
            </g>
            <g className="atlas-hero-node">
              <circle cx="148" cy="344" r="48" fill="#141a1e" stroke="#e9a35a" />
              <text x="148" y="339" textAnchor="middle" fill="#f5f8f9" fontSize="13" fontFamily="var(--font-mono)">ĐỨT GÃY</text>
              <text x="148" y="358" textAnchor="middle" fill="#aa9090" fontSize="10" fontFamily="var(--font-mono)">LỆCH PHA</text>
            </g>
            <g className="atlas-hero-node">
              <circle cx="502" cy="344" r="48" fill="#10262c" stroke="#3cc7bd" />
              <text x="502" y="339" textAnchor="middle" fill="#f5f8f9" fontSize="13" fontFamily="var(--font-mono)">CNH-HĐH</text>
              <text x="502" y="358" textAnchor="middle" fill="#91aab2" fontSize="10" fontFamily="var(--font-mono)">BỀN VỮNG</text>
            </g>
          </svg>
          <div className="atlas-diagram-caption">
            <span className="atlas-diagram-caption-label">Khung phân tích</span>
            <span className="atlas-diagram-caption-flow">Công nghệ → Năng lực nội sinh → CNH-HĐH bền vững</span>
          </div>
        </div>
      </div>

      <div className="atlas-hero-footer">
        <div><span>01</span><p>Bối cảnh lịch sử</p></div>
        <div><span>02</span><p>Điểm đứt gãy hiện nay</p></div>
        <div><span>03</span><p>Tác động và hướng thu hẹp</p></div>
        <ArrowDown size={16} className="text-signal-cyan" />
      </div>
    </section>
  );
}
