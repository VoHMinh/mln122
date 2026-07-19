import type {
  CompleteResponse,
  GameMetrics,
  MetricDelta,
  MetricKey,
  OutcomeType,
  RoundRequest,
  RoundResolution,
  SessionSnapshot,
  ShockId,
  ShockResolution,
  ShockSeverity,
  TurningPoint,
} from '@/types';
import { getPolicyNarrative, SHOCK_CONTENT } from '@/lib/game-content';
import { getPolicyStage } from '@/lib/game-scenarios';

const METRIC_KEYS: MetricKey[] = [
  'productivity',
  'autonomy',
  'absorption',
  'resilience',
];

const INITIAL_METRICS: GameMetrics = {
  productivity: 0,
  autonomy: 0,
  absorption: 8,
  resilience: 16,
  debtOutstanding: 0,
  debtDueNextRound: 0,
  dependencyStreak: 0,
  dependencyPenalty: 0,
};

function round(value: number, precision = 1) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function hashSeed(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function deriveShock(seed: string): { round: number; id: ShockId } {
  const hash = hashSeed(seed);
  const ids: ShockId[] = ['TALENT_DRAIN', 'CYBER_DISRUPTION', 'FDI_REPRICING'];
  return {
    round: 2 + (hash % 2),
    id: ids[(hash >>> 3) % ids.length],
  };
}

export function createInitialSession(
  sessionId: string,
  roomId: string,
  nickname: string,
  groupName: string,
  roomSeed: string,
): SessionSnapshot {
  const shock = deriveShock(roomSeed);
  return {
    sessionId,
    roomId,
    nickname,
    groupName,
    readiness: 'ONBOARDING',
    joinedAt: new Date().toISOString(),
    currentRound: 1,
    stateVersion: 1,
    budgetForRound: 100,
    pendingEducationShare: 0,
    metrics: { ...INITIAL_METRICS },
    histories: [],
    shockRound: shock.round,
    shockId: shock.id,
    completed: false,
    locksDependent: false,
    finalResult: null,
  };
}

function resolveShock(
  id: ShockId,
  metrics: GameMetrics,
): { resolution: ShockResolution; productivityDelta: number; resilienceDelta: number } {
  let protection = 0;
  if (id === 'TALENT_DRAIN') protection = metrics.absorption;
  if (id === 'CYBER_DISRUPTION') protection = metrics.resilience;
  if (id === 'FDI_REPRICING') protection = metrics.autonomy;

  const severity: ShockSeverity =
    protection >= 26 ? 'LOW' : protection >= 16 ? 'MEDIUM' : 'HIGH';
  const productivityDelta = severity === 'LOW' ? -1.5 : severity === 'MEDIUM' ? -3.5 : -6;
  const resilienceDelta = severity === 'LOW' ? -0.5 : severity === 'MEDIUM' ? -2 : -4;
  const content = SHOCK_CONTENT[id];

  return {
    productivityDelta,
    resilienceDelta,
    resolution: {
      id,
      severity,
      title: content.title,
      briefing: content.briefing,
      impact:
        severity === 'LOW'
          ? 'Nền tảng đã tích lũy hấp thụ phần lớn cú sốc.'
          : severity === 'MEDIUM'
            ? 'Cú sốc làm chậm tiến độ nhưng chưa phá vỡ quỹ đạo.'
            : 'Khoảng trống năng lực khiến cú sốc lan trực tiếp vào năng suất.',
      mitigation: content.protectedBy,
    },
  };
}

function dependencyState(
  session: SessionSnapshot,
  request: RoundRequest,
  total: number,
) {
  const dangerous = request.allocation.fdi / total > 0.5 && request.allocation.innovation < 20;
  const streak = dangerous ? session.metrics.dependencyStreak + 1 : 0;
  const penalty =
    streak >= 2
      ? Math.min(0.45, round(session.metrics.dependencyPenalty + 0.15, 2))
      : session.metrics.dependencyPenalty;
  return { dangerous, streak, penalty };
}

export function resolveRound(
  session: SessionSnapshot,
  request: RoundRequest,
): { resolution: RoundResolution; nextSession: SessionSnapshot } {
  if (session.completed) throw new Error('Phiên mô phỏng đã kết thúc.');
  if (request.roundNumber !== session.currentRound) {
    throw new Error(`Giai đoạn ${request.roundNumber} không còn khả dụng.`);
  }
  if (request.stateVersion !== session.stateVersion) {
    throw new Error('Trạng thái đã thay đổi. Hãy tải lại phiên trước khi gửi.');
  }

  const total = Object.values(request.allocation).reduce((sum, value) => sum + value, 0);
  const maxBorrow = Math.floor(session.budgetForRound * 0.5);
  if (request.borrowedAmount < 0 || request.borrowedAmount > maxBorrow) {
    throw new Error(`Khoản vay tối đa của giai đoạn này là ${maxBorrow} RP.`);
  }
  if (Math.abs(total - (session.budgetForRound + request.borrowedAmount)) > 0.01) {
    throw new Error(`Tổng phân bổ phải bằng ${session.budgetForRound + request.borrowedAmount} RP.`);
  }

  const stage = getPolicyStage(request.roundNumber);
  const policy = stage.options.find((option) => option.id === request.eventChoice) ?? stage.options[1];
  const maturedEducation = session.pendingEducationShare * 24;
  const metricsBefore: GameMetrics = {
    ...session.metrics,
    absorption: round(clamp(session.metrics.absorption + maturedEducation)),
    debtDueNextRound: 0,
  };

  const shockEffect =
    request.roundNumber === session.shockRound
      ? resolveShock(session.shockId, metricsBefore)
      : null;
  const dependency = dependencyState(session, request, total);
  const innovationShare = request.allocation.innovation / total;
  const educationShare = request.allocation.education / total;
  const infrastructureShare = request.allocation.infrastructure / total;
  const fdiShare = request.allocation.fdi / total;
  const allocationGain =
    (0.4 * innovationShare +
      0.3 * session.pendingEducationShare +
      0.3 * infrastructureShare +
      0.2 * fdiShare * (1 - dependency.penalty)) *
    100;
  const roundGain = round(
    allocationGain +
      policy.effect.scoreDelta +
      (shockEffect?.productivityDelta ?? 0) -
      request.borrowedAmount * 0.06,
  );
  const productivity = round(Math.max(0, metricsBefore.productivity + roundGain));
  const autonomy = round(
    clamp(
      metricsBefore.autonomy +
        innovationShare * 10 +
        policy.effect.autonomyDelta -
        Math.max(0, dependency.penalty - session.metrics.dependencyPenalty) * 20,
    ),
  );
  const absorption = round(
    clamp(metricsBefore.absorption + (policy.effect.absorptionDelta ?? 0)),
  );
  const resilience = round(
    clamp(
      metricsBefore.resilience +
        infrastructureShare * 8 +
        innovationShare * 4 -
        fdiShare * 2 +
        (policy.effect.resilienceDelta ?? 0) +
        (shockEffect?.resilienceDelta ?? 0),
    ),
  );

  const policyDebt = policy.effect.debtDelta ?? 0;
  const newPrincipal = request.borrowedAmount + policyDebt;
  const newDebtDue = round(newPrincipal * 1.2);
  const isLastRound = request.roundNumber === 4;
  const grossNextBudget = 100 + Math.floor(productivity / 10);
  const repaymentCapacity = Math.max(0, grossNextBudget - 50);
  const unpaidNewDebt = isLastRound
    ? newDebtDue
    : Math.max(0, newDebtDue - repaymentCapacity);
  const nextBudget = isLastRound ? 0 : Math.max(50, Math.floor(grossNextBudget - newDebtDue));
  const debtOutstanding = round(session.metrics.debtOutstanding + unpaidNewDebt);

  const metricsAfter: GameMetrics = {
    productivity,
    autonomy,
    absorption,
    resilience,
    debtOutstanding,
    debtDueNextRound: isLastRound ? 0 : newDebtDue,
    dependencyStreak: dependency.streak,
    dependencyPenalty: dependency.penalty,
  };

  const effectCodes: string[] = [];
  if (maturedEducation > 0) effectCodes.push('EDUCATION_MATURED');
  if (dependency.dangerous && dependency.streak === 1) effectCodes.push('DEPENDENCY_WARNING');
  if (dependency.streak >= 2) effectCodes.push('DEPENDENCY_TRIGGERED');
  if (newDebtDue > 0) effectCodes.push('TECH_DEBT_CREATED');
  if (debtOutstanding > 0) effectCodes.push('TECH_DEBT_CARRIED');
  if (shockEffect) effectCodes.push(`SHOCK_${shockEffect.resolution.severity}`);
  if (policy.effect.locksDependent) effectCodes.push('DEPENDENT_OUTCOME_LOCKED');

  const carryOver: RoundResolution['carryOver'] = [];
  if (educationShare > 0) {
    carryOver.push({
      id: 'EDUCATION_MATURING',
      label: 'Nhân lực đang tích lũy',
      value: `+${round(educationShare * 24)} hấp thụ ở vòng sau`,
      tone: 'POSITIVE',
    });
  }
  if (newDebtDue > 0) {
    carryOver.push({
      id: 'DEBT_DUE',
      label: 'Nghĩa vụ kỳ sau',
      value: `${newDebtDue} RP`,
      tone: 'WARNING',
    });
  }
  if (dependency.streak > 0) {
    carryOver.push({
      id: 'DEPENDENCY_RISK',
      label: 'Chuỗi phụ thuộc FDI',
      value: `${dependency.streak}/2 vòng`,
      tone: dependency.streak >= 2 ? 'WARNING' : 'NEUTRAL',
    });
  }
  if (policy.effect.locksDependent) {
    carryOver.push({
      id: 'POLICY_LOCK',
      label: 'Trần kết cục',
      value: 'Chưa tự chủ',
      tone: 'WARNING',
    });
  }

  const narrative = getPolicyNarrative(request.roundNumber, request.eventChoice);
  const metricDeltas: MetricDelta[] = METRIC_KEYS.map((key) => ({
    key,
    before: metricsBefore[key],
    after: metricsAfter[key],
    delta: round(metricsAfter[key] - metricsBefore[key]),
  }));

  const resolution: RoundResolution = {
    submissionId: request.submissionId,
    roundNumber: request.roundNumber,
    nextRound: isLastRound ? null : request.roundNumber + 1,
    stateVersion: session.stateVersion + 1,
    roundGain,
    budgetForRound: session.budgetForRound,
    nextBudget,
    allocation: { ...request.allocation },
    borrowedAmount: request.borrowedAmount,
    eventChoice: request.eventChoice,
    metricsBefore,
    metricsAfter,
    metricDeltas,
    effectCodes,
    headline: narrative.headline,
    explanation: narrative.explanation,
    lesson: narrative.lesson,
    carryOver,
    shock: shockEffect?.resolution ?? null,
    locksDependent: session.locksDependent || Boolean(policy.effect.locksDependent),
  };

  const nextSession: SessionSnapshot = {
    ...session,
    currentRound: isLastRound ? 4 : request.roundNumber + 1,
    stateVersion: resolution.stateVersion,
    budgetForRound: nextBudget,
    pendingEducationShare: educationShare,
    metrics: metricsAfter,
    histories: [...session.histories, resolution],
    locksDependent: resolution.locksDependent,
  };

  return { resolution, nextSession };
}

export function determineOutcome(
  finalScore: number,
  autonomy: number,
  locksDependent: boolean,
): OutcomeType {
  if (!locksDependent && finalScore >= 120 && autonomy >= 18) return 'LEAPFROG';
  if (finalScore >= 70 || locksDependent) return 'DEPENDENT';
  return 'DISRUPTED';
}

const OUTCOME_MESSAGES: Record<OutcomeType, string> = {
  LEAPFROG:
    'Năng suất tăng cùng năng lực R&D, nhân lực và quyền làm chủ công nghệ. Đây là quỹ đạo CNH-HĐH có chiều sâu.',
  DEPENDENT:
    'Các chỉ số tăng trưởng đạt yêu cầu, nhưng nền kinh tế vẫn dựa nhiều vào vốn và công nghệ bên ngoài.',
  DISRUPTED:
    'Nguồn lực không được tích lũy đồng bộ, khiến khoảng cách công nghệ tiếp tục kéo dài khi năm 2030 đến.',
};

function buildTurningPoints(session: SessionSnapshot): TurningPoint[] {
  return [...session.histories]
    .map((history) => ({
      roundNumber: history.roundNumber,
      title: history.headline,
      impact: history.explanation,
      magnitude: Math.abs(history.roundGain) +
        history.metricDeltas.reduce((sum, item) => sum + Math.abs(item.delta), 0),
    }))
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, 2);
}

