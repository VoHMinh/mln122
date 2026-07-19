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

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  if (overflow > 1 || runtimeErrors.length > 0) {
    throw new Error(
      `${viewport.name}: overflow=${overflow}; errors=${runtimeErrors.join(' | ')}`,
    );
  }
  await context.close();
}

await browser.close();
