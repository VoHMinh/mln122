// ============================================================
// Data Constants - Technology Disruption in Vietnam
// ============================================================

import type {
  Wave,
  DataHighlight,
  DataDisruption,
  Solution,
  OpportunityOrChallenge,
  Lesson,
  Source,
  ComparisonDataPoint,
} from '@/types';

export const GAME_CONFIG = {
  TOTAL_ROUNDS: 4,
  MIN_ALLOCATION: 0,
  MAX_ALLOCATION: 100,
};

export const WAVES: Wave[] = [
  {
    id: 1,
    name: 'CMCN 1.0',
    year: '1784',
    coreTech: ['Máy hơi nước', 'Cơ giới hóa'],
    leaders: ['Anh'],
    vietnamStatus: 'Nền kinh tế nông nghiệp, tiền công nghiệp',
    iconDescription: 'Máy hơi nước',
  },
  {
    id: 2,
    name: 'CMCN 2.0',
    year: '1870',
    coreTech: ['Điện khí hóa', 'Dây chuyền sản xuất'],
    leaders: ['Mỹ', 'Đức'],
    vietnamStatus: 'Thuộc địa, công nghiệp lệ thuộc',
    iconDescription: 'Dây chuyền điện khí hóa',
  },
  {
    id: 3,
    name: 'CMCN 3.0',
    year: '1969',
    coreTech: ['Máy tính', 'Internet', 'Tự động hóa'],
    leaders: ['Mỹ', 'Nhật Bản', 'Hàn Quốc'],
    vietnamStatus: 'Chiến tranh, tái thiết và Đổi mới',
    iconDescription: 'Máy tính và tự động hóa',
  },
  {
    id: 4,
    name: 'CMCN 4.0',
    year: 'hiện nay',
    coreTech: ['AI', 'Dữ liệu', 'IoT', 'Bán dẫn'],
    leaders: ['Mỹ', 'Trung Quốc', 'Hàn Quốc'],
    vietnamStatus: 'Có cơ hội bắt nhịp, nhưng nền tảng R&D còn mỏng',
    iconDescription: 'Mạng trí tuệ nhân tạo',
  },
];

export const HERO_HEADLINE =
  'Đứt gãy công nghệ tác động thế nào đến CNH-HĐH ở Việt Nam?';

export const HERO_SUBTITLE =
  'Một phân tích về cách CMCN 4.0 vừa mở cửa rút ngắn phát triển, vừa phơi bày khoảng cách R&D, nhân lực nghiên cứu và năng lực làm chủ công nghệ.';

export const HERO_CTA = 'Cuộn để đi qua 4 làn sóng';

export const DISRUPTION_DEFINITION =
  'Đứt gãy công nghệ là trạng thái nền kinh tế không bắt kịp bước nhảy của công nghệ nền tảng, khiến CNH-HĐH bị lệch pha: sản xuất có thể mở rộng, nhưng năng lực sáng tạo, hấp thụ và làm chủ công nghệ không tăng tương ứng.';

export interface WaveCountryDot {
  country: string;
  code: string;
  position: number;
  isVietnam?: boolean;
}

export const WAVE_COUNTRY_DOTS: WaveCountryDot[][] = [
  [
    { country: 'Anh', code: 'UK', position: 0.95 },
    { country: 'Pháp', code: 'FR', position: 0.5 },
  ],
  [
    { country: 'Mỹ', code: 'US', position: 0.95 },
    { country: 'Đức', code: 'DE', position: 0.9 },
    { country: 'Anh', code: 'UK', position: 0.8 },
    { country: 'Nhật', code: 'JP', position: 0.3 },
  ],
  [
    { country: 'Nhật', code: 'JP', position: 0.95 },
    { country: 'Hàn Quốc', code: 'KR', position: 0.85 },
    { country: 'Mỹ', code: 'US', position: 0.9 },
    { country: 'Việt Nam', code: 'VN', position: 0.15, isVietnam: true },
  ],
  [
    { country: 'Mỹ', code: 'US', position: 0.95 },
    { country: 'Trung Quốc', code: 'CN', position: 0.88 },
    { country: 'Hàn Quốc', code: 'KR', position: 0.85 },
    { country: 'Việt Nam', code: 'VN', position: 0.45, isVietnam: true },
  ],
];