function policyArchetype(session: SessionSnapshot) {
  const totals = session.histories.reduce(
    (acc, history) => ({
      education: acc.education + history.allocation.education,
      innovation: acc.innovation + history.allocation.innovation,
      infrastructure: acc.infrastructure + history.allocation.infrastructure,
      fdi: acc.fdi + history.allocation.fdi,
    }),
    { education: 0, innovation: 0, infrastructure: 0, fdi: 0 },
  );
  const strongest = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (strongest === 'innovation') return 'Kiến trúc sư nội lực';
  if (strongest === 'education') return 'Nhà đầu tư nền tảng';
  if (strongest === 'fdi') return 'Nhà tăng tốc liên kết';
  return 'Nhà kiến tạo hạ tầng';
}

function buildCounterfactual(session: SessionSnapshot) {
  const dependencyRound = session.histories.find((history) =>
    history.effectCodes.includes('DEPENDENCY_TRIGGERED'),
  );
  if (dependencyRound) {
    return `Nếu giảm tỷ trọng FDI hoặc nâng R&D ở giai đoạn ${dependencyRound.roundNumber}, chuỗi phụ thuộc đã có thể bị ngắt trước khi phát sinh hệ số phạt.`;
  }
  const debtRound = session.histories.find((history) => history.borrowedAmount > 0);
  if (debtRound) {
    return `Nếu không vay ở giai đoạn ${debtRound.roundNumber}, ngân sách ngắn hạn nhỏ hơn nhưng không gian chính sách của chặng sau sẽ rộng hơn.`;
  }
  return 'Nếu ưu tiên thêm nhân lực ở giai đoạn đầu, hiệu ứng hấp thụ sẽ xuất hiện sớm hơn và làm cú sốc giữa nhiệm kỳ nhẹ hơn.';
}

