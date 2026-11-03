import { test, expect } from '@playwright/test';
for (const width of [375, 414, 768, 1024, 1440]) {
  test(`responsive skill acceptance at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/tools.html']) {
      await page.goto(path);
      expect(await page.locator('html').getAttribute('dir')).toBe('rtl');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      for (const button of await page.locator('button:visible').all()) {
        const box = await button.boundingBox();
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    }
  });
}