export const DATA_HIGHLIGHTS: DataHighlight[] = [
  {
    id: 'gii-rank',
    label: 'Chỉ số Đổi mới sáng tạo toàn cầu',
    value: '44/139',
    description:
      'WIPO xếp Việt Nam hạng 44/139 trong GII 2025, đứng thứ 2 nhóm thu nhập trung bình thấp và là một trong các nền kinh tế đổi mới vượt kỳ vọng liên tục.',
    source: 'WIPO GII 2025',
  },
  {
    id: 'innovation-gap',
    label: 'Đầu vào và đầu ra đổi mới',
    value: '50 -> 37',
    description:
      'GII 2025 ghi nhận đầu vào đổi mới của Việt Nam hạng 50, nhưng đầu ra hạng 37. Đây là tín hiệu tốt, đồng thời cho thấy nền tảng nội sinh cần được củng cố.',
    source: 'WIPO GII 2025',
  },
];

export const DATA_DISRUPTIONS: DataDisruption[] = [
  {
    id: 'rd-spending',
    label: 'Chi tiêu R&D / GDP',
    value: '0,41%',
    description:
      'World Bank ghi nhận Việt Nam chi 0,41456% GDP cho R&D năm 2023, thấp xa so với Trung Quốc 2,58% và Hàn Quốc 4,94%.',
    source: 'World Bank WDI',
  },
  {
    id: 'researchers',
    label: 'Nhà nghiên cứu / triệu dân',
    value: '836',
    description:
      'Năm 2023, Việt Nam có khoảng 836 nhà nghiên cứu trên một triệu dân; Hàn Quốc đạt khoảng 9.472, tức hơn 11 lần.',
    source: 'World Bank WDI',
  },
  {
    id: 'policy-shift',
    label: 'Định hướng chính sách',
    value: 'NQ 57',
    description:
      'Nghị quyết 57-NQ/TW xác định khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số là đột phá quan trọng để tránh nguy cơ tụt hậu.',
    source: 'Cổng Thông tin điện tử Chính phủ',
  },
];

export const RD_SPENDING_DATA: ComparisonDataPoint[] = [
  { country: 'Việt Nam', value: 0.41, color: 'var(--copper-trace)' },
  { country: 'Trung Quốc', value: 2.58, color: 'var(--muted-steel)' },
  { country: 'OECD TB', value: 2.7, color: 'var(--muted-steel)' },
  { country: 'Hàn Quốc', value: 4.94, color: 'var(--signal-cyan)' },
];

export const RD_TARGET_VALUE = 2.0;

export const RESEARCHERS_DATA: ComparisonDataPoint[] = [
  { country: 'Việt Nam', value: 836, color: 'var(--copper-trace)' },
  { country: 'Hàn Quốc', value: 9472, color: 'var(--signal-cyan)' },
];

