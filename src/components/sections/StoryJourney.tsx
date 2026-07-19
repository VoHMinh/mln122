'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BrainCircuit,
  Check,
  Cpu,
  Factory,
  GraduationCap,
  Handshake,
  Landmark,
  Lightbulb,
  Microscope,
  ShieldCheck,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import useReducedMotion from '@/hooks/useReducedMotion';
import { SOURCES } from '@/lib/constants';
import OptionWheel from '@/components/ui/OptionWheel';

gsap.registerPlugin(ScrollTrigger);

const WAVES = [
  {
    year: '1784',
    label: 'CMCN 1.0',
    title: 'Cơ khí hóa và hơi nước',
    subtitle: 'Máy móc thay sức người, mở đầu tích lũy công nghiệp hiện đại.',
    technology: 'Động cơ hơi nước, máy dệt, luyện kim, đường sắt.',
    mechanism: 'Năng suất tăng nhờ cơ giới hóa; lợi thế thuộc về quốc gia hình thành được nhà máy, vốn và hạ tầng vận tải sớm.',
    vietnam: 'Việt Nam gần như đứng ngoài quá trình này trong điều kiện thuộc địa. Nền tảng tích lũy công nghiệp vì thế hình thành muộn.',
    lesson: 'Bỏ lỡ công nghệ nền tảng tạo ra khoảng cách tích lũy kéo dài qua nhiều thế hệ.',
    icon: Factory,
  },
  {
    year: '1870',
    label: 'CMCN 2.0',
    title: 'Điện khí hóa và sản xuất hàng loạt',
    subtitle: 'Điện, thép và dây chuyền biến nhà máy thành hệ thống quy mô lớn.',
    technology: 'Điện, thép, hóa chất, động cơ đốt trong, dây chuyền.',
    mechanism: 'Năng lực cạnh tranh không chỉ nằm ở phát minh, mà ở tổ chức sản xuất, tiêu chuẩn hóa và hạ tầng năng lượng.',
    vietnam: 'Công nghiệp thuộc địa lệ thuộc và phân mảnh; không tạo được hệ doanh nghiệp, kỹ thuật và thị trường nội địa đủ mạnh.',
    lesson: 'Công nghệ chỉ phát huy tác dụng khi đi cùng hạ tầng và thể chế công nghiệp.',
    icon: Lightbulb,
  },
  {
    year: '1969',
    label: 'CMCN 3.0',
    title: 'Điện tử, số hóa và tự động hóa',
    subtitle: 'Chip, máy tính và phần mềm tái cấu trúc chuỗi giá trị toàn cầu.',
    technology: 'Vi xử lý, máy tính, internet, robot công nghiệp.',
    mechanism: 'Lợi thế chuyển sang thiết kế, phần mềm, dữ liệu và các mắt xích có hàm lượng tri thức cao.',
    vietnam: 'Sau Đổi mới, Việt Nam bước vào chuỗi giá trị qua sản xuất và FDI; năng lực thiết kế, R&D và sở hữu chuẩn công nghệ còn hạn chế.',
    lesson: 'Tham gia chuỗi giá trị là cần thiết, nhưng không đồng nghĩa với làm chủ giá trị.',
    icon: Cpu,
  },
  {
    year: 'Hiện nay',
    label: 'CMCN 4.0',
    title: 'AI, dữ liệu và hệ thống thông minh',
    subtitle: 'Cơ hội rút ngắn khoảng cách đi cùng nguy cơ lệ thuộc sâu hơn.',
    technology: 'AI, dữ liệu lớn, IoT, bán dẫn, robot, nền tảng số.',
    mechanism: 'Dữ liệu và năng lực tính toán trở thành đầu vào của sản xuất; khoảng cách có thể khuếch đại rất nhanh giữa bên tạo công nghệ và bên chỉ sử dụng.',
    vietnam: 'Việt Nam có cơ hội tiếp nhận nhanh, song vẫn đối mặt câu hỏi cốt lõi: xây được năng lực hấp thụ, cải tiến và tạo công nghệ đến đâu?',
    lesson: 'Đây là cửa sổ bắt kịp, nhưng cửa sổ chỉ có ý nghĩa khi nội lực được nâng lên có chủ đích.',
    icon: BrainCircuit,
  },
];

