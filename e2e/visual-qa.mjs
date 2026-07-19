import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const viewports = [
  { name: '1440x900', width: 1440, height: 900, mobile: false },
  { name: '1366x768', width: 1366, height: 768, mobile: false },
  { name: '1024x768', width: 1024, height: 768, mobile: false },
  { name: '390x844', width: 390, height: 844, mobile: true },
];

const output = 'test-results/visual-qa';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function dismissShockIfPresent(page) {
  const shockAction = page.getByRole('button', { name: 'Đánh giá lại nguồn lực' });
  const allocation = page.getByRole('heading', { name: 'Phân bổ nguồn lực' });
  await Promise.race([
    shockAction.waitFor({ state: 'visible' }),
    allocation.waitFor({ state: 'visible' }),
  ]);
  if (await shockAction.isVisible()) await shockAction.click();
  await allocation.waitFor();
}

async function completeRound(page, round) {
  await dismissShockIfPresent(page);
  await page.getByRole('button', { name: 'Chia đều' }).click();
  await page.getByRole('button', {
    name: 'Khóa nguồn lực, sang chọn chiến lược',
  }).click();
  await page.locator('.game2-policy-option').nth(1).click();
  await page.getByRole('button', { name: 'Xác nhận chính sách' }).click();
  await page.getByText(`Báo cáo giai đoạn 0${round}`).waitFor();
}

async function assertFullyVisible(locator, viewport, label) {
  const box = await locator.boundingBox();
  if (
    !box ||
    box.x < 0 ||
    box.y < 0 ||
    box.x + box.width > viewport.width + 1 ||
    box.y + box.height > viewport.height + 1
  ) {
    throw new Error(`${viewport.name}: ${label} is clipped: ${JSON.stringify(box)}`);
  }
}

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.mobile,
    hasTouch: viewport.mobile,
  });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto('http://localhost:3000/game');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('button', { name: 'Tạo phòng và tham gia' }).waitFor();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${output}/${viewport.name}-portal.png` });

  await page.getByLabel('Tên hiển thị').fill('Visual QA');
  await page.getByRole('button', { name: 'Tạo phòng và tham gia' }).click();
  await page
    .getByRole('dialog', { name: /Tăng trưởng chỉ có ý nghĩa khi đi cùng nội lực/ })
    .waitFor();
  await page.waitForFunction(() => {
    const board = document.querySelector('.game2-tour-board-content > *');
    const coach = document.querySelector('.game2-tour-coach');
    if (!(board instanceof HTMLElement) || !(coach instanceof HTMLElement)) return false;
    return (
      Number.parseFloat(getComputedStyle(board).opacity) > 0.99 &&
      Number.parseFloat(getComputedStyle(coach).opacity) > 0.99 &&
      coach.getBoundingClientRect().width > 280
    );
  });
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${output}/${viewport.name}-onboarding.png` });
  await page.getByRole('button', { name: 'Bỏ qua hướng dẫn' }).click();
  await page.getByText('Tập hợp đội ngũ trước nhiệm kỳ.').waitFor();
  await page.getByRole('button', { name: 'Bắt đầu phòng' }).click();
  await page.getByRole('button', { name: 'Bắt đầu giai đoạn 1' }).click();
  await page.getByRole('heading', { name: 'Phân bổ nguồn lực' }).waitFor();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${output}/${viewport.name}-allocation.png` });

  await page.getByRole('button', { name: 'Chia đều' }).click();
  await page.getByRole('button', { name: 'Khóa nguồn lực, sang chọn chiến lược' }).click();
  await page.locator('.game2-policy-option').nth(1).click();
  await page.getByRole('button', { name: 'Xác nhận chính sách' }).click();
  await page.getByText('Báo cáo giai đoạn 01').waitFor();
  await page.waitForTimeout(1_200);
  await page.screenshot({ path: `${output}/${viewport.name}-report.png` });

  await page.getByRole('button', { name: 'Sang giai đoạn 2' }).click();
  for (let round = 2; round <= 4; round += 1) {
    await completeRound(page, round);
    await page.getByRole('button', {
      name: round === 4 ? 'Tiến đến năm 2030' : `Sang giai đoạn ${round + 1}`,
    }).click();
  }

  await page.getByRole('button', { name: 'Mở hồ sơ nhiệm kỳ' }).click();
  const conclude = page.getByRole('button', { name: 'Xác định kết cục năm 2030' });
  await conclude.waitFor();
  await assertFullyVisible(conclude, viewport, 'conclusion action');
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${output}/${viewport.name}-debrief.png` });

  await conclude.click();
  const resultAction = page.getByRole('button', { name: 'Xem bảng xếp hạng phòng' });
  await resultAction.waitFor();
  await assertFullyVisible(resultAction, viewport, 'room leaderboard action');
  await page.waitForTimeout(1_000);
  await page.screenshot({ path: `${output}/${viewport.name}-result.png` });

  const overflow = await page.evaluate(() => ({
    horizontal: document.documentElement.scrollWidth - window.innerWidth,
    vertical: document.documentElement.scrollHeight - window.innerHeight,
    chartTickOverlap: [...document.querySelectorAll('.recharts-xAxis .recharts-cartesian-axis-tick text')]
      .map((node) => node.getBoundingClientRect())
      .some((box, index, boxes) => index > 0 && box.left < boxes[index - 1].right),
  }));
  if (
    overflow.horizontal > 1 ||
    overflow.vertical > 1 ||
    overflow.chartTickOverlap ||
    runtimeErrors.length > 0
  ) {
    throw new Error(
      `${viewport.name}: overflow=${JSON.stringify(overflow)}; errors=${runtimeErrors.join(' | ')}`,
    );
  }
  await context.close();
}

await browser.close();
