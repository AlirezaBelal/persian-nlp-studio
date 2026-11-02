import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const text = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("GitHub skill has discovery metadata and repository scope guardrails", () => {
  const skill = text("../.agents/skills/persian-nlp-github-maintainer/SKILL.md");
  const agents = text("../AGENTS.md");
  assert.match(skill, /^---\s*\nname: persian-nlp-github-maintainer\n/);
  assert.match(skill, /\ndescription: .+\n/);
  assert.match(skill, /AlirezaBelal\/persian-nlp-studio/);
  assert.match(skill, /Do not delete, empty, change visibility/);
  assert.match(skill, /GitHub Pages/);
  assert.match(agents, /persian-nlp-github-maintainer\/SKILL\.md/);
  assert.match(agents, /npm run check/);
  assert.match(agents, /npm test/);
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
  assert.match(flow, /cp index\.html tools\.html styles\.css tools\.css favicon\.svg _site\//);
  assert.match(flow, /github\.run_attempt/);
  assert.match(page, /src\/app\.mjs/);
  assert.match(toolsPage, /src\/tools\.mjs/);
});

test("public product landing page has no old institutional positioning", () => {
  const page = text("../index.html");
  const readme = text("../README.md");
  assert.doesNotMatch(page, /دانشگاه|دانشجویی|درس پردازش زبان/i);
  assert.doesNotMatch(readme, /university|coursework|class assignments/i);
  assert.match(readme, /MAINTENANCE\.md/);
});
