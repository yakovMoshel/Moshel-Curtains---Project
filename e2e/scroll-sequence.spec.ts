import { expect, test } from "@playwright/test";

test("scroll sequence canvas repaints as the user scrolls", async ({ page }) => {
  await page.goto("/");

  const canvas = page.locator('[data-testid="scroll-sequence-track"] canvas');
  await expect(canvas).toBeVisible();

  // Let the bootstrap frame batch load and the first frame paint.
  await page.waitForTimeout(1500);
  const beforeScroll = await canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL());

  await page.mouse.wheel(0, 3000);
  // Give the GSAP scrub tween and the frame loader time to catch up.
  await page.waitForTimeout(1500);
  const afterScroll = await canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL());

  expect(afterScroll).not.toBe(beforeScroll);
});
