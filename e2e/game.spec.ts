import { expect, test, type Page } from '@playwright/test';

type AllocationTarget =
  | 'Giáo dục & nhân lực'
  | 'R&D & đổi mới sáng tạo'
  | 'Hạ tầng số & công nghiệp'
  | 'FDI & chuyển giao';

const runtimeErrors = new WeakMap<Page, string[]>();
const allocationLabels: AllocationTarget[] = [
  'Giáo dục & nhân lực',
  'R&D & đổi mới sáng tạo',
  'Hạ tầng số & công nghiệp',
  'FDI & chuyển giao',
];

async function enterFirstRound(page: Page) {
  await expect(page.getByRole('button', { name: 'Tạo phòng và tham gia' })).toBeEnabled();
  await page.getByLabel('Tên hiển thị').fill('Minh');
  await page.getByLabel('Lớp / nhóm (tùy chọn)').fill('SE18A01');
  await page.getByRole('button', { name: 'Tạo phòng và tham gia' }).click();
  await expect(page.getByRole('dialog', { name: /Tăng trưởng chỉ có ý nghĩa/ })).toBeVisible();
  await page.getByRole('button', { name: 'Bỏ qua hướng dẫn' }).click();

  await expect(page.getByText('Tập hợp đội ngũ trước nhiệm kỳ.')).toBeVisible();
  await expect(page.getByText('Minh', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Bắt đầu phòng' }).click();

  await expect(page.getByText('Năm 2025. Đồng hồ đã bắt đầu chạy.')).toBeVisible();
  await page.getByRole('button', { name: 'Bắt đầu giai đoạn 1' }).click();
  await expect(page.getByRole('heading', { name: 'Phân bổ nguồn lực' })).toBeVisible();
}

async function allocateAllTo(page: Page, target: AllocationTarget) {
  for (const label of allocationLabels) {
    if (label !== target) await page.getByLabel(label).fill('0');
  }
  const slider = page.getByLabel(target);
  await slider.fill((await slider.getAttribute('max')) ?? '100');
}

async function dismissShockIfPresent(page: Page) {
  const command = page.getByRole('button', { name: 'Đánh giá lại nguồn lực' });
  const allocation = page.getByRole('heading', { name: 'Phân bổ nguồn lực' });
  await Promise.race([
    command.waitFor({ state: 'visible' }),
    allocation.waitFor({ state: 'visible' }),
  ]);
  if (await command.isVisible()) {
    await command.click();
    await expect(allocation).toBeVisible();
  }
}

async function playRound(
  page: Page,
  round: number,
  allocation: AllocationTarget,
  choiceIndex: number,
  borrowMaximum = false,
) {
  await dismissShockIfPresent(page);
  await expect(page.getByRole('heading', { name: 'Phân bổ nguồn lực' })).toBeVisible();
  if (borrowMaximum) {
    await page.getByRole('button', { name: 'Mở tùy chọn vay' }).click();
    const borrowing = page.getByLabel('Khoản vay công nghệ');
    const maximum = Number((await borrowing.getAttribute('max')) ?? '0');
    const step = Number((await borrowing.getAttribute('step')) ?? '1');
    await borrowing.fill(String(Math.floor(maximum / step) * step));
  }
  await allocateAllTo(page, allocation);
  await page.getByRole('button', { name: 'Khóa nguồn lực, sang chọn chiến lược' }).click();
  await page.locator('.game2-policy-option').nth(choiceIndex).click();
  await page.getByRole('button', { name: 'Xác nhận chính sách' }).click();
  await expect(page.getByText(`Báo cáo giai đoạn 0${round}`)).toBeVisible();
  await page.getByRole('button', {
    name: round === 4 ? 'Tiến đến năm 2030' : `Sang giai đoạn ${round + 1}`,
  }).click();
}

async function finishTerm(page: Page) {
  await page.getByRole('button', { name: 'Mở hồ sơ nhiệm kỳ' }).click();
  await page.getByRole('button', { name: 'Xác định kết cục năm 2030' }).click();
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/game');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.afterEach(async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(dimensions.document - dimensions.viewport).toBeLessThanOrEqual(1);
  expect(runtimeErrors.get(page) ?? []).toEqual([]);
});

test('creates a room and reaches the first allocation stage', async ({ page }) => {
  await enterFirstRound(page);
});

test('holds the room request until the onboarding is finished', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Tạo phòng và tham gia' })).toBeEnabled();
  await page.getByLabel('Tên hiển thị').fill('Minh');
  await page.getByLabel('Lớp / nhóm (tùy chọn)').fill('SE18A01');
  await page.getByRole('button', { name: 'Tạo phòng và tham gia' }).click();

  await expect(page.getByText('Tăng trưởng chỉ có ý nghĩa khi đi cùng nội lực.')).toBeVisible();
  await expect(page.getByText('Tập hợp đội ngũ trước nhiệm kỳ.')).not.toBeVisible();
  await expect(page.getByText('01 / 10')).toBeVisible();

  for (let step = 0; step < 9; step += 1) {
    await page.getByRole('button', { name: 'Tiếp theo' }).click();
  }
  await expect(page.getByText('Cả phòng gặp cùng cú sốc, nhưng không chịu cùng thiệt hại.')).toBeVisible();
  await page.getByRole('button', { name: 'Tôi đã hiểu, vào phòng' }).click();

  await expect(page.getByText('Tập hợp đội ngũ trước nhiệm kỳ.')).toBeVisible();
  await expect(page.getByText('Minh', { exact: true })).toHaveCount(1);
});

