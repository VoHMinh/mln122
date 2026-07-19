'use client';

import { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CheckCircle2, GraduationCap, Handshake, Lightbulb, Microscope } from 'lucide-react';
import useReducedMotion from '@/hooks/useReducedMotion';
import { SOLUTIONS } from '@/lib/constants';
import OptionWheel, { type OptionWheelItem } from '@/components/ui/OptionWheel';

gsap.registerPlugin(ScrollTrigger);

const solutionDetails = [
  {
    metric: 'Từ 0,41% GDP R&D lên năng lực nghiên cứu có sản phẩm',
    actions: [
      'Ưu tiên nhiệm vụ R&D có đặt hàng từ ngành sản xuất, không dàn trải theo phong trào.',
      'Đo kết quả bằng mẫu thử, bằng sáng chế, công bố ứng dụng và doanh nghiệp nội địa tham gia.',
      'Tập trung các lĩnh vực có tác động lan tỏa: AI, dữ liệu, bán dẫn, tự động hóa, vật liệu và công nghệ xanh.',
    ],
  },
  {
    metric: 'Từ thiếu kỹ năng sang đội ngũ hấp thụ công nghệ',
    actions: [
      'Thiết kế chương trình STEM gắn phòng thí nghiệm, dữ liệu thật và bài toán của doanh nghiệp.',
      'Tăng học bổng và vị trí nghiên cứu cho AI, bán dẫn, an toàn thông tin, tự động hóa.',
      'Kết nối đại học, viện nghiên cứu và doanh nghiệp bằng dự án chung thay vì chỉ thực tập ngắn hạn.',
    ],
  },
  {
    metric: 'Từ thu hút vốn sang thu hút tri thức',
    actions: [
      'Ưu tiên FDI có trung tâm kỹ thuật, đào tạo nhân sự và mạng lưới nhà cung ứng Việt Nam.',
      'Đàm phán điều kiện hợp tác nghiên cứu với viện trường trong nước ở các dự án công nghệ cao.',
      'Hỗ trợ doanh nghiệp nội địa đạt tiêu chuẩn chất lượng để tham gia sâu hơn vào chuỗi giá trị.',
    ],
  },
  {
    metric: 'Từ số hóa rời rạc sang hạ tầng thể chế cho AI',
    actions: [
      'Xây dựng sandbox cho dữ liệu, AI, fintech và công nghệ sản xuất mới.',
      'Chuẩn hóa chia sẻ dữ liệu, an toàn thông tin và trách nhiệm thuật toán trong khu vực công và tư.',
      'Dùng mua sắm công và dịch vụ công số để tạo thị trường thử nghiệm cho giải pháp công nghệ Việt Nam.',
    ],
  },
];

const icons = [Microscope, GraduationCap, Handshake, Lightbulb];

export default function SolutionsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const wheelItems: OptionWheelItem[] = useMemo(
    () =>
      SOLUTIONS.map((solution) => ({
        label: solution.title,
        value: solution.id,
        description: solution.description,
      })),
    [],
  );

  const activeSolution = SOLUTIONS[activeIndex];
  const activeDetail = solutionDetails[activeIndex];
  const ActiveIcon = icons[activeIndex] ?? Lightbulb;

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.from('.solution-shell', {
        opacity: 0,
        y: 44,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      gsap.fromTo(
        '.solution-detail',
        { opacity: 0, x: 24, filter: 'blur(8px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out' },
      );
    },
    { scope: sectionRef, dependencies: [activeIndex, prefersReducedMotion] },
  );

  return (
    <section
      id="solutions"
      ref={sectionRef}
      className="relative z-10 flex min-h-screen w-full flex-col justify-center border-b border-muted-steel/10 bg-deep-circuit px-6 py-24 md:px-12"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-14 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-copper-trace" />
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-trace">
              Hướng thu hẹp
            </span>
          </div>
          <h2 className="headline-xl text-gradient-copper">
            Thu hẹp đứt gãy bằng năng lực, không bằng khẩu hiệu
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-steel">
            Bốn nhóm giải pháp dưới đây bám vào đúng điểm nghẽn: R&D, nhân lực,
            chuyển giao công nghệ và thể chế dữ liệu. Chọn từng chiến lược để xem
            logic triển khai.
          </p>
        </div>

        <div className="solution-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <OptionWheel
            items={wheelItems}
            defaultSelected={activeSolution.id}
            onChange={(_, index) => setActiveIndex(index)}
          />

          <div className="solution-detail cursor-target border border-signal-cyan/20 bg-circuit-surface/35 p-6 backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center border border-signal-cyan/25 bg-signal-cyan/10 text-signal-cyan">
                <ActiveIcon size={26} />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-copper-trace">
                  Chiến lược {String(activeIndex + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-pulse-text md:text-3xl">
                  {activeSolution.title}
                </h3>
              </div>
            </div>

            <p className="text-base leading-7 text-muted-steel">{activeSolution.description}</p>

            <div className="mt-7 border-l-2 border-copper-trace/60 bg-copper-trace/5 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-copper-trace">
                Thước đo trọng tâm
              </p>
              <p className="mt-2 text-sm leading-6 text-pulse-text">{activeDetail.metric}</p>
            </div>

            <ul className="mt-7 space-y-4">
              {activeDetail.actions.map((action) => (
                <li key={action} className="flex gap-3 text-sm leading-7 text-muted-steel">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-signal-cyan" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
