import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const text = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("the external Codex skills collection is pinned and installed only by opt-in", () => {
  const modules = text("../.gitmodules");
  const docs = text("../CODEX_SKILLS.md");
  const script = text("../scripts/setup-codex-skills.mjs");
  const agents = text("../AGENTS.md");
  const maintenance = text("../MAINTENANCE.md");
  const readme = text("../README.md");
  const pin = "9f954c3b63fda0d1875252009c196bf15072c1ca";
  assert.match(modules, /path = vendor\/codex-skills/);
  assert.match(modules, /url = https:\/\/github\.com\/am-will\/codex-skills\.git/);
  assert.ok(docs.includes(pin));
  assert.ok(script.includes(pin));
  assert.match(agents, /CODEX_SKILLS\.md/);
  assert.match(agents, /npm run check/);
  assert.match(agents, /npm test/);
  assert.match(maintenance, /Retirement checklist/);
  assert.match(readme, /CODEX_SKILLS\.md/);
  for (const file of [agents, maintenance, readme]) {
    assert.doesNotMatch(file, /persian-nlp-github-maintainer/);
  }
  assert.ok(!existsSync(new URL("../.agents/skills/persian-nlp-github-maintainer/SKILL.md", import.meta.url)));
});

test("the release manifest includes every local browser script import", () => {
  const flow = text("../.github/workflows/pages.yml");
  const app = text("../src/app.mjs");
  const tools = text("../src/tools.mjs");
  const page = text("../index.html");
  const toolsPage = text("../tools.html");

  const imports = [...app.matchAll(/from ["'](\.\/[^"']+\.mjs)["']/g),
                   ...tools.matchAll(/from ["'](\.\/[^"']+\.mjs)["']/g)]
    .map(m => "src/" + m[1].slice(2));
  for (const path of new Set(imports)) {
    assert.ok(existsSync(new URL("../" + path, import.meta.url)), path);
    assert.ok(flow.includes(path), "Missing Pages artifact dependency: " + path);
  }
  assert.match(flow, /cp index\.html tools\.html styles\.css tools\.css unified\.css favicon\.svg _site\//);
  assert.match(flow, /src\/legacy-redirect\.mjs/);
  assert.match(flow, /assets\/fonts\/Vazirmatn-Variable\.woff2/);
  assert.match(flow, /github\.run_attempt/);
  assert.match(page, /src\/app\.mjs/);
  assert.match(page, /src\/tools\.mjs/);
  assert.match(toolsPage, /src\/legacy-redirect\.mjs/);
});

test("public product landing page has no old institutional positioning", () => {
  const page = text("../index.html");
  const readme = text("../README.md");
  assert.doesNotMatch(page, /دانشگاه|دانشجویی|درس پردازش زبان/i);
  assert.doesNotMatch(readme, /university|coursework|class assignments/i);
  assert.match(readme, /MAINTENANCE\.md/);
});