export function completeSessionState(session: SessionSnapshot): {
  result: CompleteResponse;
  nextSession: SessionSnapshot;
} {
  const unresolvedDebt =
    session.metrics.debtOutstanding + session.metrics.debtDueNextRound;
  const finalScore = round(Math.max(0, session.metrics.productivity - unresolvedDebt));
  const outcomeType = determineOutcome(
    finalScore,
    session.metrics.autonomy,
    session.locksDependent,
  );
  const result: CompleteResponse = {
    sessionId: session.sessionId,
    nickname: session.nickname,
    groupName: session.groupName,
    finalScore,
    outcomeType,
    outcomeMessage: OUTCOME_MESSAGES[outcomeType],
    scores: session.histories.map((history) => history.metricsAfter.productivity),
    rank: null,
    autonomyIndex: session.metrics.autonomy,
    debtOutstanding: unresolvedDebt,
    policyArchetype: policyArchetype(session),
    turningPoints: buildTurningPoints(session),
    counterfactual: buildCounterfactual(session),
  };
  return {
    result,
    nextSession: { ...session, completed: true, finalResult: result },
  };
}

export const REFERENCE_TRAJECTORIES = {
  korea: [30, 65, 120, 200],
  china: [20, 45, 90, 155],
  disrupted: [25, 35, 40, 38],
  labels: ['2025-2026', '2026-2027', '2027-2028', '2028-2030'],
};
