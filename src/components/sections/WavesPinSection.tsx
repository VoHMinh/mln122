'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Factory, Lightbulb, Cpu, Network, Zap, Binary, Gauge } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Wave = {
  id: string;
  number: string;
  year: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  thesis: string;
  icon: React.ReactNode;
  accent: string;
  softAccent: string;
  leaders: string;
  vietnam: string;
  core: string[];
  dots: { code: string; label: string; position: number; vietnam?: boolean }[];
};

const waves: Wave[] = [
  {
    id: 'wave1-section',
    number: '1.0',
    year: '1784',
    title: 'Cơ khí hóa và hơi nước',
    shortTitle: 'Cơ khí hóa',
    subtitle: 'Máy móc thay sức người, năng suất bắt đầu tăng theo cấp số mới.',
    description:
      'Làn sóng đầu tiên mở ra nền sản xuất cơ khí với động cơ hơi nước, nhà máy dệt, luyện kim và đường sắt. Những quốc gia đi đầu tích lũy tư bản công nghiệp rất sớm, còn Việt Nam khi đó gần như đứng ngoài trục công nghệ do bối cảnh thuộc địa.',
    thesis:
      'Bài học chính: bỏ lỡ nền tảng công nghiệp ban đầu khiến khoảng cách tích lũy kéo dài qua nhiều thế hệ.',
    icon: <Factory size={26} />,
    accent: '#d4915a',
    softAccent: 'rgb(212 145 90 / 0.18)',
    leaders: 'Anh, sau đó lan sang Tây Âu',
    vietnam: 'Chưa tham gia, chủ yếu trong quỹ đạo thuộc địa',
    core: ['Động cơ hơi nước', 'Cơ giới hóa', 'Luyện kim', 'Đường sắt'],
    dots: [
      { code: 'UK', label: 'Anh dẫn sóng', position: 94 },
      { code: 'FR', label: 'Pháp theo sau', position: 56 },
      { code: 'VN', label: 'Việt Nam đứng ngoài', position: 10, vietnam: true },
    ],
  },
  {
    id: 'wave2-section',
    number: '2.0',
    year: '1870',
    title: 'Điện khí hóa và dây chuyền',
    shortTitle: 'Điện khí hóa',
    subtitle: 'Điện, thép và dây chuyền biến nhà máy thành hệ thống sản xuất hàng loạt.',
    description:
      'Kỷ nguyên điện khí hóa đưa sản xuất hàng loạt, dây chuyền lắp ráp và tiêu chuẩn hóa lên vị trí trung tâm. Mỹ và Đức bứt lên bằng tổ chức sản xuất, kỹ thuật điện và năng lực doanh nghiệp quy mô lớn.',
    thesis:
      'Bài học chính: công nghệ chỉ tạo đột phá khi đi cùng tổ chức sản xuất, hạ tầng năng lượng và thể chế công nghiệp.',
    icon: <Lightbulb size={26} />,
    accent: '#f2b866',
    softAccent: 'rgb(242 184 102 / 0.16)',
    leaders: 'Mỹ, Đức và các nền công nghiệp điện khí',
    vietnam: 'Bỏ lỡ phần lớn vì chiến tranh, khai thác thuộc địa và thiếu nội lực công nghiệp',
    core: ['Điện', 'Thép', 'Dây chuyền', 'Sản xuất hàng loạt'],
    dots: [
      { code: 'US', label: 'Mỹ tăng tốc', position: 95 },
      { code: 'DE', label: 'Đức bám sát', position: 89 },
      { code: 'JP', label: 'Nhật chuyển mình', position: 42 },
      { code: 'VN', label: 'Việt Nam tụt lại', position: 14, vietnam: true },
    ],
  },
  {
    id: 'wave3-section',
    number: '3.0',
    year: '1969',
    title: 'Kỹ thuật số và tự động hóa',
    shortTitle: 'Tự động hóa',
    subtitle: 'Máy tính, chip và phần mềm tái cấu trúc toàn bộ chuỗi giá trị.',
    description:
      'Từ máy tính, vi xử lý đến internet và robot công nghiệp, làn sóng thứ ba dịch chuyển lợi thế sang các nền kinh tế biết đầu tư vào kỹ năng, R&D và chuỗi cung ứng công nghệ cao. Việt Nam bắt đầu tham gia sau Đổi mới, nhưng chủ yếu ở khâu gia công.',
    thesis:
      'Bài học chính: tham gia muộn vẫn có cửa bắt kịp, nhưng nếu chỉ lắp ráp thì giá trị gia tăng nội địa bị khóa thấp.',
    icon: <Cpu size={26} />,
    accent: '#36b5c0',
    softAccent: 'rgb(54 181 192 / 0.15)',
    leaders: 'Mỹ, Nhật Bản, Hàn Quốc, Đài Loan',
    vietnam: 'Bắt đầu tham gia từ Đổi mới 1986, chủ yếu trong gia công và FDI',
    core: ['Vi xử lý', 'Máy tính', 'Internet', 'Robot công nghiệp'],
    dots: [
      { code: 'JP', label: 'Nhật tự động hóa', position: 93 },
      { code: 'KR', label: 'Hàn Quốc bắt kịp', position: 86 },
      { code: 'US', label: 'Mỹ dẫn phần mềm', position: 90 },
      { code: 'VN', label: 'Việt Nam mới nhập cuộc', position: 24, vietnam: true },
    ],
  },
  {
    id: 'wave4-section',
    number: '4.0',
    year: 'Hiện tại',
    title: 'AI, dữ liệu và đứt gãy',
    shortTitle: 'AI và dữ liệu',
    subtitle: 'Cửa sổ leapfrogging đang mở, nhưng tốc độ đóng lại nhanh hơn mọi làn sóng trước.',
    description:
      'AI, dữ liệu lớn, IoT, bán dẫn và robot tạo ra cơ hội đi tắt đón đầu, đồng thời làm khoảng cách công nghệ sâu hơn nếu nền tảng R&D và nhân lực không theo kịp. Việt Nam đang ở ngã rẽ: có điểm sáng về kinh tế số và xuất khẩu công nghệ, nhưng nội lực tri thức vẫn là nút thắt.',
    thesis:
      'Bài học chính: tăng trưởng nhờ FDI không đủ. Muốn tránh đứt gãy, Việt Nam phải nâng năng lực tự chủ công nghệ.',
    icon: <Network size={26} />,
    accent: '#c86bff',
    softAccent: 'rgb(200 107 255 / 0.16)',
    leaders: 'Mỹ, Trung Quốc, Hàn Quốc và các trung tâm bán dẫn',
    vietnam: 'Ở ngã rẽ, có cơ hội leapfrogging nhưng nguy cơ phụ thuộc sâu hơn',
    core: ['AI', 'Dữ liệu lớn', 'IoT', 'Bán dẫn', 'Robot'],
    dots: [
      { code: 'US', label: 'Mỹ dẫn AI nền tảng', position: 96 },
      { code: 'CN', label: 'Trung Quốc mở rộng dữ liệu', position: 88 },
      { code: 'KR', label: 'Hàn Quốc mạnh bán dẫn', position: 84 },
      { code: 'VN', label: 'Việt Nam ở ngã rẽ', position: 48, vietnam: true },
    ],
  },
];

