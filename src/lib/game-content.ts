import type { PolicyChoice, ShockId } from '@/types';

export const SHOCK_CONTENT: Record<
  ShockId,
  { title: string; briefing: string; protectedBy: string }
> = {
  TALENT_DRAIN: {
    title: 'Làn sóng dịch chuyển nhân lực công nghệ lõi',
    briefing:
      'Nhu cầu kỹ sư AI và bán dẫn trong khu vực tăng đột biến. Doanh nghiệp trong nước bắt đầu mất người ngay khi các dự án mới cần tăng tốc.',
    protectedBy: 'Năng lực hấp thụ và nền đào tạo đã tích lũy',
  },
  CYBER_DISRUPTION: {
    title: 'Gián đoạn hạ tầng dữ liệu diện rộng',
    briefing:
      'Một sự cố an toàn thông tin làm chậm các nền tảng sản xuất số. Những hệ thống thiếu dự phòng chịu tổn thất lớn hơn.',
    protectedBy: 'Sức chống chịu và chất lượng hạ tầng',
  },
  FDI_REPRICING: {
    title: 'Đối tác FDI điều chỉnh cam kết công nghệ',
    briefing:
      'Chi phí vốn tăng khiến các tập đoàn quốc tế thu hẹp phần chuyển giao và ưu tiên các cứ điểm đã có năng lực R&D nội địa.',
    protectedBy: 'Chỉ số tự chủ và liên kết công nghệ nội sinh',
  },
};

type Narrative = {
  headline: string;
  explanation: string;
  lesson: string;
};

const NARRATIVES: Record<number, Record<PolicyChoice, Narrative>> = {
  1: {
    A: {
      headline: 'Nền nhân lực được đặt trước tốc độ.',
      explanation:
        'Đào tạo chưa tạo ra năng suất ngay, nhưng mở một đường hấp thụ công nghệ mạnh hơn cho giai đoạn kế tiếp.',
      lesson:
        'CNH-HĐH có độ trễ: năng lực lao động phải được xây trước khi công nghệ mới trở thành năng suất.',
    },
    B: {
      headline: 'Công suất tăng nhanh, quyền làm chủ tăng chậm.',
      explanation:
        'Dây chuyền nhập khẩu giải quyết thiếu lao động trước mắt nhưng làm nền sản xuất phụ thuộc hơn vào thiết bị và tri thức bên ngoài.',
      lesson:
        'Mua công nghệ có thể rút ngắn thời gian triển khai, nhưng không tự động tạo ra năng lực nội sinh.',
    },
    C: {
      headline: 'Ổn định được giữ lại, cửa sổ nâng cấp bị thu hẹp.',
      explanation:
        'Không tạo thêm rủi ro tức thời, nhưng nền kinh tế bước vào vòng sau với ít năng lực mới để hấp thụ chuyển đổi số.',
      lesson:
        'Không quyết định cũng là một quyết định khi tốc độ thay đổi công nghệ ngày càng nhanh.',
    },
  },
  2: {
    A: {
      headline: 'Dòng vốn đến nhanh hơn năng lực liên kết.',
      explanation:
        'Sản lượng tăng mạnh, nhưng FDI không kèm điều kiện công nghệ làm chuỗi phụ thuộc tiến gần ngưỡng kích hoạt.',
      lesson:
        'FDI chỉ đóng góp chiều sâu cho CNH-HĐH khi tạo liên kết với doanh nghiệp, nhân lực và R&D trong nước.',
    },
    B: {
      headline: 'Tốc độ được đổi lấy chuyển giao có điều kiện.',
      explanation:
        'Dòng vốn không đạt mức tối đa, nhưng đào tạo và hợp tác công nghệ giúp năng suất đi cùng khả năng làm chủ.',
      lesson:
        'Chất lượng liên kết quan trọng hơn số lượng vốn khi mục tiêu là nâng vị trí trong chuỗi giá trị.',
    },
    C: {
      headline: 'Nội lực dày hơn, cơ hội ngắn hạn nhỏ lại.',
      explanation:
        'Doanh nghiệp trong nước có thêm năng lực đổi mới, đổi lại nền kinh tế bỏ lỡ một phần làn sóng dịch chuyển đầu tư.',
      lesson:
        'Tự chủ không đồng nghĩa đóng cửa; bài toán là chọn đúng nhịp mở cửa với sức hấp thụ hiện có.',
    },
  },
  3: {
    A: {
      headline: 'Tiến độ được giữ bằng một nghĩa vụ tương lai.',
      explanation:
        'Vay vốn ngăn cú sốc làm đứt dòng đầu tư, nhưng lãi 20% thu hẹp không gian chính sách của chặng nước rút.',
      lesson:
        'Đòn bẩy chỉ hữu ích khi phần năng lực tạo ra lớn hơn chi phí và khoản nợ phải trả ở giai đoạn sau.',
    },
    B: {
      headline: 'Bảng cân đối an toàn hơn, đà phát triển chậm lại.',
      explanation:
        'Tạm hoãn giúp tránh nợ mới nhưng làm mất một phần động lượng đúng lúc cửa sổ công nghệ đang thu hẹp.',
      lesson:
        'Khả năng chống chịu không chỉ là tránh rủi ro, mà còn là duy trì được đầu tư thiết yếu trong khủng hoảng.',
    },
    C: {
      headline: 'Cú sốc được biến thành một lần tái cấu trúc.',
      explanation:
        'Năng suất ngắn hạn thấp hơn, nhưng nguồn lực chuyển sang R&D giúp nền kinh tế bớt lệ thuộc vào nguồn cung bên ngoài.',
      lesson:
        'Khủng hoảng có thể mở ra thay đổi cấu trúc nếu năng lực nội sinh được coi là một khoản đầu tư, không phải chi phí.',
    },
  },
  4: {
    A: {
      headline: 'Nước rút phát huy nền tảng đã tích lũy.',
      explanation:
        'R&D và nhân lực AI-bán dẫn tạo bước nhảy khi những vòng trước đã hình thành đủ khả năng hấp thụ và tự chủ.',
      lesson:
        'Không thể xây năng lực công nghệ lõi vào phút cuối; chính sách nước rút chỉ mạnh bằng nền móng đi trước.',
    },
    B: {
      headline: 'Nền kinh tế về đích trong giới hạn an toàn.',
      explanation:
        'Chiến lược cân bằng giữ ổn định các chỉ số nhưng không tạo đủ cú hích để đạt mức tự chủ công nghệ cao.',
      lesson:
        'Cân bằng giảm rủi ro, nhưng có thể trở thành một trần phát triển khi cửa sổ bứt phá sắp đóng.',
    },
    C: {
      headline: 'Con số tăng tốc, năng lực nội sinh không theo kịp.',
      explanation:
        'Chuyển giao bên ngoài nâng năng suất cuối kỳ nhưng khóa kết cục ở mức phụ thuộc công nghệ.',
      lesson:
        'Tăng trưởng dựa hoàn toàn vào ngoại lực không đồng nghĩa hoàn thành CNH-HĐH về chiều sâu.',
    },
  },
};

export function getPolicyNarrative(round: number, choice: PolicyChoice) {
  return NARRATIVES[round]?.[choice] ?? NARRATIVES[1].B;
}

