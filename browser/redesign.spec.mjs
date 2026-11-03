import { test, expect } from "@playwright/test";

test("tool navigation preserves input, handles deep links and browser history", async ({
  page,
}) => {
  await page.goto("/tools.html#hekasreh");
  await expect(page.locator("#hekasreh")).toBeVisible();
  await expect(page.locator("#corpus")).toBeHidden();
  await page.locator("#hekasreh-text").fill("خانه ی ما");
  await page.locator('.tools-index a[href="#poetry"]').click();
  await expect(page.locator("#poetry-title")).toBeFocused();
  await page.locator("#poetry-text").fill("هوای بهار\nرسید از کنار");
  await page.goBack();
  await expect(page.locator("#hekasreh-text")).toHaveValue("خانه ی ما");
  await expect(page.locator(".tools-index a[aria-current]")).toHaveAttribute(
    "href",
    "#hekasreh",
  );
  await page.goForward();
  await expect(page.locator("#poetry-text")).toHaveValue(
    "هوای بهار\nرسید از کنار",
  );
  await page.locator('[data-clear="poetry"]').click();
  await expect(page.locator("#poetry-text")).toBeEmpty();
  await expect(page.locator("#poetry-text")).toBeFocused();
});

test("explicit copy uses normalized text and announces success", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await expect(page.locator("#copy-btn")).toBeDisabled();
  await page.locator("#main-text").fill("كتابِ فارسی");
  await page.locator("#copy-btn").click();
  await expect(page.locator("#announcements")).toContainText("کپی شد");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "کتاب فارسی",
  );
  await page.locator("#clear-btn").click();
  await expect(page.locator("#copy-btn")).toBeDisabled();
});

test("a slow local import cannot overwrite newer typed text", async ({
  page,
}) => {
  await page.goto("/tools.html");
  await page.evaluate(() => {
    const original = File.prototype.arrayBuffer;
    File.prototype.arrayBuffer = async function () {
      const value = await original.call(this);
      await new Promise((resolve) => {
        window.finishImport = resolve;
      });
      return value;
    };
  });
  await page
    .locator("#corpus-file")
    .setInputFiles({
      name: "slow.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("متن فایل قدیمی"),
    });
  await expect(page.locator("#corpus-import-status")).toContainText(
    "در حال خواندن",
  );
  await page.locator("#corpus-text").fill("متن تازه کاربر");
  await page.evaluate(() => window.finishImport());
  await expect(page.locator("#corpus-text")).toHaveValue("متن تازه کاربر");
});

test("progressive fallback exposes every tool without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/tools.html");
  for (const id of ["corpus", "hekasreh", "medicine", "sentiment", "poetry"])
    await expect(page.locator("#" + id)).toBeVisible();
  await context.close();
});

test("keyboard tool selection and privacy disclosure are usable", async ({
  page,
}) => {
  await page.goto("/tools.html");
  const link = page.locator('.tools-index a[href="#medicine"]');
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#medicine-title")).toBeFocused();
  await expect(page.locator("#medicine")).toBeVisible();
  await page.locator("#tool-notice summary").click();
  await expect(page.locator("#tool-notice")).toHaveAttribute("open", "");
  await expect(page.locator("#tool-notice")).toContainText(
    "مدل یادگیری ماشین اجرا نمی‌کنند",
  );
});
