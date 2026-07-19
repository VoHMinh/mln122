// ============================================================
// Event Cards for the Strategy Simulation Game
// Each round corresponds to one industrial revolution wave.
// All text is in Vietnamese with historically accurate content.
// ============================================================

export interface EventCard {
  roundNumber: number;
  waveTitle: string;
  yearRange: string;
  description: string;
  impact: string;
  keyQuestion: string;
}

export const EVENT_CARDS: EventCard[] = [
  {
    roundNumber: 1,
    waveTitle: 'Cách mạng Công nghiệp 1.0 – Kỷ nguyên Cơ giới hóa',
    yearRange: '1784 – 1870',
    description: `Anh Quốc dẫn đầu cuộc cách mạng với máy hơi nước của James Watt, biến đổi ngành dệt may và khai thác mỏ. Năng suất lao động tăng gấp 10 lần. Các nhà máy thay thế xưởng thủ công, đô thị hóa bắt đầu.

Trong khi đó, Việt Nam dưới triều Nguyễn vẫn là nền kinh tế nông nghiệp tự cung tự cấp. Cơ hội tiếp cận công nghệ phương Tây bị hạn chế bởi chính sách bế quan tỏa cảng.`,
    impact: `• Đầu tư Đổi mới cao → Bắt đầu xây dựng nền tảng sản xuất công nghiệp
• Đầu tư Hạ tầng cao → Đường sắt, cảng biển tạo kết nối thương mại
• Đầu tư Giáo dục cao → Đào tạo thợ kỹ thuật cho kỷ nguyên máy móc
• FDI cao → Nhập khẩu công nghệ nhanh nhưng phụ thuộc nước ngoài`,
    keyQuestion:
      'Bạn sẽ phân bổ nguồn lực thế nào để bước vào kỷ nguyên công nghiệp?',
  },
  {
    roundNumber: 2,
    waveTitle: 'Cách mạng Công nghiệp 2.0 – Kỷ nguyên Điện khí hóa',
    yearRange: '1870 – 1969',
    description: `Hoa Kỳ và Đức trỗi dậy với điện khí hóa và sản xuất hàng loạt. Henry Ford phát minh dây chuyền lắp ráp, giảm giá ô tô Ford Model T từ $850 xuống $300. Thép, hóa chất, và viễn thông tạo nên nền kinh tế quy mô.

Việt Nam trải qua thời kỳ thuộc địa Pháp. Thực dân xây dựng đường sắt và cảng biển nhưng phục vụ khai thác tài nguyên, không chuyển giao công nghệ. Chiến tranh kéo dài làm gián đoạn phát triển.`,
    impact: `• Đổi mới cao → Phát triển công nghiệp nhẹ, nội địa hóa sản xuất
• Hạ tầng cao → Hệ thống điện, giao thông hiện đại hóa nền kinh tế
• Giáo dục cao → Đào tạo kỹ sư, nhà khoa học cho tương lai
• FDI cao → Tiếp cận công nghệ nhanh, rủi ro lệ thuộc kinh tế`,
    keyQuestion:
      'Giữa chiến tranh và tái thiết, bạn ưu tiên đầu tư vào đâu?',
  },
  {
    roundNumber: 3,
    waveTitle: 'Cách mạng Công nghiệp 3.0 – Kỷ nguyên Số hóa',
    yearRange: '1969 – 2010',
    description: `Kỷ nguyên bán dẫn, máy tính cá nhân, và Internet. Intel ra mắt vi xử lý đầu tiên (1971), Apple và Microsoft khởi đầu cách mạng PC, World Wide Web (1991) kết nối toàn cầu.

Các "con hổ châu Á" – Hàn Quốc, Đài Loan – đầu tư mạnh vào giáo dục STEM và R&D bán dẫn, chuyển mình từ nước nghèo thành cường quốc công nghệ. Hàn Quốc nâng R&D từ 0.4% lên 3% GDP.

Việt Nam thực hiện Đổi Mới (1986), mở cửa nền kinh tế. Thu hút FDI bắt đầu, ngành CNTT manh nha phát triển.`,
    impact: `• Đổi mới cao → Xây dựng ngành công nghệ nội địa, startup phần mềm
• Giáo dục cao → Đào tạo hàng nghìn kỹ sư CNTT – hiệu quả lâu dài
• Hạ tầng cao → Mạng viễn thông, Internet phủ sóng toàn quốc
• FDI cao → Samsung, Intel đặt nhà máy – nhưng giá trị gia tăng thấp`,
    keyQuestion:
      'Đây là vòng then chốt – Hàn Quốc đã chọn R&D. Bạn chọn gì?',
  },
  {
    roundNumber: 4,
    waveTitle: 'Cách mạng Công nghiệp 4.0 – Kỷ nguyên AI & Dữ liệu',
    yearRange: '2010 – nay',
    description: `Trí tuệ nhân tạo, dữ liệu lớn, IoT, và blockchain đang tái định hình mọi ngành. ChatGPT (2022) đánh dấu AI bước vào đời sống. Cuộc đua bán dẫn giữa Mỹ và Trung Quốc định hình lại địa chính trị công nghệ.

Việt Nam ban hành Chiến lược CMCN 4.0 (2019), kinh tế số đạt 16.5% GDP. Nhưng thách thức lớn: R&D chỉ 0.43% GDP, 780 nhà nghiên cứu/triệu dân, năng suất lao động bằng 1/3 Thái Lan.

Đây là vòng cuối – mỗi quyết định định hình tương lai thập kỷ tới.`,
    impact: `• Đổi mới cao → Phát triển AI, bán dẫn nội địa, thoát bẫy phụ thuộc
• Giáo dục cao → 100.000 kỹ sư bán dẫn/AI – nền tảng tự chủ công nghệ
• Hạ tầng cao → 5G, trung tâm dữ liệu, cloud – hạ tầng số quốc gia
• FDI cao → Chuỗi cung ứng mới, nhưng cần điều kiện chuyển giao CN`,
    keyQuestion:
      'Cửa sổ cơ hội đang khép lại. Đâu là ưu tiên chiến lược cuối cùng?',
  },
];

// ============================================================
// Allocation Field Labels (Vietnamese)
// ============================================================

export const ALLOCATION_LABELS: Record<string, { label: string; description: string }> = {
  innovation: {
    label: 'Đổi mới Sáng tạo (R&D)',
    description: 'Nghiên cứu & phát triển, đầu tư công nghệ lõi, startup',
  },
  education: {
    label: 'Giáo dục & Nhân lực',
    description: 'Đào tạo STEM, nghiên cứu sinh, kỹ sư chuyên ngành',
  },
  infrastructure: {
    label: 'Hạ tầng',
    description: 'Giao thông, năng lượng, viễn thông, hạ tầng số',
  },
  fdi: {
    label: 'Thu hút FDI',
    description: 'Vốn đầu tư nước ngoài, chuyển giao công nghệ',
  },
};

// ============================================================
// Outcome Type Labels
// ============================================================

export const OUTCOME_LABELS: Record<string, { title: string; emoji: string; color: string }> = {
  LEAPFROG: {
    title: 'Nhảy Vọt',
    emoji: '🚀',
    color: 'var(--signal-cyan)',
  },
  DEPENDENT: {
    title: 'Phụ Thuộc',
    emoji: '⚠️',
    color: 'var(--disruption-amber)',
  },
  DISRUPTED: {
    title: 'Bị Gián Đoạn',
    emoji: '💥',
    color: '#EF4444',
  },
};