const gearTeeth = Array.from({ length: 14 }, (_, index) => index);
const binaryColumns = ['01001101', '10110100', '00110110', '11001001', '01101011', '10010110'];
const pixels = Array.from({ length: 24 }, (_, index) => ({
  x: 60 + (index % 8) * 130,
  y: 100 + Math.floor(index / 8) * 150,
  delay: `${(index % 6) * 0.18}s`,
}));
const neuralNodes = [
  [120, 180],
  [240, 120],
  [300, 300],
  [440, 190],
  [540, 90],
  [620, 280],
  [760, 160],
  [820, 340],
  [980, 120],
  [1050, 280],
  [1140, 190],
  [1260, 330],
];
const neuralLinks = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
  [4, 6],
  [5, 7],
  [6, 8],
  [6, 9],
  [7, 9],
  [8, 10],
  [9, 10],
  [10, 11],
];

function Gear({ className, cx, cy, r }: { className: string; cx: number; cy: number; r: number }) {
  return (
    <g className={className} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      {gearTeeth.map((tooth) => (
        <rect
          key={tooth}
          x={cx - 8}
          y={cy - r - 16}
          width="16"
          height="34"
          rx="2"
          fill="currentColor"
          opacity="0.22"
          transform={`rotate(${(360 / gearTeeth.length) * tooth} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <circle cx={cx} cy={cy} r={r * 0.52} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <circle cx={cx} cy={cy} r={r * 0.16} fill="currentColor" opacity="0.2" />
    </g>
  );
}

function WaveBackgroundLayer({ wave, index }: { wave: Wave; index: number }) {
  return (
    <div
      className="wave-bg-layer fixed inset-0 bottom-0 z-0 overflow-hidden opacity-0"
      data-wave-bg={index}
      aria-hidden="true"
      style={{ color: wave.accent, ['--wave-accent' as string]: wave.accent, ['--wave-soft' as string]: wave.softAccent }}
    >
      <div className="absolute inset-0 bg-[#05070b]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 24%, var(--wave-soft), transparent 34%), radial-gradient(circle at 82% 18%, rgb(54 181 192 / 0.08), transparent 30%), linear-gradient(145deg, #05070b 0%, #0a1628 48%, #040508 100%)',
        }}
      />

      {index === 0 && (
        <>
          <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <Gear className="gear-spin-slow" cx={175} cy={205} r={108} />
            <Gear className="gear-spin-reverse" cx={1280} cy={690} r={142} />
            <Gear className="gear-spin-slow opacity-60" cx={1120} cy={130} r={74} />
            <path d="M0 720 C260 650 480 760 720 700 C980 635 1130 700 1440 620" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.16" />
            <path d="M0 760 C280 700 460 805 750 745 C1000 690 1170 750 1440 675" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.11" />
          </svg>
          <div className="steam-field">
            {Array.from({ length: 18 }, (_, item) => (
              <span key={item} style={{ left: `${8 + item * 5.2}%`, animationDelay: `${item * 0.37}s` }} />
            ))}
          </div>
        </>
      )}

      {index === 1 && (
        <svg className="assembly-svg absolute inset-0 h-full w-full opacity-75" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          {[230, 320, 410, 500, 590].map((y, item) => (
            <g key={y} className="assembly-track" style={{ animationDelay: `${item * -0.6}s` }}>
              <path d={`M-160 ${y} H1600`} stroke="currentColor" strokeWidth="2" opacity="0.12" />
              <path d={`M-140 ${y + 22} H1600`} stroke="currentColor" strokeWidth="1" opacity="0.08" />
              {Array.from({ length: 10 }, (_, block) => (
                <rect key={block} x={block * 160} y={y - 18} width="70" height="24" rx="2" fill="currentColor" opacity="0.1" />
              ))}
            </g>
          ))}
          <path className="electric-wave" d="M80 710 L180 660 L250 710 L360 650 L450 700 L570 640 L690 705 L780 655 L900 710 L1040 650 L1140 700 L1320 640" fill="none" stroke="currentColor" strokeWidth="2" />
          <path className="spark spark-a" d="M1080 250 l28 -42 l-6 37 l38 -10 l-46 52 l10 -38 z" fill="currentColor" />
          <path className="spark spark-b" d="M280 610 l22 -32 l-5 28 l31 -8 l-36 40 l8 -29 z" fill="currentColor" />
        </svg>
      )}

      {index === 2 && (
        <>
          <svg className="digital-grid absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 12 }, (_, item) => (
              <path key={`v-${item}`} d={`M${item * 130 - 20} 900 L720 120`} stroke="currentColor" strokeWidth="1" opacity="0.1" />
            ))}
            {Array.from({ length: 9 }, (_, item) => (
              <path key={`h-${item}`} d={`M${80 + item * -70} ${820 - item * 70} H${1360 - item * -70}`} stroke="currentColor" strokeWidth="1" opacity="0.1" />
            ))}
            {pixels.map((pixel) => (
              <rect key={`${pixel.x}-${pixel.y}`} className="digital-pixel" x={pixel.x} y={pixel.y} width="16" height="16" fill="currentColor" opacity="0.08" style={{ animationDelay: pixel.delay }} />
            ))}
          </svg>
          <div className="binary-rain">
            {binaryColumns.map((column, item) => (
              <span key={column} style={{ left: `${12 + item * 15}%`, animationDelay: `${item * -0.7}s` }}>
                {column.split('').map((char, charIndex) => (
                  <b key={`${char}-${charIndex}`}>{char}</b>
                ))}
              </span>
            ))}
          </div>
        </>
      )}

      {index === 3 && (
        <>
          <svg className="neural-svg absolute inset-0 h-full w-full opacity-80" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            {neuralLinks.map(([from, to], item) => (
              <line
                key={`${from}-${to}`}
                className="neural-link"
                x1={neuralNodes[from][0]}
                y1={neuralNodes[from][1]}
                x2={neuralNodes[to][0]}
                y2={neuralNodes[to][1]}
                stroke="currentColor"
                strokeWidth="1.2"
                opacity="0.16"
                style={{ animationDelay: `${item * 0.16}s` }}
              />
            ))}
            {neuralNodes.map(([x, y], item) => (
              <g key={`${x}-${y}`} className="neural-node" style={{ animationDelay: `${item * 0.12}s` }}>
                <circle cx={x} cy={y} r="5" fill="currentColor" opacity="0.65" />
                <circle cx={x} cy={y} r="18" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.14" />
              </g>
            ))}
          </svg>
          <div className="glitch-rgb glitch-rgb-a" />
          <div className="glitch-rgb glitch-rgb-b" />
          <div className="glitch-band band-a" />
          <div className="glitch-band band-b" />
        </>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,11,0.18),rgba(5,7,11,0.62))]" />
    </div>
  );
}

function CountryTrack({ wave }: { wave: Wave }) {
  return (
    <div className="mt-10 w-full max-w-3xl">
      <div className="relative h-20 rounded-[8px] border border-white/10 bg-black/20 px-4 py-5 backdrop-blur-md">
        <div className="absolute left-5 right-5 top-1/2 h-px bg-white/12" />
        <div
          className="absolute left-5 right-5 top-1/2 h-px origin-left scale-x-0 bg-[var(--wave-accent)]/70 wave-progress-line"
          style={{ ['--wave-accent' as string]: wave.accent }}
        />
        {wave.dots.map((dot) => (
          <button
            key={dot.code}
            className={`cursor-target wave-country-dot absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[11px] font-bold tracking-wide transition-transform hover:scale-110 ${
              dot.vietnam ? 'border-copper-trace bg-copper-trace text-black' : 'border-white/20 bg-black/70 text-pulse-text'
            }`}
            style={{ left: `${dot.position}%`, boxShadow: dot.vietnam ? `0 0 28px ${wave.accent}70` : undefined }}
            aria-label={dot.label}
            title={dot.label}
          >
            {dot.code}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted-steel">
        <span>Tụt lại</span>
        <span>Dẫn sóng</span>
      </div>
    </div>
  );
}

function WavePanel({ wave, index }: { wave: Wave; index: number }) {
  return (
    <section
      id={wave.id}
      className="wave-panel relative z-10 flex min-h-[112dvh] items-center px-5 py-24 sm:px-8 lg:px-16"
      style={{ ['--wave-accent' as string]: wave.accent, ['--wave-soft' as string]: wave.softAccent }}
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.75fr)]">
        <div className="max-w-4xl">
          <div className="wave-kicker mb-5 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-steel">
            <span className="cursor-target inline-flex items-center gap-2 rounded-[6px] border border-white/10 bg-black/30 px-3 py-1.5 text-[var(--wave-accent)] backdrop-blur-md">
              {wave.icon}
              Làn sóng {wave.number}
            </span>
            <span>{wave.year}</span>
          </div>

          <h2 className="wave-title max-w-5xl font-display text-4xl font-black leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
            {wave.title.split(' ').map((word, wordIndex) => (
              <span key={`${word}-${wordIndex}`} className="wave-word mr-[0.22em] inline-block">
                {word}
              </span>
            ))}
          </h2>

          <p className="wave-subtitle mt-6 max-w-2xl text-xl font-medium leading-relaxed text-[var(--wave-accent)] sm:text-2xl">
            {wave.subtitle}
          </p>

          <p className="wave-copy mt-6 max-w-3xl text-base leading-8 text-pulse-text/82 sm:text-lg">
            {wave.description}
          </p>

          <div className="wave-thesis cursor-target mt-8 max-w-3xl rounded-[8px] border border-white/10 bg-black/32 p-5 text-sm leading-7 text-pulse-text/85 shadow-2xl backdrop-blur-xl">
            <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--wave-soft)] text-[var(--wave-accent)]">
              <Gauge size={15} />
            </span>
            {wave.thesis}
          </div>

          <CountryTrack wave={wave} />
        </div>

        <aside className="wave-info-panel cursor-target rounded-[8px] border border-white/10 bg-black/35 p-5 backdrop-blur-xl sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-steel">Trục phân tích</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">{wave.shortTitle}</h3>
            </div>
            <div className="rounded-[8px] border border-white/10 bg-white/[0.03] p-3 text-[var(--wave-accent)]">
              {index === 1 ? <Zap size={22} /> : index === 2 ? <Binary size={22} /> : wave.icon}
            </div>
          </div>

          <dl className="space-y-5">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-steel">Công nghệ lõi</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {wave.core.map((item) => (
                  <span key={item} className="rounded-[6px] border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-pulse-text/86">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-steel">Quốc gia đi đầu</dt>
              <dd className="mt-2 text-sm leading-7 text-pulse-text/86">{wave.leaders}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-steel">Việt Nam ở đâu</dt>
              <dd className="mt-2 text-sm leading-7 text-pulse-text/86">{wave.vietnam}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}

export default function WavesPinSection() {
  const rootRef = useRef<HTMLElement>(null);
  const activeWaveRef = useRef(0);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const panels = gsap.utils.toArray<HTMLElement>('.wave-panel');
      const layers = gsap.utils.toArray<HTMLElement>('.wave-bg-layer');
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      gsap.set(root.querySelector('.wave-background-container'), { autoAlpha: 0 });
      gsap.set(layers, { autoAlpha: 0 });
      gsap.set(layers[0], { autoAlpha: 1 });

      const activateWave = (index: number) => {
        activeWaveRef.current = index;
        gsap.to(layers, {
          autoAlpha: (layerIndex) => (layerIndex === index ? 1 : 0),
          duration: reduceMotion ? 0 : 0.65,
          ease: 'power2.out',
          overwrite: true,
        });
      };

      ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => gsap.to(root.querySelector('.wave-background-container'), { autoAlpha: 1, duration: 0.35 }),
        onEnterBack: () => gsap.to(root.querySelector('.wave-background-container'), { autoAlpha: 1, duration: 0.35 }),
        onLeave: () => gsap.to(root.querySelector('.wave-background-container'), { autoAlpha: 0, duration: 0.35 }),
        onLeaveBack: () => gsap.to(root.querySelector('.wave-background-container'), { autoAlpha: 0, duration: 0.35 }),
      });

      panels.forEach((panel, index) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => activateWave(index),
          onEnterBack: () => activateWave(index),
          onUpdate: (self) => {
            if (index === 3 && Math.abs(self.getVelocity()) > 1800) {
              root.classList.add('is-glitching');
              gsap.delayedCall(0.22, () => root.classList.remove('is-glitching'));
            }
          },
        });

        if (!reduceMotion) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: panel,
                start: 'top 72%',
                end: 'top 24%',
                scrub: 0.6,
              },
            })
            .fromTo(panel.querySelectorAll('.wave-word'), { autoAlpha: 0, y: 64, rotationX: -28 }, { autoAlpha: 1, y: 0, rotationX: 0, stagger: 0.045, ease: 'power3.out' })
            .fromTo(panel.querySelector('.wave-subtitle'), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, ease: 'power2.out' }, '-=0.25')
            .fromTo(panel.querySelector('.wave-copy'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, ease: 'power2.out' }, '-=0.2')
            .fromTo(panel.querySelector('.wave-thesis'), { autoAlpha: 0, x: -26 }, { autoAlpha: 1, x: 0, ease: 'power2.out' }, '-=0.15')
            .fromTo(panel.querySelector('.wave-info-panel'), { autoAlpha: 0, y: 38, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, ease: 'power3.out' }, '-=0.35')
            .fromTo(panel.querySelector('.wave-progress-line'), { scaleX: 0 }, { scaleX: 1, ease: 'none' }, '-=0.35')
            .fromTo(panel.querySelectorAll('.wave-country-dot'), { autoAlpha: 0, y: 16, scale: 0.7 }, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.08, ease: 'back.out(1.8)' }, '-=0.2');
        } else {
          gsap.set(panel.querySelectorAll('.wave-word, .wave-subtitle, .wave-copy, .wave-thesis, .wave-info-panel, .wave-country-dot'), {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
          });
          gsap.set(panel.querySelector('.wave-progress-line'), { scaleX: 1 });
        }
      });

      const glitchLoop = window.setInterval(() => {
        if (activeWaveRef.current !== 3 || reduceMotion) return;
        root.classList.add('is-glitching');
        window.setTimeout(() => root.classList.remove('is-glitching'), 190);
      }, 4200);

      return () => {
        window.clearInterval(glitchLoop);
      };
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative isolate bg-[#05070b]" aria-label="Bốn làn sóng công nghệ">
      <div className="wave-background-container pointer-events-none fixed inset-0 bottom-0 z-0">
        {waves.map((wave, index) => (
          <WaveBackgroundLayer key={wave.id} wave={wave} index={index} />
        ))}
      </div>

      <div className="relative z-10">
        {waves.map((wave, index) => (
          <WavePanel key={wave.id} wave={wave} index={index} />
        ))}
      </div>
    </section>
  );
}
