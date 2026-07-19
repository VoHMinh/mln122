'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Factory, Lightbulb, MemoryStick } from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { id: 'wave1-section', label: 'Cơ khí hóa', number: 'Wave 1.0', icon: <Factory size={15} />, color: '#D4915A' },
  { id: 'wave2-section', label: 'Điện khí hóa', number: 'Wave 2.0', icon: <Lightbulb size={15} />, color: '#F2B866' },
  { id: 'wave3-section', label: 'Tự động hóa', number: 'Wave 3.0', icon: <MemoryStick size={15} />, color: '#36B5C0' },
  { id: 'wave4-section', label: 'AI và dữ liệu', number: 'Wave 4.0', icon: <Cpu size={15} />, color: '#C86BFF' },
];

export default function WaveProgressNav() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    scrollTriggersRef.current.forEach((trigger) => trigger.kill());
    scrollTriggersRef.current = [];

    NAV_ITEMS.forEach((item, index) => {
      const el = document.getElementById(item.id);
      if (!el) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
      });

      scrollTriggersRef.current.push(trigger);
    });

    const heroEl = document.getElementById('hero');
    if (heroEl) {
      const trigger = ScrollTrigger.create({
        trigger: heroEl,
        start: 'top top',
        end: 'bottom center',
        onEnter: () => setActiveIndex(null),
        onEnterBack: () => setActiveIndex(null),
      });
      scrollTriggersRef.current.push(trigger);
    }

    return () => {
      scrollTriggersRef.current.forEach((trigger) => trigger.kill());
      scrollTriggersRef.current = [];
    };
  }, []);

  const handleNavClick = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <aside className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center xl:flex">
      <div className="relative flex flex-col items-center gap-5 py-4">
        <div className="absolute left-1/2 top-0 -z-10 h-full w-px -translate-x-1/2 bg-white/10" />

        {NAV_ITEMS.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-all duration-300',
                isActive
                  ? 'scale-110 bg-black/90'
                  : 'border-white/15 bg-black/60 text-white/45 hover:scale-105 hover:border-white/30 hover:text-white',
              )}
              style={
                isActive
                  ? {
                      borderColor: item.color,
                      color: item.color,
                      boxShadow: `0 0 18px ${item.color}66`,
                    }
                  : undefined
              }
              title={item.number}
            >
              {item.icon}

              <span
                className="pointer-events-none absolute right-full mr-4 whitespace-nowrap rounded-[8px] border bg-black/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] opacity-0 shadow-2xl transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  borderColor: isActive ? `${item.color}55` : 'rgb(255 255 255 / 0.12)',
                  color: isActive ? item.color : '#C8D6E5',
                }}
              >
                {item.number} / {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
