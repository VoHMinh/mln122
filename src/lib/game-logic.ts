import type { RoundAllocation, RoundHistory, OutcomeType } from '@/types';

// ============================================================
// Core Scoring Formula
// ============================================================

/**
 * Calculate productivity score for a round.
 *
 * Formula:
 *   Score = prevScore
 *         + 0.4 * (innovation / 100)
 *         + 0.3 * (prevEducation / 100)
 *         + 0.3 * (infrastructure / 100)
 *         + 0.2 * (fdi / 100) * (1 - dependencyPenalty)
 *
 * Scaled by 100 for human-readable scores (0 – ~200 range over 4 rounds).
 */
export function calculateProductivity(
  prevScore: number,
  allocation: RoundAllocation,
  prevEducation: number,
  dependencyPenalty: number
): number {
  const { innovation, infrastructure, fdi } = allocation;

  const innovationContrib = 0.4 * (innovation / 100);
  const educationContrib = 0.3 * (prevEducation / 100);
  const infraContrib = 0.3 * (infrastructure / 100);
  const fdiContrib = 0.2 * (fdi / 100) * (1 - dependencyPenalty);

  const roundGain =
    (innovationContrib + educationContrib + infraContrib + fdiContrib) * 100;

  return Math.round((prevScore + roundGain) * 100) / 100;
}

// ============================================================
// Dependency Penalty
// ============================================================

/**
 * Calculate cumulative dependency penalty based on historical allocations.
 *
 * Penalty increases by 0.15 for each past round where:
 *   - FDI allocation > 50 AND Innovation allocation < 20
 *
 * This models the "trap" of over-relying on foreign investment
 * without building domestic innovation capacity.
 *
 * Returns a value between 0 and 1.
 */
export function calculateDependencyPenalty(
  roundHistories: RoundHistory[]
): number {
  let penalty = 0;

  for (const history of roundHistories) {
    const { allocation } = history;
    if (allocation.fdi > 50 && allocation.innovation < 20) {
      penalty += 0.15;
    }
  }

  return Math.min(penalty, 1);
}

// ============================================================
// Outcome Determination
// ============================================================

/** Score thresholds for outcomes */
const LEAPFROG_THRESHOLD = 120;
const DEPENDENT_THRESHOLD = 70;

/**
 * Determine outcome type based on final cumulative score.
 *
 * - LEAPFROG (≥ 120): Successfully built innovation capacity
 * - DEPENDENT (70 – 119): Grew but remained dependent on foreign tech
 * - DISRUPTED (< 70): Failed to adapt, fell behind
 */
export function determineOutcome(
  finalScore: number,
  autonomyIndex = 0,
  locksDependent = false,
): OutcomeType {
  if (!locksDependent && finalScore >= LEAPFROG_THRESHOLD && autonomyIndex >= 18) return 'LEAPFROG';
  if (finalScore >= DEPENDENT_THRESHOLD) return 'DEPENDENT';
  return 'DISRUPTED';
}

// ============================================================
// Outcome Messages (Vietnamese)
// ============================================================

const OUTCOME_MESSAGES: Record<OutcomeType, string> = {
  LEAPFROG: 'Đến năm 2030, mô hình của bạn đạt mục tiêu bằng năng lực công nghệ nội sinh: tăng trưởng đi cùng nền R&D, nhân lực và quyền làm chủ công nghệ.',
  DEPENDENT: 'Các chỉ số tăng trưởng đạt yêu cầu, nhưng nền kinh tế vẫn dựa nhiều vào công nghệ và vốn bên ngoài. Tăng trưởng nhanh chưa đồng nghĩa với tự chủ.',
  DISRUPTED: 'Đến năm 2030, mô hình chưa đạt tiêu chí đề ra. Đầu tư không đồng bộ cho nhân lực và R&D khiến khoảng cách công nghệ tiếp tục nới rộng.',
};

/**
 * Get the full Vietnamese outcome message for a given outcome type.
 */
export function getOutcomeMessage(outcomeType: OutcomeType): string {
  return OUTCOME_MESSAGES[outcomeType];
}

// ============================================================
// Feedback Messages (Vietnamese, per-round context)
// ============================================================

/**
 * Generate round-specific feedback based on allocation balance.
 */
export function generateRoundFeedback(
  roundNumber: number,
  allocation: RoundAllocation,
  dependencyPenalty: number
): string {
  const { innovation, education, fdi } = allocation;

  if (dependencyPenalty > 0.3) {
    return `⚠️ Cảnh báo: Sự phụ thuộc FDI đang tích lũy (hệ số phạt: ${(dependencyPenalty * 100).toFixed(0)}%). Cần tăng đầu tư đổi mới sáng tạo.`;
  }

  if (fdi > 60 && innovation < 15) {
    return `Thu hút FDI lớn nhưng đổi mới sáng tạo quá thấp. Rủi ro phụ thuộc công nghệ nước ngoài tăng cao.`;
  }

  if (innovation > 35 && education > 25) {
    return `Chiến lược cân bằng tốt! Đầu tư mạnh vào đổi mới và giáo dục tạo nền tảng phát triển bền vững.`;
  }

  if (education > 40) {
    return `Đầu tư giáo dục mạnh mẽ. Hiệu quả sẽ thể hiện rõ hơn ở các vòng tiếp theo nhờ nhân lực chất lượng cao.`;
  }

  const roundContexts = [
    'Nền nhân lực và hạ tầng đầu kỳ quyết định khả năng hấp thụ công nghệ về sau.',
    'Thu hút vốn chỉ bền vững khi đi cùng liên kết công nghệ và năng lực nội địa.',
    'Cú sốc chuỗi cung ứng làm rõ cái giá của nợ công nghệ và phụ thuộc nhập khẩu.',
    'Chặng nước rút chỉ phát huy nếu năng lực tự chủ đã được tích lũy từ trước.',
  ];

  return roundContexts[roundNumber - 1] ?? 'Tiếp tục cân bằng các yếu tố đầu tư.';
}

// ============================================================
// Reference Trajectories (for comparison chart)
// ============================================================

/**
 * Historical reference trajectories (simplified scores per round)
 * used to compare player performance against real-world models.
 */
export const REFERENCE_TRAJECTORIES = {
  korea: [30, 65, 120, 200],
  china: [20, 45, 90, 155],
  disrupted: [25, 35, 40, 38],
  labels: ['2025-2026', '2026-2027', '2027-2028', '2028-2030'],
};