export const LESSONS: Lesson[] = [
  {
    id: 'industrialization-depth',
    title: 'CNH không thể dừng ở mở rộng nhà máy',
    description:
      'Nếu công nghiệp hóa chủ yếu dựa vào lắp ráp và nhập công nghệ, năng lực sản xuất tăng nhưng năng lực sáng tạo không tăng tương ứng. Đứt gãy xuất hiện khi Việt Nam tham gia chuỗi giá trị nhưng đứng xa các khâu thiết kế, dữ liệu, R&D và tiêu chuẩn công nghệ.',
    example: 'Rủi ro: công nghiệp hóa rộng về quy mô nhưng mỏng về hàm lượng tri thức.',
  },
  {
    id: 'modernization-institutions',
    title: 'HĐH cần thể chế theo kịp dữ liệu và AI',
    description:
      'Hiện đại hóa không chỉ là số hóa thủ tục hay mua phần mềm. Với CMCN 4.0, dữ liệu, an toàn thông tin, tiêu chuẩn AI và năng lực quản trị số quyết định tốc độ khuếch tán năng suất trong toàn nền kinh tế.',
    example: 'Rủi ro: một nhóm doanh nghiệp đi nhanh, phần còn lại bị bỏ lại phía sau.',
  },
  {
    id: 'productive-forces',
    title: 'Mâu thuẫn mới nằm ở lực lượng sản xuất công nghệ cao',
    description:
      'Theo logic kinh tế chính trị, khi lực lượng sản xuất chuyển sang dữ liệu, tự động hóa và tri thức, quan hệ sản xuất, giáo dục, tài chính và chính sách công nghệ cũng phải đổi mới. Nếu không, CMCN 4.0 tạo ra sức ép thay vì động lực.',
    example: 'Trọng tâm: đồng bộ R&D, nhân lực, FDI và thể chế dữ liệu.',
  },
];

export const OPPORTUNITIES: OpportunityOrChallenge[] = [
  {
    id: 'innovation-overperformer',
    title: 'Đổi mới vượt mức kỳ vọng thu nhập',
    description:
      'GII 2025 cho thấy Việt Nam có năng lực tạo đầu ra đổi mới tốt so với nhóm thu nhập trung bình thấp. Đây là nền tảng để rút ngắn khoảng cách nếu đầu tư đúng vào công nghệ lõi.',
    iconName: 'TrendingUp',
  },
  {
    id: 'digital-platforms',
    title: 'Nền tảng số làm giảm một phần rào cản gia nhập',
    description:
      'Doanh nghiệp có thể tiếp cận thị trường, dữ liệu, cloud và tự động hóa nhanh hơn so với các làn sóng công nghiệp trước. Cơ hội này phù hợp với mục tiêu HĐH nếu lan tỏa được sang khu vực doanh nghiệp nội địa.',
    iconName: 'Zap',
  },
  {
    id: 'supply-chain-shift',
    title: 'Tái cấu trúc chuỗi cung ứng công nghệ',
    description:
      'Dịch chuyển chuỗi cung ứng tạo cửa vào các ngành điện tử, bán dẫn, thiết bị số. Nhưng giá trị chỉ tăng bền vững khi Việt Nam tham gia sâu hơn vào thiết kế, kiểm thử, dữ liệu và R&D.',
    iconName: 'Globe2',
  },
];

export const CHALLENGES: OpportunityOrChallenge[] = [
  {
    id: 'low-rd',
    title: 'Nền tảng R&D còn thấp',
    description:
      'Mức chi R&D 0,41% GDP năm 2023 là nút thắt lớn nhất của năng lực công nghệ nội sinh. Không có R&D đủ mạnh, CNH-HĐH dễ phụ thuộc vào công nghệ nhập khẩu.',
    iconName: 'Microscope',
  },
  {
    id: 'researcher-density',
    title: 'Mật độ nhân lực nghiên cứu thấp',
    description:
      '836 nhà nghiên cứu trên một triệu dân tạo khoảng cách lớn với các nền kinh tế đi đầu. Thiếu người làm nghiên cứu khiến khả năng hấp thụ và cải tiến công nghệ bị giới hạn.',
    iconName: 'Users',
  },
  {
    id: 'two-speed-economy',
    title: 'Kinh tế hai tốc độ',
    description:
      'Doanh nghiệp FDI và một số doanh nghiệp công nghệ có thể đi nhanh, trong khi nhiều doanh nghiệp nội địa thiếu vốn, dữ liệu, kỹ năng và tiêu chuẩn quản trị để chuyển đổi.',
    iconName: 'Split',
  },
];

