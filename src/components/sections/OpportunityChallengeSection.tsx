'use client';

import {
  AlertTriangle,
  GitBranch,
  Globe2,
  Microscope,
  Split,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { CHALLENGES, OPPORTUNITIES } from '@/lib/constants';

const iconMap = {
  TrendingUp,
  Zap,
  Globe2,
  Microscope,
  Users,
  Split,
};

export default function OpportunityChallengeSection() {
  return (
    <section
      id="opportunities"
      className="relative z-10 w-full border-b border-muted-steel/10 bg-background-midnight px-6 py-24 md:px-12"
    >
      <div className="mx-auto mb-16 max-w-7xl text-center">
        <span className="mb-4 inline-block border border-copper-trace/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-copper-trace">
          Cơ hội và rủi ro
        </span>
        <h2 className="font-display text-3xl font-extrabold text-pulse-text md:text-4xl">
          CMCN 4.0 không tự động cứu CNH-HĐH
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-muted-steel md:text-base">
          Cùng một công nghệ có thể trở thành bệ phóng hoặc điểm đứt gãy. Khác biệt
          nằm ở khả năng biến cơ hội bên ngoài thành năng lực sản xuất bên trong.
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-signal-cyan/25 bg-signal-cyan/10">
              <TrendingUp size={18} className="text-signal-cyan" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-signal-cyan">Cơ hội</h3>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-steel">
                có thể rút ngắn khoảng cách
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {OPPORTUNITIES.map((item, index) => {
              const Icon = iconMap[item.iconName as keyof typeof iconMap] ?? GitBranch;
              return (
                <article
                  key={item.id}
                  className="cursor-target flex gap-4 border border-signal-cyan/10 bg-circuit-surface/30 p-5 transition-colors hover:border-signal-cyan/35"
                >
                  <div className="mt-0.5 h-fit shrink-0 bg-signal-cyan/10 p-2 text-signal-cyan">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-mono text-[10px] text-signal-cyan/70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className="font-display text-base font-semibold text-pulse-text">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-sm leading-6 text-muted-steel">{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-disruption-amber/25 bg-disruption-amber/10">
              <AlertTriangle size={18} className="text-disruption-amber" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-disruption-amber">Rủi ro</h3>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-steel">
                có thể làm sâu đứt gãy
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {CHALLENGES.map((item, index) => {
              const Icon = iconMap[item.iconName as keyof typeof iconMap] ?? AlertTriangle;
              return (
                <article
                  key={item.id}
                  className="cursor-target flex gap-4 border border-disruption-amber/10 bg-circuit-surface/30 p-5 transition-colors hover:border-disruption-amber/35"
                >
                  <div className="mt-0.5 h-fit shrink-0 bg-disruption-amber/10 p-2 text-disruption-amber">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-mono text-[10px] text-disruption-amber/70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className="font-display text-base font-semibold text-pulse-text">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-sm leading-6 text-muted-steel">{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
