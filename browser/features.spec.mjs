import { test, expect } from "@playwright/test";

test("five-tool dashboard is RTL, keyboard accessible, no horizontal scroll", async ({page})=>{
  const errors=[];
  page.on("pageerror",err=>errors.push(err.message));
  await page.goto("/tools.html");
  await expect(page).toHaveTitle(/Persian NLP Studio/);
  expect(await page.locator("html").getAttribute("dir")).toBe("rtl");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await expect(page.locator(".tools-index a")).toHaveCount(5);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  expect(overflow).toBe(false);
  expect(errors).toEqual([]);
});
test("corpus search and bigrams work",async ({page})=>{
  await page.goto("/tools.html");
  await page.locator('[data-sample="corpus"]').click();
  await expect(page.locator("#corpus-count")).toHaveText("۲");
  await expect(page.locator("#corpus-bigrams")).toContainText("زبان فارسی");
  await expect(page.locator("#corpus-contexts .result-item")).toHaveCount(2);
});
test("orthography suggestions are reviews, not unrequested corrections",async ({page})=>{
  await page.goto("/tools.html");
  await page.locator('[data-sample="hekasreh"]').click();
  await expect(page.locator("#hekasreh-count")).toHaveText("۲");
  await expect(page.locator("#hekasreh-results")).toContainText("خانهٔ");
  await expect(page.locator("#hekasreh-text")).toHaveValue(/خانه ی زیبا/);
});
test("medicine lookup supports English and Persian; no treatment advice",async ({page})=>{
  await page.goto("/tools.html");
  await page.locator('[data-sample="medicine"]').click();
  await expect(page.locator("#medicine-results")).toContainText("Paracetamol");
  await page.locator("#medicine-query").fill("متفورمين");
  await expect(page.locator("#medicine-results")).toContainText("Metformin");
  await expect(page.locator(".safety-note")).toContainText("تجویز");
});
test("word sentiment and aspect filter present lexical evidence only",async ({page})=>{
  await page.goto("/tools.html");
  await page.locator('[data-sample="sentiment"]').click();
  await expect(page.locator("#sentiment-evidence")).toContainText("عالی");
  await page.locator("#sentiment-aspect").selectOption("music");
  await expect(page.locator("#sentiment-evidence")).toContainText("ضعیف");
  await expect(page.locator("#sentiment-summary")).toContainText("مدل احساس‌سنجی نیستند");
});
test("poetry structure and endings are calculated from user text",async ({page})=>{
  await page.goto("/tools.html");
  await page.locator('[data-sample="poetry"]').click();
  await expect(page.locator("#poetry-metrics")).toContainText("۴");
  await expect(page.locator("#poetry-endings")).toContainText("ار");
});
test("entered text is never sent outside local origin; HTML stays inert",async ({page})=>{
  const requests=[];
  let dialogs=0;
  page.on("request",r=>requests.push({url:r.url(),method:r.method(),body:r.postData()}));
  page.on("dialog",dialog=>{dialogs++;void dialog.dismiss()});
  await page.goto("/tools.html");
  const script="<img src=x onerror=alert(1)>";
  await page.locator("#corpus-text").fill(script+" سلام");
  await page.locator("#corpus-query").fill(script);
  await expect(page.locator("#corpus-contexts")).toContainText(script);
  await page.locator("#hekasreh-text").fill(script);
  await page.locator("#sentiment-text").fill(script);
  await page.locator("#poetry-text").fill(script);
  expect(dialogs).toBe(0);
  for(const r of requests){
    expect(new URL(r.url).origin).toBe("http://127.0.0.1:8765");
    expect(r.method).toBe("GET");
    expect(r.body).toBeNull();
  }
});
