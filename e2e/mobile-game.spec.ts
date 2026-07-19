import { expect, test, type Locator, type Page } from '@playwright/test';

async function expectReachable(page: Page, action: Locator) {
  await action.scrollIntoViewIfNeeded();
  await expect(action).toBeVisible();
  await expect(action).toBeEnabled();
  const box = await action.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height + 1);
}

async function expectPhaseCanScroll(page: Page) {
  const metrics = await page.locator('.game2-phase > section').evaluate((section) => {
    const element = section as HTMLElement;
    const before = element.scrollTop;
    element.scrollTop = element.scrollHeight;
    const after = element.scrollTop;
    element.scrollTop = before;
    return {
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      moved: after > before,
    };
  });
  if (metrics.scrollHeight > metrics.clientHeight + 1) expect(metrics.moved).toBe(true);
}

async function finishTour(page: Page) {
  for (let step = 0; step < 9; step += 1) {
    const next = page.getByRole('button', { name: 'Tiếp theo' });
    await expectReachable(page, next);
    await next.click();
  }
  const finish = page.getByRole('button', { name: 'Tôi đã hiểu, vào phòng' });
  await expectReachable(page, finish);
  await finish.click();
}

async function finishRound(page: Page, round: number) {
  const shockAction = page.getByRole('button', { name: 'Đánh giá lại nguồn lực' });
  const allocation = page.getByRole('heading', { name: 'Phân bổ nguồn lực' });
  await Promise.race([
    shockAction.waitFor({ state: 'visible' }),
    allocation.waitFor({ state: 'visible' }),
  ]);
  if (await shockAction.isVisible()) {
    await expectReachable(page, shockAction);
    await shockAction.click();
  }

  await allocation.waitFor();
  await expectPhaseCanScroll(page);
  await page.getByRole('button', { name: 'Chia đều' }).tap();
  const lock = page.getByRole('button', {
    name: 'Khóa nguồn lực, sang chọn chiến lược',
  });
  await expectReachable(page, lock);
  await lock.click();

  const option = page.locator('.game2-policy-option').nth(1);
  await option.scrollIntoViewIfNeeded();
  await option.click();
  const submit = page.getByRole('button', { name: 'Xác nhận chính sách' });
  await expectReachable(page, submit);
  await submit.click();

  await page.getByText(`Báo cáo giai đoạn 0${round}`).waitFor();
  await expectPhaseCanScroll(page);
  const continueAction = page.getByRole('button', {
    name: round === 4 ? 'Tiến đến năm 2030' : `Sang giai đoạn ${round + 1}`,
  });
  await expectReachable(page, continueAction);
  await continueAction.click();
}

test('keeps every mobile phase scrollable and every primary action reachable', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Dedicated touch flow only runs in the mobile project.');
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/game');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const create = page.getByRole('button', { name: 'Tạo phòng và xem hướng dẫn' });
  await expect(create).toBeEnabled();

  const accessTabs = page.locator('.game2-segmented button');
  await accessTabs.nth(1).tap();
  await expect(page.getByLabel('Mã phòng', { exact: true })).toBeVisible();
  await page.getByLabel('Mã phòng', { exact: true }).fill('ABC123');
  await accessTabs.nth(0).tap();
  await expect(page.getByLabel('Mã phòng', { exact: true })).toBeHidden();

  await page.getByLabel('Tên phòng').fill('Phòng kiểm thử mobile');
  await page.getByLabel('Tên hiển thị').focus();
  await page.setViewportSize({ width: 360, height: 430 });
  await page.getByLabel('Tên hiển thị').fill('Mobile QA');
  await expectPhaseCanScroll(page);
  await expectReachable(page, create);

  await page.setViewportSize({ width: 360, height: 640 });
  await expectReachable(page, create);
  await create.tap();
  await expect(page.getByRole('dialog', { name: /Tăng trưởng chỉ có ý nghĩa/ })).toBeVisible();
  await finishTour(page);

  const startRoom = page.getByRole('button', { name: 'Bắt đầu phòng' });
  await expectReachable(page, startRoom);
  await startRoom.click();

  const startRound = page.getByRole('button', { name: 'Bắt đầu giai đoạn 1' });
  await expectReachable(page, startRound);
  await startRound.click();

  for (let round = 1; round <= 4; round += 1) {
    await finishRound(page, round);
  }

  const openDebrief = page.getByRole('button', { name: 'Mở hồ sơ nhiệm kỳ' });
  await expectReachable(page, openDebrief);
  await openDebrief.click();

  const conclude = page.getByRole('button', { name: 'Xác định kết cục năm 2030' });
  await expectReachable(page, conclude);
  await conclude.click();

  const leaderboard = page.getByRole('button', { name: 'Xem bảng xếp hạng phòng' });
  await expectReachable(page, leaderboard);
  await leaderboard.click();

  await expect(page.getByRole('heading', { name: 'Bảng xếp hạng phòng.' })).toBeVisible();
  const personalResult = page.getByRole('button', { name: 'Xem lại kết quả cá nhân' });
  await expectReachable(page, personalResult);
  await personalResult.click();

  const leaveResult = page.getByRole('button', { name: 'Về sảnh' });
  await expectReachable(page, leaveResult);
  await leaveResult.click();
  await page.goto('/leaderboard');
  await expect(page.getByRole('heading', { name: 'Lịch sử các phòng đã tham gia.' })).toBeVisible();
  await expect(page.getByText('Phòng kiểm thử mobile').first()).toBeVisible();
  await expect(page.getByText('Điểm cá nhân')).toBeVisible();
  await expectReachable(page, page.getByRole('link', { name: 'Trở lại trò chơi' }));
});
