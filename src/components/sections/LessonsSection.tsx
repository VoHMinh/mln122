'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BookOpen, Factory, Layers3, Scale } from 'lucide-react';
import useReducedMotion from '@/hooks/useReducedMotion';
import { LESSONS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

const lessonIcons = [
  <Factory className="h-6 w-6 text-signal-cyan" key="factory" />,
  <Scale className="h-6 w-6 text-disruption-amber" key="scale" />,
  <Layers3 className="h-6 w-6 text-copper-trace" key="layers" />,
];

export default function LessonsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.from('.impact-card', {
        opacity: 0,
        y: 48,
        rotateX: -8,
        stagger: 0.13,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        },
      });

      gsap.to('.impact-rail', {
        scaleY: 1,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 72%',
          end: 'bottom 45%',
          scrub: true,
        },
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] },
  );

  return (
    <section
      id="lessons"
      ref={containerRef}
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center border-b border-muted-steel/10 bg-deep-circuit px-6 py-28 md:px-12"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-16 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <BookOpen className="h-5 w-5 text-copper-trace" />
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-trace">
              Tác động đến CNH-HĐH
            </span>
          </div>
          <h2 className="headline-xl text-gradient-copper">
            CMCN 4.0 tạo cơ hội rút ngắn, nhưng cũng làm lộ điểm nghẽn
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-steel">
            Ba tác động dưới đây là trục lập luận chính: công nghiệp hóa cần chiều sâu,
            hiện đại hóa cần thể chế mới, và phát triển lực lượng sản xuất phải đi cùng
            năng lực công nghệ nội sinh.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-5 top-0 hidden h-full w-px origin-top scale-y-0 bg-gradient-to-b from-signal-cyan via-copper-trace to-transparent md:block impact-rail" />

          <div className="grid gap-5">
            {LESSONS.map((lesson, index) => (
              <article
                key={lesson.id}
                className="impact-card cursor-target border border-white/10 bg-circuit-surface/35 p-6 backdrop-blur-xl md:ml-14 md:p-8"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/10 bg-deep-circuit">
                    {lessonIcons[index]}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="font-mono text-xs text-copper-trace">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="h-px flex-1 bg-white/10" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-pulse-text">
                      {lesson.title}
                    </h3>
                    <p className="mt-4 max-w-4xl text-sm leading-7 text-muted-steel md:text-base">
                      {lesson.description}
                    </p>
                    <p className="mt-5 border-l-2 border-copper-trace/55 bg-copper-trace/5 px-4 py-3 text-xs leading-6 text-pulse-text">
                      {lesson.example}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
