'use client';

import Link from 'next/link';
import { ArrowRight, Gamepad2 } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';

export default function GameCTASection() {
  return (
    <section
      id="cta"
      className="relative z-10 flex w-full flex-col justify-center border-b border-muted-steel/10 bg-background-midnight px-6 py-28 md:px-12"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionReveal>
          <div className="cursor-target relative flex w-full flex-col items-start justify-between gap-10 overflow-hidden border border-signal-cyan/35 bg-circuit-surface/30 p-8 shadow-[0_0_50px_rgba(54,181,192,0.05)] backdrop-blur-xl md:flex-row md:items-center md:p-12">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_70%_50%,rgba(54,181,192,0.16),transparent_48%)]" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 border border-signal-cyan/40 bg-deep-circuit/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-signal-cyan">
                <Gamepad2 size={13} />
                Mô phỏng chính sách
              </div>

              <h2 className="font-display text-2xl font-extrabold leading-tight text-pulse-text md:text-4xl">
                Nếu là người hoạch định chính sách, bạn phân bổ nguồn lực thế nào?
              </h2>

              <p className="font-body text-sm leading-7 text-muted-steel md:text-base">
                Trò chơi giúp người xem thử cân bằng bốn lựa chọn: R&D, giáo dục,
                hạ tầng và FDI. Mục tiêu không phải thắng cho vui, mà là thấy vì sao
                đầu tư ngắn hạn và năng lực công nghệ dài hạn luôn kéo nhau.
              </p>
            </div>

            <Link
              href="/game"
              className="relative z-10 inline-flex items-center gap-3 border border-signal-cyan px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-signal-cyan transition-all duration-300 hover:bg-signal-cyan hover:text-deep-circuit"
            >
              <span>Vào mô phỏng</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
