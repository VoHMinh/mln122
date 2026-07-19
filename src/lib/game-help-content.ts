import type { ShockId } from '@/types';

export type GlossaryKey =
  | 'rp'
  | 'productivity'
  | 'autonomy'
  | 'absorption'
  | 'resilience'
  | 'debt'
  | 'innovation'
  | 'fdi'
  | 'dependency'
  | 'educationDelay'
  | 'roundScore';

export type GlossaryEntry = {
  label: string;
  short: string;
  definition: string;
  increase: string;
  benefit: string;
  risk: string;
  formula: string;
};

export const GLOSSARY: Record<GlossaryKey, GlossaryEntry> = {
  rp: {
    label: 'RP - Điểm nguồn lực',
    short: 'Ngân sách bạn phải phân bổ hết trong mỗi giai đoạn.',
    definition:
      'RP là đơn vị ngân sách mô phỏng. RP không phải điểm thắng; nó là nguồn lực để xây năng lực sản xuất, công nghệ và con người.',
    increase:
      'Ngân sách vòng sau bắt đầu từ 100 RP, cộng thêm 1 RP cho mỗi 10 điểm năng suất tích lũy, rồi trừ nghĩa vụ nợ đến hạn.',
    benefit:
      'Phân bổ RP quyết định chỉ số nào được nâng ngay, chỉ số nào phát huy ở vòng sau và chiến lược nào có nền tảng tốt.',
    risk:
      'Bạn phải phân bổ toàn bộ RP trước khi chọn chiến lược. Chia đều chỉ là nút hỗ trợ, không phải phương án tối ưu mặc định.',
    formula: 'Ngân sách mới = max(50, 100 + floor(Năng suất / 10) - Nợ đến hạn).',
  },
  productivity: {
    label: 'Năng suất',
    short: 'Kết quả sản xuất tích lũy và nguồn chính tạo điểm cuối.',
    definition:
      'Năng suất biểu thị mức tăng năng lực tạo ra sản lượng và giá trị trong toàn nhiệm kỳ.',
    increase:
      'Tăng mạnh nhờ R&D, hạ tầng và phần giáo dục đã chín từ vòng trước; FDI cũng tăng năng suất nhưng bị giảm hiệu quả nếu phát sinh phụ thuộc.',
    benefit:
      'Năng suất cao vừa nâng điểm cuối, vừa có thể mở rộng ngân sách cơ sở của giai đoạn tiếp theo.',
    risk:
      'Năng suất cao nhưng tự chủ thấp hoặc còn nhiều nợ vẫn có thể dẫn đến kết cục phụ thuộc.',
    formula:
      'Điểm cuối = max(0, Năng suất tích lũy - Nợ chưa xử lý). Mốc bứt phá cần ít nhất 120 điểm.',
  },
  autonomy: {
    label: 'Tự chủ',
    short: 'Khả năng tự thiết kế, cải tiến và làm chủ công nghệ.',
    definition:
      'Tự chủ đo quyền làm chủ tri thức, thiết kế và công nghệ cốt lõi thay vì chỉ vận hành giải pháp nhập khẩu.',
    increase:
      'Tăng bằng tỷ trọng R&D và các chiến lược chuyển giao có điều kiện, phát triển doanh nghiệp nội địa hoặc đầu tư công nghệ lõi.',
    benefit:
      'Giảm thiệt hại khi FDI thay đổi cam kết và là điều kiện bắt buộc để đạt kết cục bứt phá bằng nội lực.',
    risk:
      'Chuỗi phụ thuộc FDI có thể làm giảm tự chủ; lựa chọn 4B hoặc 4C khóa trần kết cục ở mức chưa tự chủ.',
    formula: 'Bứt phá cần Tự chủ >= 18 và không bị khóa kết cục phụ thuộc.',
  },
  absorption: {
    label: 'Hấp thụ',
    short: 'Khả năng tiếp nhận và biến công nghệ mới thành năng lực thật.',
    definition:
      'Hấp thụ đo khả năng của nhân lực và tổ chức trong việc học, vận hành, cải tiến công nghệ được tiếp nhận.',
    increase:
      'Đầu tư Giáo dục & nhân lực ở vòng này sẽ cộng Hấp thụ vào vòng sau; một số chiến lược đào tạo và chuyển giao cũng cộng trực tiếp.',
    benefit:
      'Giảm thiệt hại của biến cố chảy máu chất xám và giúp nền kinh tế tận dụng công nghệ thay vì chỉ mua thiết bị.',
    risk:
      'Đầu tư giáo dục quá muộn, đặc biệt ở vòng 4, không còn đủ một vòng để phát huy trọn vẹn.',
    formula: 'Hấp thụ vòng sau += 24 x tỷ trọng RP dành cho giáo dục vòng này.',
  },
  resilience: {
    label: 'Chống chịu',
    short: 'Khả năng giữ quỹ đạo khi hạ tầng hoặc chuỗi cung ứng bị sốc.',
    definition:
      'Chống chịu đo mức dự phòng, ổn định và khả năng duy trì đầu tư khi môi trường công nghệ thay đổi đột ngột.',
    increase:
      'Tăng chủ yếu bằng hạ tầng số, một phần nhờ R&D và các chiến lược củng cố nội lực.',
    benefit:
      'Giảm mức độ nghiêm trọng của biến cố gián đoạn dữ liệu và hạn chế mất năng suất giữa nhiệm kỳ.',
    risk:
      'Tỷ trọng FDI cao và một số chiến lược tăng tốc làm suy giảm chống chịu.',
    formula: 'Delta nền = 8 x tỷ trọng Hạ tầng + 4 x tỷ trọng R&D - 2 x tỷ trọng FDI.',
  },
  debt: {
    label: 'Nợ tồn',
    short: 'Nghĩa vụ công nghệ làm hẹp ngân sách và trừ trực tiếp điểm cuối.',
    definition:
      'Nợ tồn là phần nghĩa vụ vay hoặc nợ chính sách chưa được thanh toán bằng ngân sách của các vòng sau.',
    increase:
      'Nợ tăng khi bạn mở tùy chọn vay hoặc chọn chiến lược phát sinh nợ, như giữ tiến độ bằng vốn quốc tế.',
    benefit:
      'Vay tạo thêm RP ngay trong vòng hiện tại, hữu ích khi cần bảo vệ một đầu tư quan trọng.',
    risk:
      'Chỉ được vay tối đa 50% ngân sách cơ sở; kỳ sau phải trả 120%. Nợ còn lại bị trừ khỏi năng suất khi tính điểm cuối.',
    formula: 'Nợ đến hạn vòng sau = 1,2 x (Khoản vay + Nợ do chiến lược).',
  },
  innovation: {
    label: 'R&D',
    short: 'Nghiên cứu và phát triển - động lực chính của năng suất và tự chủ.',
    definition:
      'R&D đại diện cho năng lực nghiên cứu, thiết kế, thử nghiệm và cải tiến công nghệ trong nước.',
    increase:
      'Dành nhiều RP hơn cho R&D và chọn các chiến lược phát triển công nghệ nội địa.',
    benefit:
      'Mỗi 25% ngân sách dành cho R&D tạo khoảng 10 điểm năng suất nền và 2,5 điểm tự chủ trước hiệu ứng chiến lược.',
    risk:
      'R&D dưới 20 RP trong lúc FDI vượt 50% tạo một kỳ rủi ro phụ thuộc.',
    formula: 'Đóng góp năng suất nền = 40 x tỷ trọng R&D.',
  },
  fdi: {
    label: 'FDI',
    short: 'Vốn đầu tư trực tiếp nước ngoài - tăng tốc nhanh nhưng có điều kiện.',
    definition:
      'FDI mô phỏng vốn, dây chuyền và tri thức từ doanh nghiệp nước ngoài đi vào nền kinh tế.',
    increase:
      'Dành RP cho FDI hoặc chọn các chiến lược mở cửa và chuyển giao từ đối tác.',
    benefit:
      'Tạo năng suất ngắn hạn và giúp tận dụng dịch chuyển chuỗi cung ứng.',
    risk:
      'Nếu FDI vượt 50% tổng phân bổ trong khi R&D dưới 20 RP ở hai vòng liên tiếp, hiệu quả FDI bị phạt và tự chủ suy giảm.',
    formula: 'Đóng góp nền = 20 x tỷ trọng FDI x (1 - Hệ số phụ thuộc).',
  },
  dependency: {
    label: 'Hệ số phụ thuộc',
    short: 'Mức phạt khi FDI đi nhanh hơn năng lực R&D nội địa.',
    definition:
      'Hệ số phụ thuộc biểu thị việc sản xuất mở rộng nhưng công nghệ, thiết kế và quyền quyết định vẫn nằm bên ngoài.',
    increase:
      'Một vòng nguy hiểm xảy ra khi FDI > 50% tổng RP và R&D < 20 RP. Hai vòng nguy hiểm liên tiếp kích hoạt mức phạt 15%.',
    benefit:
      'Giữ hệ số ở 0 giúp FDI đóng góp đầy đủ và bảo vệ tự chủ.',
    risk:
      'Mỗi vòng nguy hiểm liên tiếp sau đó cộng thêm 15%, tối đa 45%. Một vòng an toàn ngắt chuỗi cảnh báo nhưng không xóa mức phạt đã tích lũy.',
    formula: 'Kỳ nguy hiểm = FDI / Tổng RP > 50% và R&D < 20 RP.',
  },
  educationDelay: {
    label: 'Độ trễ giáo dục',
    short: 'Đầu tư con người cần một vòng để chuyển thành năng lực hấp thụ.',
    definition:
      'Giáo dục không tạo hiệu quả năng suất tức thời vì đào tạo, tích lũy kỹ năng và thay đổi tổ chức cần thời gian.',
    increase:
      'Đầu tư sớm và đều vào Giáo dục & nhân lực để hiệu ứng chín trước các vòng có biến cố hoặc nước rút.',
    benefit:
      'Tạo Hấp thụ ở vòng kế tiếp và giúp chống biến cố dịch chuyển nhân lực công nghệ lõi.',
    risk:
      'Dồn quá nhiều vào giáo dục ở vòng cuối làm RP bị khóa vào một hiệu ứng không còn thời gian phát huy.',
    formula: 'Giáo dục vòng N tạo Hấp thụ khi giải quyết vòng N + 1.',
  },
  roundScore: {
    label: 'Điểm vòng',
    short: 'Mức năng suất tăng hoặc giảm sau một quyết định hoàn chỉnh.',
    definition:
      'Điểm vòng là tổng tác động của cấu trúc RP, hiệu ứng chiến lược, biến cố và chi phí vay trong giai đoạn đó.',
    increase:
      'Ghép chiến lược với nền năng lực phù hợp, đầu tư R&D/hạ tầng hợp lý và chuẩn bị đúng chỉ số bảo vệ trước biến cố.',
    benefit:
      'Được cộng vào năng suất tích lũy và gián tiếp mở rộng ngân sách vòng sau.',
    risk:
      'Chạy theo điểm vòng cao có thể tạo nợ, giảm tự chủ hoặc khóa kết cục phụ thuộc.',
    formula: 'Điểm vòng = Điểm phân bổ + Hiệu ứng chiến lược + Biến cố - 6% khoản vay.',
  },
};

