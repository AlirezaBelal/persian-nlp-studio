import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const root=new URL('../',import.meta.url);
test('release assets include original SVGs and the full bundled font license',()=>{
  const flow=readFileSync(new URL('.github/workflows/pages.yml',root),'utf8');
  for(const path of ['assets/brand/textnema.svg','assets/icons.svg','assets/fonts/OFL-Vazirmatn.txt']){
    assert.ok(existsSync(new URL(path,root)),path);
    assert.ok(flow.includes(path),'Missing Pages asset '+path);
  }
  for(const path of ['favicon.svg','assets/brand/textnema.svg','assets/icons.svg']){
    const svg=readFileSync(new URL(path,root),'utf8');
    assert.match(svg,/<svg[^>]+xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.doesNotMatch(svg,/<script|<foreignObject|onload=|https?:\/\/(?!www.w3.org)/i);
  }
  assert.match(readFileSync(new URL('assets/fonts/OFL-Vazirmatn.txt',root),'utf8'),/Vazirmatn Project Authors/);
});