const EVIDENCE = [
  {
    id: 'gii',
    eyebrow: 'NĂNG LỰC BẮT NHỊP',
    title: 'Việt Nam có đầu ra đổi mới tốt hơn đầu vào',
    description: 'WIPO xếp Việt Nam hạng 44/139 trong Global Innovation Index 2025; đầu vào đổi mới hạng 50, đầu ra hạng 37.',
    implication: 'Đây là tín hiệu tích cực: khả năng chuyển nguồn lực hạn chế thành kết quả đổi mới đang có. Bước tiếp theo là làm dày nền tảng đầu vào để kết quả này bền vững.',
    source: 'WIPO, GII 2025',
  },
  {
    id: 'rd',
    eyebrow: 'NỘI LỰC NGHIÊN CỨU',
    title: 'Chi R&D còn quá thấp để kéo CNH-HĐH',
    description: 'Năm 2023, chi R&D của Việt Nam đạt 0,41% GDP; Trung Quốc là 2,58% và Hàn Quốc là 4,94%.',
    implication: 'Khi R&D mỏng, công nghiệp có thể tăng sản lượng nhưng khó vươn lên thiết kế sản phẩm, làm chủ tiêu chuẩn và giữ giá trị gia tăng cao.',
    source: 'World Bank WDI, 2023',
  },
  {
    id: 'researchers',
    eyebrow: 'MẬT ĐỘ TRI THỨC',
    title: 'Đội ngũ nghiên cứu chưa tương xứng với tham vọng công nghệ',
    description: 'Việt Nam có khoảng 836 nhà nghiên cứu trên một triệu dân; Hàn Quốc có khoảng 9.472, cao hơn hơn 11 lần.',
    implication: 'Khoảng cách này tác động trực tiếp đến khả năng hấp thụ AI, bán dẫn, tự động hóa và chuyển tri thức thành năng suất trong doanh nghiệp.',
    source: 'World Bank WDI, 2023',
  },
];

const IMPACTS = [
  {
    number: '01',
    wheelLabel: 'Quy mô / chiều sâu',
    title: 'CNH có nguy cơ rộng về quy mô nhưng mỏng về chiều sâu',
    mechanism: 'Nếu công nghiệp hóa chủ yếu dựa vào lắp ráp và công nghệ nhập khẩu, năng lực sản xuất có thể tăng nhanh nhưng năng lực thiết kế, R&D và tạo chuẩn không tăng tương ứng.',
    consequence: 'Giá trị gia tăng nội địa bị giới hạn; khi công nghệ nền tảng hoặc chuỗi cung ứng thay đổi, doanh nghiệp dễ bị động.',
  },
  {
    number: '02',
    wheelLabel: 'Dữ liệu / thể chế',
    title: 'HĐH trở thành bài toán dữ liệu và thể chế, không chỉ là số hóa',
    mechanism: 'AI và dữ liệu cần chuẩn chia sẻ, an toàn thông tin, hạ tầng số và năng lực quản trị. Không có các điều kiện này, công nghệ chỉ dừng ở các dự án rời rạc.',
    consequence: 'Một nhóm doanh nghiệp có thể đi nhanh, trong khi phần lớn doanh nghiệp trong nước không đủ dữ liệu, vốn và kỹ năng để tham gia.',
  },
  {
    number: '03',
    wheelLabel: 'Lao động / năng lực',
    title: 'Lực lượng sản xuất mới đòi hỏi năng lực lao động mới',
    mechanism: 'Khi công việc gắn với tự động hóa, dữ liệu và tri thức, giáo dục, thị trường lao động, tài chính và chính sách công nghệ phải cùng thay đổi.',
    consequence: 'Nếu không đồng bộ, CMCN 4.0 sẽ khuếch đại bất bình đẳng năng lực thay vì tạo động lực hiện đại hóa.',
  },
];

