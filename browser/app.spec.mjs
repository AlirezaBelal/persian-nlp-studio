import { test, expect } from "@playwright/test";

test("Persian RTL interface, normalization and lexical statistics work", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/Persian NLP Studio/);
  expect(await page.locator("html").getAttribute("dir")).toBe("rtl");
  await page.locator("#main-text").fill("كتابِ فارسی؛ کتاب فارسی!");
  await expect(page.locator("#count-words")).toHaveText("۴");
  await expect(page.locator("#count-unique")).toHaveText("۲");
  await expect(page.locator("#normalized-output")).toContainText("کتاب");
  await expect(page.locator("#frequencies")).toContainText("فارسی");
  expect(errors).toEqual([]);
  const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(noOverflow).toBe(true);
});

test("export excludes input text and extracted word lists", async ({ page }) => {
  await page.goto("/");
  const secret = "متن‌محرمانه و اطلاعات‌خصوصی";
  await page.locator("#main-text").fill(secret);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#export-btn").click()
  ]);
  expect(download.suggestedFilename()).toBe("persian-nlp-analysis.json");
  const path = await download.path();
  const fs = await import("node:fs/promises");
  const file = await fs.readFile(path, "utf8");
  const parsed = JSON.parse(file);
  expect(parsed.format).toBe("persian-nlp-studio-metrics-v1");
  expect(parsed.words).toBeGreaterThan(0);
  expect(Object.keys(parsed)).toEqual(expect.arrayContaining(["characters", "uniqueWords", "lines"]));
  expect(Object.keys(parsed)).not.toContain("topWords");
  expect(file).not.toContain("محرمانه");
  expect(file).not.toContain("خصوصی");
});

test("comparison and controls work without sending entered text to a backend", async ({ page }) => {
  const requests = [];
  page.on("request", req => requests.push({ url: req.url(), method: req.method(), postData: req.postData() }));
  await page.goto("/");
  await page.locator('#tool-index a[href="#compare"]').click();
  await page.locator("#compare-a").fill("سلام فارسی");
  await page.locator("#compare-b").fill("سلام دنیا");
  await expect(page.locator("#overlap-value")).toHaveText("۳۳٪");
  await expect(page.locator("#shared-words")).toContainText("سلام");
  await page.locator('#tool-index a[href="#analyzer"]').click();
  await page.locator("#sample-btn").click();
  await expect(page.locator("#count-words")).not.toHaveText("۰");
  await page.locator("#clear-btn").click();
  await expect(page.locator("#count-words")).toHaveText("۰");
  await expect(page.locator("#export-btn")).toBeDisabled();
  for (const r of requests) {
    expect(new URL(r.url).origin).toBe("http://127.0.0.1:8765");
    expect(r.method).toBe("GET");
    expect(r.postData).toBeNull();
  }
});


test("keyboard navigation, focus target and text rendering are safe", async ({ page }) => {
  let dialogs = 0;
  page.on("dialog", dialog => { dialogs += 1; void dialog.dismiss(); });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.locator("#main-text").fill("<script>alert('unexpected')</script> کتاب");
  await expect(page.locator("#normalized-output")).toContainText("<script>");
  expect(dialogs).toBe(0);
});
