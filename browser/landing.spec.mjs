import { test, expect } from "@playwright/test";
const ids = [
  "analyzer",
  "compare",
  "corpus",
  "hekasreh",
  "medicine",
  "sentiment",
  "poetry",
];

test("landing calls to action lead directly into the unified application", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#hero-title")).toContainText("متن‌نما");
  await page.locator(".primary-cta").click();
  await expect(page).toHaveURL(/#analyzer$/);
  await expect(page.locator("#analyzer-title")).toBeFocused();
  await page.locator("#main-text").fill("متن حفظ‌شده");
  await page.locator(".secondary-cta").click();
  await expect(page).toHaveURL(/#features$/);
  await expect(page.locator("#main-text")).toHaveValue("متن حفظ‌شده");
  await expect(page.locator("#how-it-works ol > li")).toHaveCount(3);
});

test("all seven feature cards open exact workspaces without losing inputs", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".feature-card")).toHaveCount(7);
  await page.locator("#main-text").fill("نوشتهٔ خصوصی کاربر");
  for (const id of ids) {
    await page.locator(`.feature-card[href="#${id}"]`).click();
    await expect(page.locator("#" + id)).toBeVisible();
    await expect(page.locator(".tools-index a[aria-current]")).toHaveAttribute(
      "href",
      "#" + id,
    );
    expect(new URL(page.url()).pathname).toBe("/");
  }
  await page.locator('.feature-card[href="#analyzer"]').click();
  await expect(page.locator("#main-text")).toHaveValue("نوشتهٔ خصوصی کاربر");
});

test("creator, contact and footer use only verified identity and real public links", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#creator h2")).toHaveText("دربارهٔ سازنده");
  await expect(page.locator("#creator .creator-name")).toHaveAttribute(
    "href",
    "https://github.com/AlirezaBelal",
  );
  await expect(page.locator("#creator .creator-name")).toContainText(
    "علیرضا بلال",
  );
  await expect(page.locator(".contact-cta")).toHaveAttribute(
    "href",
    "https://alirezabelal.github.io/hi/",
  );
  await expect(page.locator('#contact a[href*="github.com"]')).toHaveCount(0);
  await expect(
    page.locator('#contact form, a[href^="mailto:"], a[href*="t.me/"]'),
  ).toHaveCount(0);
  await expect(page.locator(".footer-bottom")).toContainText(
    "طراحی و توسعه توسط",
  );
  await expect(page.locator(".footer-bottom .copyright")).toHaveText(
    "Copyright © 2026 Alireza Belal · TextNema",
  );
  await expect(page.locator(".footer-bottom .copyright")).toHaveAttribute(
    "lang",
    "en",
  );
  await expect(page.locator(".footer-bottom .copyright")).toHaveAttribute(
    "dir",
    "ltr",
  );
  await expect(page.locator(".footer-bottom .copyright")).not.toContainText(
    /[\u0600-\u06ff]/,
  );
  await expect(page.locator(".footer-bottom a")).toContainText("علیرضا بلال");
  for (const id of ["features", "about", "creator", "privacy", "contact"])
    await expect(page.locator(`.footer-links a[href="#${id}"]`)).toHaveCount(1);
  for (const link of await page.locator('a[target="_blank"]').all()) {
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toHaveAttribute("rel", /noreferrer/);
    await expect(link.locator(".sr-only")).toContainText("زبانهٔ جدید");
  }
});

test("local SVG branding, every fragment and all static assets resolve", async ({
  page,
}) => {
  const failures = [];
  page.on("response", (r) => {
    if (
      new URL(r.url()).origin === "http://127.0.0.1:8765" &&
      r.status() >= 400
    )
      failures.push(r.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  for (const image of await page.locator("img.brand-mark").all())
    expect(
      await image.evaluate((img) => img.complete && img.naturalWidth > 0),
    ).toBe(true);
  const broken = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .map((a) => a.hash.slice(1))
      .filter((id) => !document.getElementById(id)),
  );
  expect(broken).toEqual([]);
  const symbols = await page.request.get("/assets/icons.svg");
  expect(symbols.ok()).toBe(true);
  const source = await symbols.text();
  for (const href of await page
    .locator("svg use")
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href"))))
    expect(source).toContain('id="' + href.split("#")[1] + '"');
  for (const path of [
    "/favicon.svg",
    "/assets/brand/textnema.svg",
    "/assets/fonts/OFL-Vazirmatn.txt",
  ])
    expect((await page.request.get(path)).ok()).toBe(true);
  expect(failures).toEqual([]);
});

test("landing keyboard navigation and in-page links retain the selected workspace", async ({
  page,
}) => {
  await page.goto("/#poetry");
  await page.locator("#poetry-text").fill("بهار آرام");
  await page.locator(".secondary-cta").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#poetry")).toBeVisible();
  await page.locator('.footer-links a[href="#creator"]').click();
  await expect(page.locator("#creator")).toBeInViewport();
  await page.goBack();
  await expect(page.locator("#poetry-text")).toHaveValue("بهار آرام");
  await page.locator(".primary-cta").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#analyzer-title")).toBeFocused();
});