const ACTIONS = [
  {
    number: '01',
    title: 'Đặt hàng R&D từ bài toán sản xuất',
    outcome: 'Từ ưu đãi dàn trải sang nhiệm vụ có sản phẩm và doanh nghiệp sử dụng.',
    actions: ['Ưu tiên đề bài xuất phát từ ngành công nghiệp cụ thể.', 'Đo kết quả bằng mẫu thử, bằng sáng chế, quy trình hoặc doanh thu ứng dụng.', 'Kết nối viện, trường và doanh nghiệp trong cùng một chuỗi thực hiện.'],
    icon: Microscope,
  },
  {
    number: '02',
    title: 'Tạo mật độ nhân lực công nghệ lõi',
    outcome: 'Từ đào tạo đại trà sang đội ngũ có khả năng hấp thụ và cải tiến công nghệ.',
    actions: ['Tập trung AI, dữ liệu, bán dẫn, tự động hóa, an toàn thông tin.', 'Gắn đào tạo với phòng thí nghiệm và dữ liệu thật.', 'Mở lộ trình nghiên cứu nghề nghiệp đủ dài để giữ nhân lực.'],
    icon: GraduationCap,
  },
  {
    number: '03',
    title: 'Chuyển từ thu hút vốn sang thu hút tri thức',
    outcome: 'FDI tạo liên kết công nghệ thay vì chỉ tăng công suất lắp ráp.',
    actions: ['Ưu tiên dự án có trung tâm kỹ thuật và chương trình đào tạo.', 'Gắn yêu cầu hợp tác nghiên cứu với viện, trường trong nước.', 'Nâng chuẩn nhà cung ứng Việt Nam để tham gia sâu hơn.'],
    icon: Handshake,
  },
  {
    number: '04',
    title: 'Hoàn thiện thể chế dữ liệu và AI',
    outcome: 'Công nghệ mới được thử nghiệm nhanh, minh bạch và có trách nhiệm.',
    actions: ['Xây dựng sandbox cho AI, dữ liệu và công nghệ sản xuất.', 'Chuẩn hóa chia sẻ dữ liệu và bảo đảm an toàn thông tin.', 'Dùng mua sắm công để tạo thị trường thử nghiệm cho giải pháp Việt Nam.'],
    icon: ShieldCheck,
  },
];

