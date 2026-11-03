import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("WCAG A/AA audit covers analyzer and every specialist workspace", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/tools.html#corpus",
    "/tools.html#hekasreh",
    "/tools.html#medicine",
    "/tools.html#sentiment",
    "/tools.html#poetry",
  ]) {
    await page.goto(path);
    if (path === "/") await page.locator("#sample-btn").click();
    else
      await page.locator('[data-sample="' + path.split("#")[1] + '"]').click();
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      report.violations,
      path +
        ": " +
        JSON.stringify(
          report.violations.map((x) => ({
            id: x.id,
            nodes: x.nodes.map((n) => n.target),
          })),
        ),
    ).toEqual([]);
  }
});

test("320px reflow, reduced motion and long inert input remain usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#main-text").fill("واژه‌".repeat(1000));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.goto("/tools.html#corpus");
  for (const id of ["corpus", "hekasreh", "medicine", "sentiment", "poetry"]) {
    await page.locator(`.tools-index a[href="#${id}"]`).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await expect(page.locator("#" + id)).toBeVisible();
  }
});
