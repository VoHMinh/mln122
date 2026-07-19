import type { PolicyChoice } from '@/types';

export type ChoiceEffect = {
  scoreDelta: number;
  autonomyDelta: number;
  absorptionDelta?: number;
  resilienceDelta?: number;
  debtDelta?: number;
  locksDependent?: boolean;
};

export type PolicyOption = {
  id: PolicyChoice;
  title: string;
  summary: string;
  signal: string;
  effect: ChoiceEffect;
};

export type PolicyStage = {
  round: number;
  period: string;
  yearLabel: string;
  title: string;
  premise: string;
  question: string;
  options: PolicyOption[];
};

export const POLICY_STAGES: PolicyStage[] = [
  {
    round: 1,
    period: '2025-2026',
    yearLabel: 'Khởi hành',
    title: 'Củng cố nền tảng',
    premise:
      'Áp lực chuyển đổi số trong sản xuất tăng nhanh, trong khi thiếu lao động tay nghề cao tại các khu công nghiệp đang là rào cản trước mắt.',
    question: 'Đâu là phản ứng chính sách ưu tiên cho chặng mở đầu?',
    options: [
      {
        id: 'A',
        title: 'Đào tạo nghề kỹ thuật số cấp tốc',
        summary: 'Xây nền nhân lực cho các chặng sau, nhưng hạ tầng giải ngân chậm hơn.',
        signal: 'Ưu tiên năng lực hấp thụ dài hạn',
        effect: { scoreDelta: 2, autonomyDelta: 3, absorptionDelta: 3, resilienceDelta: 1 },
      },
      {
        id: 'B',
        title: 'Nhập dây chuyền tự động hóa',
        summary: 'Tăng công suất sớm để bù thiếu lao động, song làm dày phụ thuộc nhập khẩu.',
        signal: 'Tăng tốc ngắn hạn',
        effect: { scoreDelta: 5, autonomyDelta: -1, resilienceDelta: -2 },
      },
      {
        id: 'C',
        title: 'Giữ ổn định việc làm truyền thống',
        summary: 'Rủi ro thấp trong ngắn hạn, gần như không tạo động lực năng suất mới.',
        signal: 'An toàn nhưng bỏ lỡ cửa sổ',
        effect: { scoreDelta: -2, autonomyDelta: 0, resilienceDelta: -1 },
      },
    ],
  },
  {
    round: 2,
    period: '2026-2027',
    yearLabel: 'Mở rộng',
    title: 'Bứt tốc thu hút đầu tư',
    premise:
      'Dịch chuyển chuỗi cung ứng toàn cầu tạo cơ hội hiếm có để đón dòng vốn công nghệ cao rời các trung tâm sản xuất cũ.',
    question: 'Bạn chọn cách nào để biến dòng vốn thành năng lực của nền kinh tế?',
    options: [
      {
        id: 'A',
        title: 'Mở cửa tối đa cho mọi dòng FDI',
        summary: 'Công suất và vốn vào nhanh, nhưng rủi ro phụ thuộc tăng nếu R&D còn mỏng.',
        signal: 'Tăng trưởng nhanh, rủi ro khóa công nghệ',
        effect: { scoreDelta: 6, autonomyDelta: -3, resilienceDelta: -2 },
      },
      {
        id: 'B',
        title: 'FDI có điều kiện chuyển giao',
        summary: 'Đổi một phần tốc độ lấy đào tạo nhân lực và yêu cầu hợp tác công nghệ.',
        signal: 'Tăng trưởng có liên kết',
        effect: { scoreDelta: 3, autonomyDelta: 4, absorptionDelta: 2, resilienceDelta: 2 },
      },
      {
        id: 'C',
        title: 'Ưu tiên doanh nghiệp trong nước',
        summary: 'Tăng năng lực nội sinh mạnh hơn, nhưng bỏ lỡ một phần dòng vốn ngắn hạn.',
        signal: 'Đầu tư chiều sâu',
        effect: { scoreDelta: 1, autonomyDelta: 6, resilienceDelta: 3 },
      },
    ],
  },
  {
    round: 3,
    period: '2027-2028',
    yearLabel: 'Cú sốc',
    title: 'Thử thách chuỗi cung ứng',
    premise:
      'Một cú sốc chuỗi cung ứng bán dẫn làm chi phí linh kiện tăng vọt và các dòng vốn đầu tư trở nên thận trọng hơn.',
    question: 'Khi nguồn lực bị siết lại, bạn bảo vệ tiến độ hay tái cấu trúc chiến lược?',
    options: [
      {
        id: 'A',
        title: 'Vay vốn quốc tế để giữ tiến độ',
        summary: 'Giữ nhịp đầu tư ngay lập tức, đổi lại khoản nợ công nghệ lớn cho chặng sau.',
        signal: 'Giữ đà bằng đòn bẩy',
        effect: { scoreDelta: 5, autonomyDelta: -1, resilienceDelta: -1, debtDelta: 50 },
      },
      {
        id: 'B',
        title: 'Tạm hoãn một phần kế hoạch',
        summary: 'Tránh nợ mới nhưng mất một phần động lượng phát triển trong giai đoạn nhiễu động.',
        signal: 'Phòng thủ thận trọng',
        effect: { scoreDelta: -1, autonomyDelta: 1, resilienceDelta: 1 },
      },
      {
        id: 'C',
        title: 'Chuyển nguồn lực sang R&D nội địa',
        summary: 'Năng suất ngắn hạn thấp hơn, nhưng mở rộng rõ rệt chỉ số tự chủ công nghệ.',
        signal: 'Tái cấu trúc vì nội lực',
        effect: { scoreDelta: -2, autonomyDelta: 7, resilienceDelta: 4 },
      },
    ],
  },
  {
    round: 4,
    period: '2028-2030',
    yearLabel: 'Nước rút',
    title: 'Nước rút về đích',
    premise:
      'Cuộc đua AI và bán dẫn tăng tốc chưa từng có. Cửa sổ cơ hội để bắt kịp đang khép lại nhanh hơn bất kỳ chặng nào trước đó.',
    question: 'Bạn dùng chặng cuối để củng cố nội lực hay tối đa hóa tốc độ?',
    options: [
      {
        id: 'A',
        title: 'Dồn lực cho R&D và nhân lực AI-bán dẫn',
        summary: 'Chỉ phát huy khi ba chặng trước đã tạo nền tự chủ đủ vững.',
        signal: 'Cửa về đích bằng nội lực',
        effect: { scoreDelta: 4, autonomyDelta: 6, absorptionDelta: 2, resilienceDelta: 3 },
      },
      {
        id: 'B',
        title: 'Giữ chiến lược cân bằng',
        summary: 'Ổn định và ít rủi ro, nhưng trần tự chủ công nghệ vẫn bị giới hạn.',
        signal: 'Về đích an toàn',
        effect: { scoreDelta: 2, autonomyDelta: 2, resilienceDelta: 1, locksDependent: true },
      },
      {
        id: 'C',
        title: 'Tăng tốc bằng chuyển giao từ đối tác',
        summary: 'Điểm ngắn hạn có thể đẹp, nhưng không thay thế được năng lực công nghệ nội sinh.',
        signal: 'Tốc độ đổi lấy quyền làm chủ',
        effect: { scoreDelta: 6, autonomyDelta: -4, resilienceDelta: -3, locksDependent: true },
      },
    ],
  },
];

export const INVESTMENT_AREAS = [
  {
    key: 'education',
    shortLabel: 'Nhân lực',
    label: 'Giáo dục & nhân lực',
    description: 'Tăng hấp thụ từ vòng sau; giảm tổn thương nhân lực.',
    color: '#3cc7bd',
  },
  {
    key: 'innovation',
    shortLabel: 'R&D',
    label: 'R&D & đổi mới sáng tạo',
    description: 'Tăng tự chủ và khả năng làm chủ công nghệ.',
    color: '#e9a35a',
  },
  {
    key: 'infrastructure',
    shortLabel: 'Hạ tầng',
    label: 'Hạ tầng số & công nghiệp',
    description: 'Tăng năng suất hiện tại và sức chống chịu.',
    color: '#7ba7b7',
  },
  {
    key: 'fdi',
    shortLabel: 'FDI',
    label: 'FDI & chuyển giao',
    description: 'Tăng tốc ngắn hạn; quá lệch sẽ tạo phụ thuộc.',
    color: '#a2a7ac',
  },
] as const;

export function getPolicyStage(round: number) {
  return POLICY_STAGES[Math.max(0, Math.min(round - 1, POLICY_STAGES.length - 1))];
}