export const GLOSSARY_ORDER: GlossaryKey[] = [
  'rp',
  'productivity',
  'autonomy',
  'absorption',
  'resilience',
  'debt',
  'innovation',
  'fdi',
  'dependency',
  'educationDelay',
  'roundScore',
];

export type TutorialView = 'MISSION' | 'ALLOCATION' | 'STRATEGY' | 'SHOCKS';

export type TutorialStep = {
  id: string;
  view: TutorialView;
  focusId: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  term?: GlossaryKey;
};

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'mission',
    view: 'MISSION',
    focusId: 'mission',
    eyebrow: 'Nhiệm vụ 2025-2030',
    title: 'Tăng trưởng chỉ có ý nghĩa khi đi cùng nội lực.',
    description:
      'Bạn có bốn giai đoạn để xây năng lực, ứng phó biến cố và đưa Việt Nam đến một trong ba kết cục năm 2030.',
    bullets: [
      'Bứt phá: điểm cuối >= 120, tự chủ >= 18 và không bị khóa.',
      'Phụ thuộc: điểm đủ cao nhưng quyền làm chủ công nghệ còn hạn chế.',
      'Đứt gãy: năng lực và điểm cuối không đủ để giữ quỹ đạo.',
    ],
  },
  {
    id: 'resource-points',
    view: 'ALLOCATION',
    focusId: 'rp',
    eyebrow: 'Ngân sách hành động',
    title: 'RP là nguồn lực, không phải điểm thắng.',
    description:
      'Bạn tự phân bổ toàn bộ RP giữa bốn lĩnh vực. “Chia đều” chỉ là phương án hỗ trợ khi cần thao tác nhanh.',
    bullets: [
      'Không thể sang bước chiến lược nếu còn RP chưa phân bổ.',
      'Năng suất cao có thể tăng ngân sách vòng sau.',
      'Vay thêm RP tạo nghĩa vụ 120% ở vòng kế tiếp.',
    ],
    term: 'rp',
  },
  {
    id: 'productivity',
    view: 'ALLOCATION',
    focusId: 'productivity',
    eyebrow: 'Chỉ số 01',
    title: 'Năng suất là động cơ của điểm cuối.',
    description:
      'R&D, hạ tầng, giáo dục đã chín và FDI cùng tạo năng suất. Đây là chỉ số tích lũy qua bốn vòng.',
    bullets: [
      'Tăng điểm cuối và có thể mở rộng ngân sách.',
      'Bị giảm bởi biến cố, chi phí vay và hệ số phụ thuộc.',
      'Năng suất cao một mình chưa bảo đảm bứt phá.',
    ],
    term: 'productivity',
  },
  {
    id: 'autonomy',
    view: 'ALLOCATION',
    focusId: 'autonomy',
    eyebrow: 'Chỉ số 02',
    title: 'Tự chủ quyết định bạn có thật sự làm chủ công nghệ.',
    description:
      'R&D và lựa chọn chính sách nội lực nâng chỉ số này. Đây là điều kiện phân biệt bứt phá với tăng trưởng phụ thuộc.',
    bullets: [
      'Mốc bứt phá: tự chủ ít nhất 18.',
      'Giảm thiệt hại khi đối tác FDI thay đổi cam kết.',
      'Phụ thuộc FDI và một số chiến lược tăng tốc có thể làm giảm chỉ số.',
    ],
    term: 'autonomy',
  },
  {
    id: 'absorption',
    view: 'ALLOCATION',
    focusId: 'absorption',
    eyebrow: 'Chỉ số 03',
    title: 'Hấp thụ biến công nghệ mua được thành năng lực thật.',
    description:
      'Đầu tư giáo dục vòng này chỉ phát huy ở vòng sau. Vì thế, chuẩn bị nhân lực sớm quan trọng hơn dồn tiền vào phút cuối.',
    bullets: [
      'Giáo dục tạo 24 điểm hấp thụ cho mỗi 100% tỷ trọng ở vòng sau.',
      'Giảm thiệt hại khi xảy ra chảy máu chất xám.',
      'Vòng 4 không còn thời gian cho hiệu ứng giáo dục chín hoàn toàn.',
    ],
    term: 'absorption',
  },
  {
    id: 'resilience',
    view: 'ALLOCATION',
    focusId: 'resilience',
    eyebrow: 'Chỉ số 04',
    title: 'Chống chịu giữ quỹ đạo khi biến cố xuất hiện.',
    description:
      'Hạ tầng là nguồn tăng chính, R&D bổ trợ; tỷ trọng FDI cao có thể làm nền kinh tế dễ tổn thương hơn.',
    bullets: [
      'Giảm thiệt hại của gián đoạn hạ tầng dữ liệu.',
      'Giúp duy trì tiến độ thay vì phải xử lý khủng hoảng.',
      'Biến cố có ba mức: thấp, trung bình và cao.',
    ],
    term: 'resilience',
  },
  {
    id: 'debt',
    view: 'ALLOCATION',
    focusId: 'debt',
    eyebrow: 'Cảnh báo ngân sách',
    title: 'Nợ mua thời gian hôm nay bằng không gian ngày mai.',
    description:
      'Bạn được vay tối đa 50% ngân sách cơ sở. Nghĩa vụ 120% sẽ làm hẹp ngân sách vòng sau và nợ chưa trả bị trừ khỏi điểm cuối.',
    bullets: [
      'Vay 50 RP tạo nghĩa vụ 60 RP.',
      'Một số chiến lược cũng tự phát sinh nợ.',
      'Dùng vay khi lợi ích năng lực lớn hơn chi phí tương lai.',
    ],
    term: 'debt',
  },
  {
    id: 'allocation',
    view: 'ALLOCATION',
    focusId: 'investment-areas',
    eyebrow: 'Bốn đòn bẩy',
    title: 'Mỗi lĩnh vực có một nhịp tác động khác nhau.',
    description:
      'Giáo dục tạo hấp thụ trễ; R&D tăng năng suất và tự chủ; hạ tầng tăng năng suất và chống chịu; FDI tăng tốc nhưng có thể gây phụ thuộc.',
    bullets: [
      'Không có một tỷ lệ đúng cho mọi vòng.',
      'Hãy đọc bối cảnh và chuẩn bị cho điểm yếu hiện tại.',
      'Phân bổ tạo nền; chiến lược ở bước sau quyết định cách dùng nền đó.',
    ],
  },
  {
    id: 'strategy',
    view: 'STRATEGY',
    focusId: 'strategy',
    eyebrow: 'Bước 2 / 2',
    title: 'Chiến lược giống nhau, hậu quả thì không.',
    description:
      'Mỗi vòng có ba lựa chọn A/B/C cố định và mọi người trong phòng nhìn thấy cùng lựa chọn. Kết quả khác nhau vì trạng thái từng người khác nhau.',
    bullets: [
      'Dự báo chỉ cho biết xu hướng, chưa công bố delta chính xác.',
      'FDI > 50% và R&D < 20 RP trong hai vòng liên tiếp kích hoạt phạt 15%.',
      'Lựa chọn 4B hoặc 4C khóa kết cục ở mức phụ thuộc.',
    ],
    term: 'dependency',
  },
  {
    id: 'shocks',
    view: 'SHOCKS',
    focusId: 'shocks',
    eyebrow: 'Biến cố chung',
    title: 'Cả phòng gặp cùng cú sốc, nhưng không chịu cùng thiệt hại.',
    description:
      'Một trong ba biến cố xuất hiện ở vòng 2 hoặc 3 theo roomSeed. Chỉ số bạn đã tích lũy quyết định mức độ nghiêm trọng.',
    bullets: [
      'Chảy máu chất xám được bảo vệ bởi Hấp thụ.',
      'Gián đoạn dữ liệu được bảo vệ bởi Chống chịu.',
      'FDI đổi cam kết được bảo vệ bởi Tự chủ.',
    ],
    term: 'roundScore',
  },
];

export const SHOCK_GUIDE: Array<{
  id: ShockId;
  shortTitle: string;
  defense: string;
  threshold: string;
}> = [
  {
    id: 'TALENT_DRAIN',
    shortTitle: 'Chảy máu chất xám',
    defense: 'Hấp thụ',
    threshold: 'Hấp thụ >= 26 giảm cú sốc xuống mức thấp.',
  },
  {
    id: 'CYBER_DISRUPTION',
    shortTitle: 'Gián đoạn dữ liệu',
    defense: 'Chống chịu',
    threshold: 'Chống chịu >= 26 giảm cú sốc xuống mức thấp.',
  },
  {
    id: 'FDI_REPRICING',
    shortTitle: 'FDI đổi cam kết',
    defense: 'Tự chủ',
    threshold: 'Tự chủ >= 26 giảm cú sốc xuống mức thấp.',
  },
];