function WaveIllustration({ index }: { index: number }) {
  if (index === 0) {
    return <svg className="atlas-wave-visual" viewBox="0 0 360 250" aria-hidden="true"><g className="atlas-wave-gear atlas-wave-gear-a" transform="translate(122 130)">{Array.from({ length: 12 }, (_, item) => <rect key={item} x="-10" y="-88" width="20" height="27" rx="2" transform={`rotate(${item * 30})`} fill="currentColor" opacity="0.68" />)}<circle r="64" fill="none" stroke="currentColor" strokeWidth="4"/><circle r="27" fill="none" stroke="currentColor" strokeWidth="4"/></g><g className="atlas-wave-gear atlas-wave-gear-b" transform="translate(238 157)">{Array.from({ length: 10 }, (_, item) => <rect key={item} x="-8" y="-58" width="16" height="21" rx="2" transform={`rotate(${item * 36})`} fill="currentColor" opacity="0.55" />)}<circle r="42" fill="none" stroke="currentColor" strokeWidth="3"/><circle r="17" fill="none" stroke="currentColor" strokeWidth="3"/></g></svg>;
  }
  if (index === 1) {
    return <svg className="atlas-wave-visual" viewBox="0 0 360 250" aria-hidden="true"><path className="atlas-wave-current" d="M20 125 H90 L112 72 L139 177 L168 109 H340" fill="none" stroke="currentColor" strokeWidth="3"/><g className="atlas-wave-belt">{[46,106,166,226,286].map((x) => <rect key={x} x={x} y="168" width="36" height="22" fill="currentColor" opacity="0.52" />)}<path d="M12 204 H348" stroke="currentColor" strokeOpacity=".45" strokeWidth="3"/></g><circle cx="112" cy="72" r="5" fill="#e9a35a"/><circle cx="168" cy="109" r="5" fill="#e9a35a"/></svg>;
  }
  if (index === 2) {
    return <svg className="atlas-wave-visual" viewBox="0 0 360 250" aria-hidden="true"><rect x="79" y="42" width="202" height="166" fill="none" stroke="currentColor" strokeWidth="2"/><rect x="136" y="91" width="88" height="68" fill="currentColor" fillOpacity=".13" stroke="currentColor" strokeWidth="2"/>{Array.from({ length: 6 }, (_, item) => <path key={item} className="atlas-wave-circuit" d={`M${95 + item * 34} 42 V20 M${95 + item * 34} 208 V230`} stroke="currentColor" strokeWidth="2" />)}{Array.from({ length: 4 }, (_, item) => <path key={item} className="atlas-wave-circuit" d={`M79 ${72 + item * 35} H48 M281 ${72 + item * 35} H312`} stroke="currentColor" strokeWidth="2" />)}</svg>;
  }
  return <svg className="atlas-wave-visual" viewBox="0 0 360 250" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.4" strokeOpacity=".7">{[[66,116,130,73],[66,116,132,179],[130,73,193,113],[132,179,193,113],[193,113,252,67],[193,113,265,168],[252,67,314,112],[265,168,314,112]].map(([x1,y1,x2,y2], item) => <line className="atlas-wave-neural-link" key={item} x1={x1} y1={y1} x2={x2} y2={y2} />)}</g>{[[66,116],[130,73],[132,179],[193,113],[252,67],[265,168],[314,112]].map(([cx,cy], item) => <circle className="atlas-wave-neural-node" key={item} cx={cx} cy={cy} r={item === 3 ? 8 : 5} fill="currentColor" />)}</svg>;
}

