import { expect, test } from "@playwright/test";

test("a single small scroll gesture snaps through a full transition to the next category", async ({
  page,
}) => {
  await page.goto("/");

  const canvas = page.locator('[data-testid="scroll-sequence-track"] canvas');
  await expect(canvas).toBeVisible();

  // Let the bootstrap frame batch load and the first frame paint.
  await page.waitForTimeout(1500);
  const beforeFirstGesture = await canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL());

  // A tiny wheel nudge should still trigger a complete transition to the next stop —
  // not just a small proportional scrub.
  await page.mouse.wheel(0, 20);
  await page.waitForTimeout(1500);
  const afterFirstGesture = await canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL());
  expect(afterFirstGesture).not.toBe(beforeFirstGesture);

  await page.mouse.wheel(0, 20);
  await page.waitForTimeout(1500);
  const afterSecondGesture = await canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL());
  expect(afterSecondGesture).not.toBe(afterFirstGesture);
});
