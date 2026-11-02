import test from 'node:test';
import assert from 'node:assert/strict';
import { importCorpus } from '../src/corpus-import.mjs';
const bytes = s => new TextEncoder().encode(s);
test('local UTF-8 import preserves Persian, ZWNJ and markup as inert text', () => {
  const text = 'می‌روم\n<script>alert(1)</script>';
  assert.equal(importCorpus(bytes(text)), text);
});
test('JSONL imports only explicit text fields and preserves document breaks', () => {
  assert.equal(importCorpus(bytes('{"text":"فارسی","secret":"ignored"}\n{"text":"آزمون"}'), 'jsonl'), 'فارسی\n\nآزمون');
  for (const text of ['bad', '{"text":12}', 'null']) assert.throws(() => importCorpus(bytes(text), 'jsonl'));
});
test('import limits reject oversize and malformed input without truncation', () => {
  assert.throws(() => importCorpus(new Uint8Array(80001)), RangeError);
  assert.throws(() => importCorpus(bytes('x'.repeat(20001))), RangeError);
  assert.throws(() => importCorpus(new Uint8Array([255])), TypeError);
  assert.throws(() => importCorpus(bytes('x\0y')), TypeError);
  assert.throws(() => importCorpus(bytes('x'), 'csv'), TypeError);
  assert.equal(importCorpus(bytes('')), '');
});
