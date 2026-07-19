'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, MessageSquare } from 'lucide-react';
import useReducedMotion from '@/hooks/useReducedMotion';
import { CONCLUSION_QUOTE, SOURCES } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

export default function ConclusionSection() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.from('.conclusion-line', {
        opacity: 0,
        y: 38,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        },
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] },
  );

  return (
    <section
      id="conclusion"
      ref={containerRef}
      className="relative z-10 flex w-full flex-col bg-deep-circuit px-6 pb-12 pt-32 md:px-12"
    >
      <div className="mx-auto mb-28 flex w-full max-w-4xl flex-grow flex-col justify-center text-center">
        <p className="conclusion-line headline-xl leading-tight text-pulse-text">
          {CONCLUSION_QUOTE}
        </p>
        <p className="conclusion-line mx-auto mt-8 max-w-3xl text-lg leading-8 text-muted-steel md:text-xl">
          Việt Nam có tín hiệu bắt nhịp đáng kể qua GII 2025, nhưng CNH-HĐH trong
          kỷ nguyên CMCN 4.0 chỉ bền vững khi khoảng cách R&D, nhân lực nghiên cứu
          và thể chế dữ liệu được thu hẹp bằng hành động đo được.
        </p>

        <div className="conclusion-line mt-14 flex justify-center">
          <button className="cursor-target inline-flex items-center gap-3 border border-copper-trace bg-copper-trace px-7 py-4 font-display text-base font-bold text-deep-circuit transition-colors hover:bg-white">
            <MessageSquare size={22} />
            <span>Mời thảo luận và phản biện</span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-auto w-full max-w-7xl border-t border-muted-steel/20 pt-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h4 className="mb-5 font-display text-sm uppercase tracking-[0.12em] text-muted-steel">
              Nguồn tham khảo chính
            </h4>
            <ul className="space-y-3">
              {SOURCES.map((source) => (
                <li key={source.id}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-2 text-sm leading-6 text-muted-steel/85 transition-colors hover:text-pulse-text"
                  >
                    <ArrowUpRight size={16} className="mt-1 shrink-0" />
                    <span>
                      {source.author}: {source.title} ({source.year})
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between md:text-right">
            <div>
              <h4 className="mb-5 font-display text-sm uppercase tracking-[0.12em] text-muted-steel">
                Ghi chú học thuật
              </h4>
              <p className="text-sm leading-7 text-muted-steel/85 md:ml-auto md:max-w-md">
                Số liệu trong bài ưu tiên nguồn WIPO, World Bank và văn bản chính sách
                chính thức. Các nhận định được trình bày như phân tích, không thay thế
                kết luận chính sách chính thức.
              </p>
            </div>

            <div className="mt-8 text-xs text-muted-steel/50">
              2026 - Đứt gãy công nghệ và CNH-HĐH ở Việt Nam
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
