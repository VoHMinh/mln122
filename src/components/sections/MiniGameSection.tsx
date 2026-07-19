'use client';

import SectionReveal from '@/components/ui/SectionReveal';
import GameContainer from '@/components/game/GameContainer';

export default function MiniGameSection() {
  return (
    <section
      id="mini-game"
      className="relative w-full bg-circuit-surface"
    >
      {/* Top divider gradient */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-copper-trace/30 to-transparent" />

      <div className="section-padding">
        {/* Section header */}
        <SectionReveal className="mb-10">
          <h2 className="headline-lg text-center">
            Trải nghiệm: Bắt Kịp Hay Tụt Hậu?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-muted-steel font-body leading-relaxed">
            Bạn là nhà hoạch định chính sách. Phân bổ ngân sách quốc gia qua 5 vòng
            để đưa Việt Nam bắt kịp cách mạng công nghiệp 4.0. Mỗi lựa chọn đều có
            hệ quả — giống như thực tế.
          </p>
        </SectionReveal>

        {/* Game container */}
        <div className="mx-auto max-w-4xl">
          <GameContainer />
        </div>
      </div>

      {/* Bottom divider gradient */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-copper-trace/30 to-transparent" />
    </section>
  );
}
