import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = readFileSync(new URL("../src/app.mjs", import.meta.url), "utf8");
const config = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

test("the UI is an RTL static Persian document with a restrictive CSP", () => {
  assert.match(page, /<html lang="fa" dir="rtl">/);
  assert.match(page, /Content-Security-Policy/);
  assert.match(page, /connect-src 'none'/);
  assert.match(page, /script-src 'self'/);
  assert.doesNotMatch(page, /https?:\/\/[^"'<>]+(?:\.js|\.css)/);
  assert.match(page, /id="main-text"/);
  assert.match(page, /id="compare-a"/);
  assert.match(page, /id="compare-b"/);
});

test("the product does not transmit entered text or bundle a fake model", () => {
  assert.doesNotMatch(script, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/);
  assert.match(script, /exportableMetrics\(latestAnalysis\)/);
  assert.equal(config.private, true);
  assert.equal(Object.keys(config.dependencies ?? {}).length, 0);
});


test("export's source function explicitly allowlists metrics and excludes word frequencies", () => {
  const engine = readFileSync(new URL("../src/engine.mjs", import.meta.url), "utf8");
  const marker = engine.split("export function exportableMetrics")[1];
  assert.ok(marker);
  assert.doesNotMatch(marker, /topWords|rawText|originalText|tokenize\(/);
  assert.match(marker, /Number\.isSafeInteger/);
});

test("five new tools remain self-contained, offline, and accessible", () => {
  const toolsPage = readFileSync(new URL("../tools.html", import.meta.url), "utf8");
  const toolsApp = readFileSync(new URL("../src/tools.mjs", import.meta.url), "utf8");
  const toolEngine = readFileSync(new URL("../src/features.mjs", import.meta.url), "utf8");
  const pagesFlow = readFileSync(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8");
  assert.match(toolsPage, /<html lang="fa" dir="rtl">/);
  assert.match(toolsPage, /connect-src 'none'/);
  assert.match(toolsPage, /id="medicine-query"/);
  assert.match(toolsPage, /id="sentiment-aspect"/);
  assert.match(toolsPage, /id="poetry-text"/);
  assert.match(pagesFlow, /cp index.html tools.html styles.css tools.css/);
  assert.match(pagesFlow, /src\/features.mjs/);
  assert.doesNotMatch(toolsApp, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|innerHTML/);
  assert.doesNotMatch(toolEngine, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/);
});