export default function StoryJourney() {
  const wavesRef = useRef<HTMLElement>(null);
  const evidenceRef = useRef<HTMLElement>(null);
  const impactRef = useRef<HTMLElement>(null);
  const actionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeImpact, setActiveImpact] = useState(0);

  useGSAP(() => {
    const panels = gsap.utils.toArray<HTMLElement>('.atlas-wave-panel');
    const navItems = gsap.utils.toArray<HTMLElement>('.atlas-wave-nav-item');
    const marker = wavesRef.current?.querySelector<HTMLElement>('.atlas-wave-marker');
    if (!wavesRef.current || !panels.length || !marker) return;

    if (window.matchMedia('(max-width: 767px)').matches || prefersReducedMotion) return;

    gsap.set(panels, { autoAlpha: 0, x: 28 });
    gsap.set(panels[0], { autoAlpha: 1, x: 0 });
    gsap.set(navItems, { color: '#66818b' });
    gsap.set(navItems[0], { color: '#f2f7f7' });
    const markerPosition = (index: number) => {
      const year = navItems[index].querySelector<HTMLElement>('span');
      const navBounds = navItems[index].parentElement?.getBoundingClientRect();
      const yearBounds = year?.getBoundingClientRect();
      if (!navBounds || !yearBounds) return navItems[index].offsetTop + (navItems[index].offsetHeight - marker.offsetHeight) / 2;
      return yearBounds.top - navBounds.top + (yearBounds.height - marker.offsetHeight) / 2;
    };
    gsap.set(marker, { y: markerPosition(0) });

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: wavesRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 3.3}`,
        scrub: 0.85,
        pin: true,
        invalidateOnRefresh: true,
      },
    });

    WAVES.slice(1).forEach((_, item) => {
      const index = item + 1;
      const at = index;
      timeline
        .to(panels[index - 1], { autoAlpha: 0, x: -28, duration: 0.42 }, at - 0.08)
        .to(panels[index], { autoAlpha: 1, x: 0, duration: 0.42 }, at)
        .to(navItems[index - 1], { color: '#66818b', duration: 0.32 }, at)
        .to(navItems[index], { color: '#f2f7f7', duration: 0.32 }, at)
        .to(marker, { y: () => markerPosition(index), duration: 0.45 }, at);
    });
  }, { scope: wavesRef, dependencies: [prefersReducedMotion] });

  useGSAP(() => {
    if (prefersReducedMotion || !evidenceRef.current) return;
    ScrollTrigger.batch('.atlas-evidence-item', {
      start: 'top 78%',
      onEnter: (elements) => gsap.fromTo(elements, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.12, ease: 'power3.out', overwrite: true }),
      onLeaveBack: (elements) => gsap.set(elements, { autoAlpha: 0, y: 22 }),
    });
  }, { scope: evidenceRef, dependencies: [prefersReducedMotion] });

  useGSAP(() => {
    if (prefersReducedMotion || !impactRef.current || window.matchMedia('(max-width: 1023px)').matches) return;

    let activeIndex = 0;
    const impactTrigger = ScrollTrigger.create({
      trigger: impactRef.current,
      start: 'top top',
      end: () => `+=${window.innerHeight * (IMPACTS.length - 1) * 1.15}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.45,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      snap: {
        snapTo: 1 / (IMPACTS.length - 1),
        duration: { min: 0.14, max: 0.32 },
        delay: 0.06,
        ease: 'power2.out',
      },
      onUpdate: (self) => {
        const nextIndex = Math.round(self.progress * (IMPACTS.length - 1));
        if (nextIndex === activeIndex) return;
        activeIndex = nextIndex;
        setActiveImpact(nextIndex);
      },
    });

    return () => impactTrigger.kill();
  }, { scope: impactRef, dependencies: [prefersReducedMotion] });

  useGSAP(() => {
    if (prefersReducedMotion || !impactRef.current) return;
    gsap.fromTo(
      '.atlas-impact-panel',
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.46, ease: 'power3.out', overwrite: true },
    );
  }, { scope: impactRef, dependencies: [activeImpact, prefersReducedMotion] });

  useGSAP(() => {
    if (prefersReducedMotion || !actionRef.current) return;
    ScrollTrigger.batch('.atlas-action-item', {
      start: 'top 80%',
      onEnter: (elements) => gsap.fromTo(elements, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out', overwrite: true }),
    });
  }, { scope: actionRef, dependencies: [prefersReducedMotion] });

  return (
    <>
      <section id="waves" ref={wavesRef} className="atlas-wave-stage relative z-10 overflow-hidden">
        <div className="atlas-shell atlas-wave-frame flex min-h-[100dvh] flex-col px-6 pb-7 pt-20 md:px-12 lg:px-16">
          <div className="atlas-wave-topline">
            <div><span className="atlas-section-number">I</span><p className="atlas-eyebrow">Bối cảnh lịch sử</p></div>
            <p>Đi qua bốn làn sóng, câu hỏi không đổi: Việt Nam tham gia đến đâu và làm chủ đến đâu?</p>
          </div>

          <div className="atlas-wave-shell mt-5 grid flex-1 gap-8 border-y border-white/10 py-4 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-10">
            <ol className="atlas-wave-nav relative border-l border-white/10 pl-5">
              <span className="atlas-wave-marker" aria-hidden="true" />
              {WAVES.map((wave) => <li key={wave.year} className="atlas-wave-nav-item"><span>{wave.year}</span><strong>{wave.label}</strong></li>)}
            </ol>
            <div className="atlas-wave-content relative">
              {WAVES.map((wave, index) => {
                const Icon = wave.icon;
                return (
                  <article key={wave.year} className="atlas-wave-panel" data-wave-index={index}>
                    <div className="atlas-wave-layout grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(13rem,17rem)] lg:items-center">
                      <div>
                        <div className="flex items-center gap-3 text-signal-cyan"><Icon size={19} strokeWidth={1.5} /><span className="font-mono text-[10px] uppercase tracking-[0.18em]">{wave.label} / {wave.year}</span></div>
                        <h3>{wave.title}</h3>
                        <p className="atlas-wave-subtitle">{wave.subtitle}</p>
                        <dl className="atlas-wave-facts">
                          <div><dt>Công nghệ nền tảng</dt><dd>{wave.technology}</dd></div>
                          <div><dt>Cơ chế tác động</dt><dd>{wave.mechanism}</dd></div>
                          <div><dt>Việt Nam ở đâu?</dt><dd>{wave.vietnam}</dd></div>
                          <div className="atlas-wave-lesson"><dt><Landmark size={14} />Bài học</dt><dd>{wave.lesson}</dd></div>
                        </dl>
                      </div>
                      <figure className="atlas-wave-figure"><WaveIllustration index={index} /><figcaption>Biểu trưng công nghệ của làn sóng {index + 1}</figcaption></figure>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="evidence" ref={evidenceRef} className="relative z-10 border-y border-white/10 bg-[#0b171d]/72 px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="atlas-shell">
          <div className="atlas-section-heading max-w-4xl">
            <div><span className="atlas-section-number">II</span><p className="atlas-eyebrow">Bằng chứng hiện nay</p></div>
            <h2>Đứt gãy nằm ở khoảng cách giữa tham gia và làm chủ</h2>
            <p>Ba chỉ dấu sau không nhằm phủ nhận tiến bộ của Việt Nam; chúng chỉ ra vị trí cần đầu tư để CMCN 4.0 trở thành động lực CNH-HĐH, thay vì chỉ là công nghệ đi qua nền kinh tế.</p>
          </div>

          <div className="mt-14 grid gap-x-12 divide-y divide-white/10 border-y border-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {EVIDENCE.map((item) => (
              <figure key={item.id} className="atlas-evidence-item py-9 lg:px-8 lg:py-10 first:lg:pl-0 last:lg:pr-0">
                <p className="atlas-eyebrow text-signal-cyan">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                {item.id === 'gii' && <div className="atlas-gii-chart"><div><span>44</span><small>Hạng GII<br />/139</small></div><div className="atlas-rank-pair"><p>Đầu vào <b>50</b></p><p>Đầu ra <b>37</b></p></div></div>}
                {item.id === 'rd' && <div className="atlas-bar-chart"><div><label>Việt Nam <b>0,41%</b></label><i style={{ width: '8.3%' }} /></div><div><label>Trung Quốc <b>2,58%</b></label><i style={{ width: '52.2%' }} /></div><div><label>Hàn Quốc <b>4,94%</b></label><i style={{ width: '100%' }} /></div></div>}
                {item.id === 'researchers' && <div className="atlas-researcher-chart"><div className="atlas-researcher-vn"><b>836</b><span>Việt Nam</span></div><div className="atlas-researcher-kr"><b>9.472</b><span>Hàn Quốc</span></div><small>Nhà nghiên cứu / triệu dân</small></div>}
                <p className="mt-6 text-sm leading-6 text-[#acbdc7]">{item.description}</p>
                <figcaption><strong>Hàm ý</strong><span>{item.implication}</span></figcaption>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#718994]">{item.source}</p>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="impacts" ref={impactRef} className="atlas-impact-stage relative z-10 px-6 md:px-12 lg:px-16">
        <div className="atlas-shell atlas-impact-shell flex min-h-[100dvh] flex-col pb-8 pt-20">
          <div className="atlas-impact-topline">
            <div><span className="atlas-section-number">III</span><p className="atlas-eyebrow">Tác động đến CNH-HĐH</p></div>
            <p>CMCN 4.0 rút ngắn khoảng cách chỉ khi năng lực sản xuất, dữ liệu và con người được nâng lên cùng nhau.</p>
          </div>
          <div className="atlas-impact-layout mt-5 grid flex-1 gap-8 border-y border-white/10 py-4 lg:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.28fr)] lg:gap-14">
            <div className="atlas-impact-wheel-wrap">
              <OptionWheel
                items={IMPACTS.map((impact) => ({ label: impact.wheelLabel, value: impact.number }))}
                defaultSelected={activeImpact}
                onChange={(_, index) => setActiveImpact(index)}
                className="atlas-impact-wheel"
                activeColor="#f2f7f7"
                textColor="#78909a"
                fontSize={1}
                spacing={3.25}
                curve={0.52}
                tilt={5.5}
                blur={0.45}
                fade={0.24}
                inset={48}
                draggable
              />
            </div>
            <article className="atlas-impact-panel">
              <div className="atlas-impact-panel-header"><span>{IMPACTS[activeImpact].number} / 03</span><p>Điểm đứt gãy</p></div>
              <h2>{IMPACTS[activeImpact].title}</h2>
              <div className="atlas-impact-detail-grid">
                <div><p className="atlas-mini-label">Cơ chế</p><p>{IMPACTS[activeImpact].mechanism}</p></div>
                <div><p className="atlas-mini-label text-[#e9a35a]">Hệ quả</p><p>{IMPACTS[activeImpact].consequence}</p></div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="actions" ref={actionRef} className="relative z-10 border-y border-white/10 bg-[#0b171d]/72 px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="atlas-shell">
          <div className="atlas-section-heading max-w-4xl">
            <div><span className="atlas-section-number">IV</span><p className="atlas-eyebrow">Hướng thu hẹp</p></div>
            <h2>Thu hẹp đứt gãy bằng năng lực đo được, không bằng khẩu hiệu.</h2>
            <p>Giải pháp phải đồng thời tạo tri thức, tạo người, tạo liên kết công nghệ và tạo điều kiện thể chế để công nghệ lan tỏa vào khu vực sản xuất.</p>
          </div>
          <div className="mt-14 grid border-t border-white/15 md:grid-cols-2">
            {ACTIONS.map(({ icon: Icon, ...action }) => (
              <article key={action.number} className="atlas-action-item cursor-target border-b border-white/15 py-8 md:px-9 md:py-10 md:[&:nth-child(odd)]:pr-12 md:[&:nth-child(even)]:border-l md:[&:nth-child(even)]:pl-12">
                <div className="flex items-start gap-4"><span className="mt-1 text-signal-cyan"><Icon size={20} strokeWidth={1.5} /></span><div className="flex-1"><p className="font-mono text-[10px] tracking-[0.18em] text-[#e9a35a]">{action.number}</p><h3>{action.title}</h3><p className="atlas-action-outcome">{action.outcome}</p><ul>{action.actions.map((line) => <li key={line}><Check size={14} />{line}</li>)}</ul></div></div>
              </article>
            ))}
          </div>
          <div className="atlas-conclusion mt-16 grid gap-8 border-t border-white/15 pt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div><p className="atlas-eyebrow">Kết luận</p><p>Đứt gãy công nghệ không phải là số phận. Nó là phép thử về chất lượng chính sách, đầu tư dài hạn và quyết tâm biến công nghệ thành năng lực nội sinh của Việt Nam.</p></div>
            <Link href="/game" className="cursor-target atlas-link-button">Mô phỏng lựa chọn chính sách <ArrowUpRight size={15} /></Link>
          </div>
        </div>
      </section>

      <footer id="sources" className="relative z-10 px-6 py-12 md:px-12 lg:px-16">
        <div className="atlas-shell grid gap-8 border-t border-white/10 pt-8 md:grid-cols-[240px_minmax(0,1fr)]">
          <div><p className="atlas-eyebrow">Nguồn tham khảo</p><p className="mt-3 text-sm leading-6 text-[#91a7b1]">Số liệu được chọn từ nguồn công khai, có thể kiểm tra trực tiếp.</p></div>
          <ul className="grid gap-x-8 gap-y-4 md:grid-cols-2">{SOURCES.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer" className="cursor-target inline-flex items-start gap-2 text-sm leading-6 text-[#b5c6cd] transition-colors hover:text-signal-cyan"><ArrowUpRight className="mt-1 shrink-0" size={14} />{source.author}: {source.title} ({source.year})</a></li>)}</ul>
        </div>
      </footer>
    </>
  );
}
