/**
 * Persian NLP Studio — deterministic, offline text utilities.
 * These are lexical utilities, not trained models or validated linguistic predictors.
 */
const TOKEN_RE = /[\p{L}\p{N}]+(?:\u200c[\p{L}\p{N}]+)*/gu;
const MAX_CHARS = 20000;

export function normalizePersian(input) {
  if (typeof input !== "string") throw new TypeError("Expected text.");
  if (input.length > MAX_CHARS) throw new RangeError("Text exceeds 20,000 characters.");
  return input
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u064b-\u065f\u0670\u06d6-\u06ed]/g, "")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u0640/g, "")
    .replace(/[\u200e\u200f\u061c]/g, "")
    .replace(/[\t\f\v ]+/g, " ")
    .replace(/ *\u200c */g, "\u200c")
    .split("\n").map(line => line.trim()).join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

export function tokenize(text) {
  return normalizePersian(text).match(TOKEN_RE) ?? [];
}

export function wordFrequencies(text, limit = 12) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new RangeError("Invalid frequency limit.");
  }
  const frequencies = new Map();
  for (const word of tokenize(text)) {
    const key = word.toLocaleLowerCase("fa");
    frequencies.set(key, (frequencies.get(key) ?? 0) + 1);
  }
  return [...frequencies.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fa"))
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

export function analyzeText(input) {
  const normalized = normalizePersian(input);
  const words = tokenize(normalized);
  const normalizedWords = words.map(word => word.toLocaleLowerCase("fa"));
  const nonEmptyLines = normalized.split("\n").filter(line => line.trim().length > 0);
  return {
    characters: Array.from(normalized).length,
    charactersWithoutSpaces: Array.from(normalized.replace(/\s/g, "")).length,
    words: words.length,
    uniqueWords: new Set(normalizedWords).size,
    sentences: normalized.trim()
      ? normalized.split(/[.!؟?…]+/u).filter(piece => piece.trim()).length
      : 0,
    lines: nonEmptyLines.length,
    paragraphs: normalized.trim()
      ? normalized.split(/\n\s*\n/u).filter(part => part.trim()).length
      : 0,
    topWords: wordFrequencies(normalized)
  };
}

export function compareTexts(left, right) {
  const leftWords = new Set(tokenize(left).map(word => word.toLocaleLowerCase("fa")));
  const rightWords = new Set(tokenize(right).map(word => word.toLocaleLowerCase("fa")));
  const shared = [...leftWords].filter(word => rightWords.has(word))
    .sort((a, b) => a.localeCompare(b, "fa"));
  const union = new Set([...leftWords, ...rightWords]).size;
  return {
    leftUnique: leftWords.size,
    rightUnique: rightWords.size,
    sharedCount: shared.length,
    overlapPercent: union ? Math.round((shared.length / union) * 100) : 0,
    sharedWords: shared.slice(0, 40)
  };
}

export function phraseOccurrences(text, phrase) {
  const haystack = normalizePersian(text).toLocaleLowerCase("fa");
  const needle = normalizePersian(phrase).trim().toLocaleLowerCase("fa");
  if (!needle) return 0;
  let offset = 0;
  let found = 0;
  while ((offset = haystack.indexOf(needle, offset)) !== -1) {
    found += 1;
    offset += needle.length;
  }
  return found;
}

export const demoText = "زبان فارسی دنیایی از واژه‌ها و معناهاست.\nپردازش متن فارسی با دقت و شفافیت آغاز می‌شود.\nاین ابزار بدون ارسال داده به سرور، واژه‌ها را می‌شمارد.";

/** An aggregate-only export: never include source text, tokens, or word frequencies. */
export function exportableMetrics(analysis) {
  const fields = ["characters", "charactersWithoutSpaces", "words", "uniqueWords", "sentences", "lines", "paragraphs"];
  const metrics = {};
  for (const field of fields) {
    const value = analysis[field];
    if (!Number.isSafeInteger(value) || value < 0) throw new TypeError("Invalid analysis metric: " + field);
    metrics[field] = value;
  }
  return { format: "persian-nlp-studio-metrics-v1", ...metrics };
}