test('replays the tutorial without changing the current room phase', async ({ page }) => {
  await enterFirstRound(page);
  await page.getByRole('button', { name: 'Mở hướng dẫn' }).click();
  await page.getByRole('button', { name: 'Xem tour tương tác' }).click();
  await expect(page.getByText('Tăng trưởng chỉ có ý nghĩa khi đi cùng nội lực.')).toBeVisible();
  await page.getByRole('button', { name: 'Bỏ qua hướng dẫn' }).click();
  await expect(page.getByRole('heading', { name: 'Phân bổ nguồn lực' })).toBeVisible();
});

test('opens and closes a glossary definition without cursor targeting it', async ({ page, isMobile }) => {
  await enterFirstRound(page);
  const term = page.getByRole('button', { name: /Năng suất/ }).first();
  await expect(term).not.toHaveClass(/game-cursor-target/);

  if (isMobile) {
    await term.click();
    const sheet = page.getByRole('dialog', { name: 'Giải thích: Năng suất' });
    await expect(sheet).toBeVisible();
    await page.getByRole('button', { name: 'Đóng giải thích' }).click();
    await expect(sheet).not.toBeVisible();
    return;
  }

  await term.hover();
  await expect(page.getByRole('tooltip', { name: 'Giải thích: Năng suất' })).toBeVisible();
  await page.mouse.move(10, 10);
  await expect(page.getByRole('tooltip', { name: 'Giải thích: Năng suất' })).not.toBeVisible();
});

test('stops at the round report until the player continues', async ({ page }) => {
  await enterFirstRound(page);
  await page.getByRole('button', { name: 'Chia đều' }).click();
  await page.getByRole('button', { name: 'Khóa nguồn lực, sang chọn chiến lược' }).click();
  await page.locator('.game2-policy-option').nth(1).click();
  await page.getByRole('button', { name: 'Xác nhận chính sách' }).click();

  await expect(page.getByText('Báo cáo giai đoạn 01')).toBeVisible();
  await expect(page.getByRole('button', { name: /Sang giai đoạn 2/ })).toBeVisible();
  await page.waitForTimeout(1_200);
  await expect(page.getByText('Báo cáo giai đoạn 01')).toBeVisible();
});

test('target cursor releases after leaving a command target', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Custom cursor is disabled on coarse pointers.');
  const target = page.getByRole('button', { name: 'Tạo phòng và tham gia' });
  await expect(target).toBeEnabled();
  await target.hover();
  await expect(page.locator('.target-cursor-frame')).toHaveAttribute('data-active', 'true');
  await page.mouse.move(10, 10);
  await expect(page.locator('.target-cursor-frame')).not.toHaveAttribute('data-active', 'true');
});