export const SOLUTIONS: Solution[] = [
  {
    id: 'rd-investment',
    title: 'Tăng nội lực R&D',
    description:
      'Chuyển trọng tâm từ ưu đãi sản xuất sang tài trợ nhiệm vụ nghiên cứu có đặt hàng, đo bằng bằng sáng chế, sản phẩm thử nghiệm và năng lực doanh nghiệp nội địa.',
    iconName: 'microscope',
  },
  {
    id: 'core-talent',
    title: 'Nâng nhân lực công nghệ lõi',
    description:
      'Tập trung vào AI, dữ liệu, bán dẫn, tự động hóa và an toàn thông tin; gắn đào tạo đại học với phòng thí nghiệm, doanh nghiệp và chuẩn nghề quốc tế.',
    iconName: 'graduation',
  },
  {
    id: 'conditional-fdi',
    title: 'FDI gắn chuyển giao',
    description:
      'Thu hút FDI có chọn lọc: ưu tiên dự án có trung tâm kỹ thuật, nhà cung ứng nội địa, chương trình đào tạo và hợp tác nghiên cứu với viện trường Việt Nam.',
    iconName: 'handshake',
  },
  {
    id: 'data-ai-institutions',
    title: 'Thể chế dữ liệu và AI',
    description:
      'Xây dựng khung dữ liệu, sandbox, tiêu chuẩn an toàn và cơ chế thử nghiệm để công nghệ mới được triển khai nhanh nhưng vẫn có trách nhiệm.',
    iconName: 'digital',
  },
];

export const CONCLUSION_QUOTE =
  'Đứt gãy công nghệ không phải là số phận. Nó là phép thử về chất lượng chính sách, năng lực đầu tư dài hạn và quyết tâm làm chủ công nghệ.';

export const CONCLUSION_HIGHLIGHT_PHRASES = [
  'không phải là số phận',
  'chất lượng chính sách',
  'đầu tư dài hạn',
  'làm chủ công nghệ',
];

export const SOURCES: Source[] = [
  {
    id: 'wipo-vietnam-2025',
    author: 'WIPO',
    title: 'Global Innovation Index 2025 - Viet Nam profile',
    year: 2025,
    url: 'https://www.wipo.int/gii-ranking/en/viet-nam',
  },
  {
    id: 'wipo-results-2025',
    author: 'WIPO',
    title: 'Global Innovation Index 2025 results',
    year: 2025,
    url: 'https://www.wipo.int/web-publications/global-innovation-index-2025/en/gii-2025-results.html',
  },
  {
    id: 'world-bank-rd',
    author: 'World Bank',
    title: 'Research and development expenditure (% of GDP)',
    year: 2023,
    url: 'https://api.worldbank.org/v2/country/VNM/indicator/GB.XPD.RSDV.GD.ZS',
  },
  {
    id: 'world-bank-researchers',
    author: 'World Bank',
    title: 'Researchers in R&D (per million people)',
    year: 2023,
    url: 'https://api.worldbank.org/v2/country/VNM/indicator/SP.POP.SCIE.RD.P6',
  },
  {
    id: 'nq57',
    author: 'Cổng Thông tin điện tử Chính phủ',
    title: 'Nghị quyết 57-NQ/TW về phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số',
    year: 2024,
    url: 'https://xaydungchinhsach.chinhphu.vn/nghi-quyet-so-57-nq-tw.html',
  },
];

export const NAV_SECTIONS = [
  { id: 'hero', label: 'Mở đầu' },
  { id: 'data-story-1', label: 'Luận điểm' },
  { id: 'mini-game', label: 'Mô phỏng' },
  { id: 'lessons', label: 'Tác động' },
  { id: 'opportunities', label: 'Cơ hội & rủi ro' },
  { id: 'solutions', label: 'Giải pháp' },
  { id: 'conclusion', label: 'Kết luận' },
] as const;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
