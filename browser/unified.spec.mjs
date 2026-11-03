import { test, expect } from "@playwright/test";

const ids = ["analyzer", "compare", "corpus", "hekasreh", "medicine", "sentiment", "poetry"];

test("all seven workspaces are one URL, one document, with accessible hash navigation", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".tools-index a")).toHaveCount(7);
  await expect(page.locator("#analyzer")).toBeVisible();
  await expect(page.locator("#compare")).toBeHidden();
  await page.locator("#main-text").fill("پیش‌نویس کاربر");
  for (const id of ids.slice(1)) {
    await page.locator(`.tools-index a[href="#${id}"]`).click();
    await expect(page.locator("#" + id)).toBeVisible();
    await expect(page.locator('.tools-index a[aria-current]')).toHaveAttribute("href", "#" + id);
    expect(new URL(page.url()).pathname).toBe("/");
    const visible = await page.locator(ids.map(x => "#" + x + ":visible").join(",")).count();
    expect(visible).toBe(1);
  }
  await page.goBack();
  await expect(page.locator("#sentiment")).toBeVisible();
  await page.locator('.tools-index a[href="#analyzer"]').click();
  await expect(page.locator("#main-text")).toHaveValue("پیش‌نویس کاربر");
  expect(errors).toEqual([]);
});

test("legacy toolbox bookmarks reach exact corresponding workspace in the same app", async ({ page }) => {
  await page.goto("/tools.html#medicine");
  await expect(page).toHaveURL(/\/index\.html#medicine$/);
  await expect(page.locator("#medicine")).toBeVisible();
  await expect(page.locator("#analyzer")).toBeHidden();
  await page.goto("/tools.html");
  await expect(page).toHaveURL(/\/index\.html#corpus$/);
  await expect(page.locator("#corpus")).toBeVisible();
});

test("self-hosted Persian typography and styles load from the same origin", async ({ page }) => {
  const failed = [];
  page.on("requestfailed", request => failed.push(request.url()));
  await page.goto("/");
  await expect(page.locator("#main-text")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(family).toContain("Vazirmatn");
  expect(await page.evaluate(() => document.fonts.check('16px Vazirmatn'))).toBe(true);
  expect(failed).toEqual([]);
  const css = await page.request.get("/unified.css");
  const font = await page.request.get("/assets/fonts/Vazirmatn-Variable.woff2");
  expect(css.ok()).toBe(true);
  expect(font.ok()).toBe(true);
  expect(font.headers()["content-type"]).toContain("font/woff2");
});

test("a deep-link into comparison works without a second page or lost content", async ({ page }) => {
  await page.goto("/#compare");
  await expect(page.locator("#compare")).toBeVisible();
  await page.locator("#compare-a").fill("سلام فارسی");
  await page.locator("#compare-b").fill("سلام دنیا");
  await expect(page.locator("#overlap-value")).toHaveText("۳۳٪");
  await page.locator('.nav a[data-workspace="corpus"]').click();
  await expect(page.locator("#corpus")).toBeVisible();
  await page.locator('.tools-index a[href="#compare"]').click();
  await expect(page.locator("#compare-a")).toHaveValue("سلام فارسی");
});
