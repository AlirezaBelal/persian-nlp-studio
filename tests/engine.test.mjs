import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizePersian, tokenize, wordFrequencies, analyzeText, compareTexts,
  phraseOccurrences, demoText, exportableMetrics
} from "../src/engine.mjs";

test("Persian Arabic variants and diacritics normalize predictably", () => {
  assert.equal(normalizePersian("كتابِ يک  \n  دوست"), "کتاب یک\nدوست");
  assert.equal(normalizePersian("می \u200c روم"), "می\u200cروم");
  assert.equal(normalizePersian("الف\r\nب"), "الف\nب");
});

test("normalization preserves Persian alef distinctions and code point meaning", () => {
  assert.equal(normalizePersian("آباد"), "آباد");
  assert.equal(normalizePersian("هٔ"), "ه");
  assert.equal(normalizePersian(""), "");
});

test("tokenization works on Persian numbers, ZWNJ words and punctuation", () => {
  assert.deepEqual(tokenize("می\u200cروم؛ کتاب ۱۲۳!"), ["می\u200cروم", "کتاب", "۱۲۳"]);
});

test("frequency ties are deterministic, counts do not include punctuation", () => {
  assert.deepEqual(wordFrequencies("کتاب کتاب دفتر"), [
    { word: "کتاب", count: 2 }, { word: "دفتر", count: 1 }
  ]);
  assert.throws(() => wordFrequencies("متن", 0), RangeError);
});

test("empty text has well-defined zero metrics", () => {
  assert.deepEqual(analyzeText(""), {
    characters: 0, charactersWithoutSpaces: 0, words: 0,
    uniqueWords: 0, sentences: 0, lines: 0, paragraphs: 0, topWords: []
  });
});

test("text analysis returns lexical statistics, not an invented sentiment score", () => {
  const result = analyzeText("سلام دنیا! سلام.");
  assert.equal(result.words, 3);
  assert.equal(result.uniqueWords, 2);
  assert.equal(result.sentences, 2);
  assert.equal(result.lines, 1);
  assert.equal(result.topWords[0].word, "سلام");
});

test("two-text overlap uses unique lexical tokens and is symmetric", () => {
  const a = compareTexts("سلام دنیا", "سلام فارسی");
  const b = compareTexts("سلام فارسی", "سلام دنیا");
  assert.equal(a.overlapPercent, 33);
  assert.deepEqual(a.sharedWords, ["سلام"]);
  assert.equal(a.overlapPercent, b.overlapPercent);
  assert.equal(compareTexts("", "").overlapPercent, 0);
});

test("phrase matching is local, literal and case insensitive", () => {
  assert.equal(phraseOccurrences("سلام، سلام؛ دنیا", "سلام"), 2);
  assert.equal(phraseOccurrences("کتاب", ""), 0);
  assert.equal(phraseOccurrences("كتاب", "کتاب"), 1);
});

test("input cap prevents accidental expensive processing", () => {
  assert.throws(() => analyzeText("الف".repeat(20001)), RangeError);
  assert.ok(analyzeText(demoText).words > 10);
});


test("export is numeric-only and never leaks user text or word tokens", () => {
  const sensitive = "نمونه_خصوصی رمزآزمایشی";
  const parsed = analyzeText(sensitive);
  const result = exportableMetrics(parsed);
  assert.deepEqual(Object.keys(result).sort(), [
    "format", "characters", "charactersWithoutSpaces", "words", "uniqueWords",
    "sentences", "lines", "paragraphs"
  ].sort());
  assert.ok(Object.entries(result).filter(([key]) => key !== "format").every(([, value]) => Number.isSafeInteger(value)));
  assert.ok(!JSON.stringify(result).includes("نمونه"));
  assert.ok(!JSON.stringify(result).includes("رمزآزمایشی"));
  assert.ok(!Object.hasOwn(result, "topWords"));
  assert.throws(() => exportableMetrics({ ...parsed, words: -1 }), TypeError);
});
