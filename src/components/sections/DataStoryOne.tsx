'use client';

import { BrainCircuit, ShieldAlert, TrendingUp } from 'lucide-react';
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal';
import NumberTicker from '@/components/ui/number-ticker';
import RDComparisonChart from '@/components/charts/RDComparisonChart';
import ResearchersChart from '@/components/charts/ResearchersChart';
import SectionReveal from '@/components/ui/SectionReveal';

export default function DataStoryOne() {
  const stickyContent = [
    {
      title: 'Luận điểm: đứt gãy nằm ở độ lệch pha',
      description: (
        <div className="space-y-5">
          <p>
            Với Việt Nam, đứt gãy công nghệ không nên hiểu là đứng ngoài hoàn toàn
            CMCN 4.0. Vấn đề chính là độ lệch giữa tốc độ tham gia chuỗi sản xuất
            và năng lực tự tạo, hấp thụ, cải tiến công nghệ.
          </p>
          <div className="border border-signal-cyan/20 bg-signal-cyan/5 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal-cyan">
              Công thức phân tích
            </p>
            <p className="mt-2 text-sm text-pulse-text">
              CNH-HĐH bền vững = sản xuất hiện đại + R&D nội sinh + nhân lực công nghệ lõi + thể chế dữ liệu.
            </p>
          </div>
        </div>
      ),
      content: (
        <div className="flex h-full w-full flex-col justify-between bg-deep-circuit/70 p-6">
          <div className="flex items-center gap-2 text-signal-cyan">
            <BrainCircuit size={24} />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.14em]">
              Khung đọc vấn đề
            </span>
          </div>
          <div className="space-y-4">
            {['Sản xuất mở rộng', 'R&D chưa đủ sâu', 'Nhân lực nghiên cứu mỏng'].map((item, index) => (
              <div key={item} className="flex items-center gap-3 border border-white/10 bg-white/[0.03] p-3">
                <span className="font-mono text-sm text-copper-trace">0{index + 1}</span>
                <span className="text-sm text-pulse-text">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-xs leading-5 text-muted-steel">
            Đứt gãy là khoảng trống giữa tham gia và làm chủ.
          </p>
        </div>
      ),
    },
    {
      title: 'Mặt sáng: Việt Nam có năng lực bắt nhịp',
      description: (
        <div className="space-y-5">
          <p>
            WIPO xếp Việt Nam hạng{' '}
            <span className="font-mono font-bold text-signal-cyan">
              <NumberTicker value={44} />/139
            </span>{' '}
            trong Global Innovation Index 2025. Việt Nam cũng đứng thứ 2 trong nhóm
            thu nhập trung bình thấp và là một trong các nền kinh tế đổi mới vượt
            kỳ vọng liên tục.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-steel">
                Đầu vào đổi mới
              </p>
              <p className="mt-1 font-mono text-2xl text-copper-trace">50</p>
            </div>
            <div className="border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-steel">
                Đầu ra đổi mới
              </p>
              <p className="mt-1 font-mono text-2xl text-signal-cyan">37</p>
            </div>
          </div>
          <p className="text-xs leading-6 text-muted-steel">
            Điểm mạnh này đáng ghi nhận, nhưng cũng cho thấy bài toán tiếp theo:
            biến kết quả đổi mới thành năng lực công nghệ nội sinh.
          </p>
        </div>
      ),
      content: (
        <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-circuit-surface to-deep-circuit p-6">
          <div className="flex items-center gap-2 text-signal-cyan">
            <TrendingUp size={24} />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.14em]">
              GII 2025
            </span>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-steel">Việt Nam</p>
            <p className="mt-3 font-mono text-6xl font-bold text-signal-cyan">44</p>
            <p className="mt-2 text-sm text-muted-steel">trên 139 nền kinh tế</p>
          </div>
          <p className="text-right text-[11px] text-muted-steel">Nguồn: WIPO GII 2025</p>
        </div>
      ),
    },
    {
      title: 'Nút thắt 1: R&D chưa đủ lực kéo CNH-HĐH',
      description: (
        <div className="space-y-5">
          <p>
            Năm 2023, World Bank ghi nhận chi tiêu R&D của Việt Nam ở mức{' '}
            <span className="font-mono font-bold text-disruption-amber">
              <NumberTicker value={0.41} decimalPlaces={2} />% GDP
            </span>
            . Con số này thấp hơn nhiều so với Trung Quốc 2,58% và Hàn Quốc 4,94%.
          </p>
          <div className="border-l-2 border-disruption-amber/60 bg-disruption-amber/5 p-4">
            <p className="text-sm leading-6 text-pulse-text">
              Tác động: công nghiệp có thể tăng về sản lượng, nhưng khả năng thiết kế
              sản phẩm, sở hữu công nghệ, tạo tiêu chuẩn và giữ giá trị gia tăng cao
              vẫn bị giới hạn.
            </p>
          </div>
        </div>
      ),
      content: (
        <div className="h-full w-full bg-deep-circuit/50 p-4">
          <RDComparisonChart />
        </div>
      ),
    },
    {
      title: 'Nút thắt 2: thiếu mật độ nhân lực nghiên cứu',
      description: (
        <div className="space-y-5">
          <p>
            World Bank ghi nhận Việt Nam có khoảng{' '}
            <span className="font-mono font-bold text-disruption-amber">
              <NumberTicker value={836} />
            </span>{' '}
            nhà nghiên cứu trên một triệu dân năm 2023. Hàn Quốc đạt khoảng{' '}
            <span className="font-mono font-bold text-signal-cyan">
              <NumberTicker value={9472} />
            </span>
            , tức hơn 11 lần.
          </p>
          <p className="text-sm leading-6 text-muted-steel">
            Với CMCN 4.0, khoảng cách nhân lực nghiên cứu không chỉ là chuyện giáo dục;
            nó quyết định khả năng hấp thụ AI, dữ liệu, bán dẫn và tự động hóa vào
            nền sản xuất.
          </p>
        </div>
      ),
      content: (
        <div className="h-full w-full bg-deep-circuit/50 p-4">
          <ResearchersChart />
        </div>
      ),
    },
  ];

  return (
    <section
      id="data-story-1"
      className="relative z-10 w-full border-b border-muted-steel/10 bg-deep-circuit pt-20"
    >
      <div className="mx-auto mb-8 max-w-6xl px-6">
        <SectionReveal className="mb-4">
          <div className="mb-3 flex items-center justify-center gap-2">
            <ShieldAlert className="h-5 w-5 text-copper-trace" />
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-trace">
              Luận điểm dữ liệu
            </span>
          </div>
          <h2 className="headline-xl text-center text-gradient-copper">
            Đứt gãy không nằm ở khẩu hiệu, mà nằm ở năng lực nội sinh
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center font-body text-base leading-7 text-muted-steel md:text-lg">
            Phần này giữ lại các số liệu có nguồn rõ ràng và loại bỏ các nhận định
            khó kiểm chứng, để bài thuyết trình đứng vững trước câu hỏi phản biện.
          </p>
        </SectionReveal>
      </div>

      <StickyScroll
        content={stickyContent}
        contentClassName="rounded-none border-signal-cyan/15"
      />
    </section>
  );
}
