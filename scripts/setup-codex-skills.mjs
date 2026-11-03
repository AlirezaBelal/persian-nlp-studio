// Copies only reviewed Markdown; never executes upstream code.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, lstatSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
export const pin = '9f954c3b63fda0d1875252009c196bf15072c1ca';
export const selections = ['planner', 'frontend-responsive-ui'];
export function manifest(text, name) {
  if (!/^---\r?\n[\s\S]*?\r?\n---\r?\n/.test(text) || !/^name: .+$/m.test(text) || !/^description: .+$/m.test(text)) throw new Error(`Invalid skill frontmatter: ${name}`);
  return text.replace(/^name: .+$/m, `name: ${name}`).replaceAll('\r\n', '\n');
}
export function setup(root, mode = '--install', git = 'git') {
  if (!['--install', '--check', '--init'].includes(mode)) throw new Error('Usage: setup-codex-skills [--install|--check|--init|--help]');
  if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Node.js 22+ required');
  const run = args => execFileSync(git, ['-C', root, ...args], { encoding: 'utf8', env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' }, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  run(['rev-parse', '--show-toplevel']);
  if (!run(['ls-tree', 'HEAD', 'vendor/codex-skills']).startsWith(`160000 commit ${pin}\t`)) throw new Error('Unexpected submodule gitlink pin');
  if (run(['config', '-f', join(root, '.gitmodules'), '--get', 'submodule.vendor/codex-skills.url']) !== 'https://github.com/am-will/codex-skills.git') throw new Error('Unexpected submodule URL');
  if (mode === '--init') run(['-c', 'core.hooksPath=/dev/null', 'submodule', 'update', '--init', '--', 'vendor/codex-skills']);
  const source = join(root, 'vendor/codex-skills');
  if (!existsSync(join(source, '.git'))) throw new Error('Submodule missing; run node scripts/setup-codex-skills.mjs --init');
  if (run(['-C', source, 'rev-parse', 'HEAD']) !== pin) throw new Error('Unexpected upstream SHA');
  if (run(['-C', source, 'status', '--porcelain'])) throw new Error('Upstream checkout is dirty');
  const targets = selections.map(name => {
    const directory = join(root, '.agents/skills', name);
    const file = join(directory, 'SKILL.md');
    for (const path of [join(root, '.agents'), join(root, '.agents/skills'), directory, file]) {
      if (existsSync(path) && lstatSync(path).isSymbolicLink()) throw new Error('Refusing skill symlink');
    }
    return { directory, file, expected: manifest(readFileSync(join(source, 'skills', name, 'SKILL.md'), 'utf8'), name) };
  });
  for (const { directory, file, expected } of targets) {
    if (mode === '--check') {
      if (!existsSync(file) || readFileSync(file, 'utf8') !== expected) throw new Error(`Skill missing or modified: ${file}`);
    } else if (!existsSync(file) || readFileSync(file, 'utf8') !== expected) {
      mkdirSync(directory, { recursive: true });
      writeFileSync(file, expected);
    }
  }
  console.log(`Verified ${pin}: ${selections.join(', ')} (${mode})`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.includes('--help')) console.log('Node.js 22+ and Git required. --init initializes source and installs; --install installs offline; --check verifies without mutation. No upstream scripts, hooks, credentials or APIs.');
    else if (process.argv.length > 3) throw new Error('Too many arguments');
    else setup(fileURLToPath(new URL('../', import.meta.url)), process.argv[2]);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