test('target cursor releases disabled and unmounted targets', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Custom cursor is disabled on coarse pointers.');
  const target = page.getByRole('button', { name: 'Tạo phòng và tham gia' });
  await expect(target).toBeEnabled();
  await target.hover();
  await expect(page.locator('.target-cursor-frame')).toHaveAttribute('data-active', 'true');

  await target.evaluate((element) => element.setAttribute('disabled', ''));
  const box = await target.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2 + 1, box!.y + box!.height / 2);
  await expect(page.locator('.target-cursor-frame')).not.toHaveAttribute('data-active', 'true');

  await target.evaluate((element) => element.removeAttribute('disabled'));
  await page.getByLabel('Tên hiển thị').fill('Minh');
  await target.hover();
  await expect(page.locator('.target-cursor-frame')).toHaveAttribute('data-active', 'true');
  await target.click();
  await expect(page.getByRole('button', { name: 'Bỏ qua hướng dẫn' })).toBeVisible();
  await expect(page.locator('.target-cursor-frame')).not.toHaveAttribute('data-active', 'true');
  await page.getByRole('button', { name: 'Bỏ qua hướng dẫn' }).click();
  await expect(page.getByText('Tập hợp đội ngũ trước nhiệm kỳ.')).toBeVisible();
});

test.describe('deterministic 2030 outcomes', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== 'desktop-1440',
      'Full paths run once; layout coverage runs in the smoke tests.',
    );
  });

  test('reaches the leapfrog outcome through internal capability', async ({ page }) => {
    await enterFirstRound(page);
    await playRound(page, 1, 'R&D & đổi mới sáng tạo', 0);
    await playRound(page, 2, 'R&D & đổi mới sáng tạo', 1);
    await playRound(page, 3, 'R&D & đổi mới sáng tạo', 2);
    await playRound(page, 4, 'R&D & đổi mới sáng tạo', 0);
    await finishTerm(page);
    await expect(page.getByRole('heading', { name: 'Đạt mục tiêu 2030 bằng nội lực' })).toBeVisible();
    await page.getByRole('button', { name: 'Xem bảng xếp hạng phòng' }).click();
    await expect(page.getByRole('heading', { name: 'Bảng xếp hạng phòng.' })).toBeVisible();
    await expect(page.getByText('Minh', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Xem lại kết quả cá nhân' }).click();
    await expect(page.getByRole('heading', { name: 'Đạt mục tiêu 2030 bằng nội lực' })).toBeVisible();
    await page.getByRole('button', { name: 'Về sảnh' }).click();
    await expect(page.getByRole('button', { name: 'Tạo phòng và tham gia' })).toBeVisible();
  });

  test('locks the dependent outcome with option 4C', async ({ page }) => {
    await enterFirstRound(page);
    await playRound(page, 1, 'R&D & đổi mới sáng tạo', 0);
    await playRound(page, 2, 'R&D & đổi mới sáng tạo', 1);
    await playRound(page, 3, 'R&D & đổi mới sáng tạo', 2);
    await playRound(page, 4, 'R&D & đổi mới sáng tạo', 2);
    await finishTerm(page);
    await expect(page.getByRole('heading', { name: 'Về đích nhưng chưa tự chủ' })).toBeVisible();
  });

  test('reaches the disrupted outcome with a fragmented path', async ({ page }) => {
    await enterFirstRound(page);
    await playRound(page, 1, 'FDI & chuyển giao', 2);
    await playRound(page, 2, 'Giáo dục & nhân lực', 2);
    await playRound(page, 3, 'FDI & chuyển giao', 1);
    await playRound(page, 4, 'Giáo dục & nhân lực', 0, true);
    await finishTerm(page);
    await expect(
      page.getByRole('heading', { name: 'Trễ hẹn 2030: đứt gãy công nghệ' }),
    ).toBeVisible();
  });
});
