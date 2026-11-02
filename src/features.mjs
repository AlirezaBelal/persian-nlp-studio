/**
 * Independent, deterministic Persian text tools.
 *
 * No proprietary course code, pretrained weights, FDA / WHO data, university
 * datasets, personal information or unlicensed scraped corpora are included.
 * These are explainable lexical utilities, NOT validated ML predictors.
 */
import { normalizePersian, tokenize, wordFrequencies } from "./engine.mjs";

const lower = (s) => normalizePersian(s).toLocaleLowerCase("fa");
const MAX = 20000;

export function corpusExplorer(input, query, limit = 10) {
  const text = normalizePersian(input);
  const needle = lower(query).trim();
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new RangeError("Invalid limit");
  if (query.length > 100) throw new RangeError("Query is too long");
  const corpus = text.toLocaleLowerCase("fa");
  const contexts = [];
  let count = 0;
  if (needle) {
    let pos = 0, at;
    while ((at = corpus.indexOf(needle, pos)) !== -1) {
      count++;
      if (contexts.length < limit) {
        const start = Math.max(0, at - 42);
        const end = Math.min(text.length, at + needle.length + 42);
        contexts.push((start ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : ""));
      }
      pos = at + Math.max(1, needle.length);
    }
  }
  const words = tokenize(text).map(x => x.toLocaleLowerCase("fa"));
  const pairs = new Map();
  for (let i = 0; i + 1 < words.length; i++) {
    const pair = words[i] + " " + words[i + 1];
    pairs.set(pair, (pairs.get(pair) ?? 0) + 1);
  }
  const bigrams = [...pairs].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fa"))
    .slice(0, 8).map(([phrase, occurrences]) => ({ phrase, occurrences }));
  return { occurrences: count, contexts, bigrams, totalWords: words.length };
}

export function heKasrehReview(input) {
  const text = normalizePersian(input);
  const candidates = [];
  const patterns = [
    { regex: /(^|[^\p{L}\p{N}])([\p{L}]{2,}ه)[ \t]+ی(?=$|[^\p{L}\p{N}])/gu, label: "فاصله + ی", exampleSuffix: "ٔ" },
    { regex: /(^|[^\p{L}\p{N}])([\p{L}]{2,}ه)\u200cی(?=$|[^\p{L}\p{N}])/gu, label: "نیم‌فاصله + ی", exampleSuffix: "ٔ" }
  ];
  for (const {regex, label, exampleSuffix} of patterns) {
    for (const match of text.matchAll(regex)) {
      const word = match[2];
      candidates.push({
        position: match.index + match[1].length,
        observed: match[0].slice(match[1].length),
        variant: label,
        alternative: word + exampleSuffix,
        note: "این یک شکل نوشتاری جایگزین برای بررسی دستی است، نه تصحیح قطعی."
      });
    }
  }
  candidates.sort((a,b) => a.position - b.position);
  return { candidates: candidates.slice(0, 30), totalCandidates: candidates.length };
}

// Independently selected GENERIC SPELLINGS ONLY. This is a tiny local demo list,
// NOT a medicine database, verified synonym ontology, or treatment guide.
export const genericNames = Object.freeze([
  { fa: "استامینوفن", en: "Paracetamol", aliases: ["Acetaminophen", "پاراستامول"] },
  { fa: "ایبوپروفن", en: "Ibuprofen", aliases: [] },
  { fa: "آموکسی‌سیلین", en: "Amoxicillin", aliases: ["آموکسی سیلین"] },
  { fa: "متفورمین", en: "Metformin", aliases: [] },
  { fa: "سرترالین", en: "Sertraline", aliases: [] },
  { fa: "پروپرانولول", en: "Propranolol", aliases: [] },
  { fa: "گاباپنتین", en: "Gabapentin", aliases: [] },
  { fa: "لوراتادین", en: "Loratadine", aliases: [] },
  { fa: "امپرازول", en: "Omeprazole", aliases: [] },
  { fa: "سیتریزین", en: "Cetirizine", aliases: [] },
  { fa: "فلوکستین", en: "Fluoxetine", aliases: [] },
  { fa: "آزیترومایسین", en: "Azithromycin", aliases: [] },
  { fa: "دیکلوفناک", en: "Diclofenac", aliases: [] },
  { fa: "ناپروکسن", en: "Naproxen", aliases: [] },
  { fa: "آسپرین", en: "Aspirin", aliases: [] },
  { fa: "پنی‌سیلین", en: "Penicillin", aliases: ["پنی سیلین"] }
]);

function canonical(value) {
  return lower(value).replace(/[\s\u200c_\-.]+/gu, "");
}

export function editDistance(a, b) {
  const aa = Array.from(a), bb = Array.from(b);
  let prev = Array.from({ length: bb.length + 1 }, (_, i) => i);
  for (let i = 0; i < aa.length; i++) {
    const next = [i + 1];
    for (let j = 0; j < bb.length; j++) {
      next[j + 1] = Math.min(
        next[j] + 1, prev[j + 1] + 1,
        prev[j] + (aa[i] === bb[j] ? 0 : 1)
      );
    }
    prev = next;
  }
  return prev[bb.length];
}

export function medicineNameLookup(query, limit = 6) {
  if (typeof query !== "string" || query.length > 100) throw new RangeError("Query must be <=100 characters");
  if (!Number.isInteger(limit) || limit < 1 || limit > 16) throw new RangeError("Invalid limit");
  const q = canonical(query);
  if (Array.from(q).length < 2) return [];
  return genericNames.flatMap(item => {
    const terms = [item.fa, item.en, ...item.aliases].map(canonical);
    let score = 0, matchType = "";
    for (const term of terms) {
      if (q === term) { score = 100; matchType = "تطبیق دقیق"; break; }
      if (q.length >= 3 && term.startsWith(q) && score < 94) { score = 94; matchType = "پیشوند"; }
      else if (q.length >= 4 && term.includes(q) && score < 87) { score = 87; matchType = "تطبیق جزئی"; }
      else if (q.length >= 5) {
        const similarity = 1 - editDistance(q,term) / Math.max(Array.from(q).length,Array.from(term).length);
        if (similarity >= 0.70 && Math.round(similarity * 80) > score) {
          score = Math.round(similarity * 80); matchType = "شباهت املایی";
        }
      }
    }
    return score ? [{ fa: item.fa, en: item.en, score, matchType }] : [];
  }).sort((a,b) => b.score - a.score || a.fa.localeCompare(b.fa,"fa")).slice(0,limit);
}

const positiveWords = new Set(["خوب","عالی","زیبا","جذاب","دلنشین","درخشان","موفق","روان","لذت‌بخش","دوست‌داشتنی","قوی","شاد","امیدبخش","خوشایند","آرام"]);
const negativeWords = new Set(["بد","ضعیف","افتضاح","کسل‌کننده","خسته‌کننده","نامناسب","ناراحت","ناموفق","آزاردهنده","کند","خسته","بی‌کیفیت","بی‌معنا","ناامیدکننده","ترسناک"]);
const aspects = Object.freeze({
  all: [],
  story: ["داستان","فیلمنامه","قصه"],
  acting: ["بازیگری","بازیگران","بازیگر","نقش"],
  music: ["موسیقی","آهنگ","صدا"],
  direction: ["کارگردانی","کارگردان","ساخت"]
});

export function sentimentEvidence(input, aspect = "all") {
  if (!Object.hasOwn(aspects, aspect)) throw new RangeError("Unknown aspect");
  const words = tokenize(input).map(x=>x.toLocaleLowerCase("fa"));
  const markers = aspects[aspect];
  const areas = markers.length ? words.map((word,i)=>markers.includes(word)?i:-1).filter(i=>i>=0) : [];
  if (markers.length && areas.length === 0) return { label:"نشانه‌ای یافت نشد",positive:0,negative:0,evidence:[],aspectFound:false };
  const evidence = [];
  for (let i=0;i<words.length;i++) {
    const word=words[i];
    if (markers.length && !areas.some(pos=>Math.abs(pos-i)<=6)) continue;
    const originalPolarity = positiveWords.has(word) ? 1 : negativeWords.has(word) ? -1 : 0;
    if (!originalPolarity) continue;
    const negated = [words[i-2], words[i-1], words[i+1], words[i+2]]
      .some(token=>token && ["نیست","نبود","نشد","نه"].includes(token));
    const polarity = negated ? -originalPolarity : originalPolarity;
    evidence.push({ word, polarity, negated });
  }
  const positive=evidence.filter(x=>x.polarity>0).length;
  const negative=evidence.filter(x=>x.polarity<0).length;
  const label=positive>negative?"نشانه‌های مثبت بیشتر":negative>positive?"نشانه‌های منفی بیشتر":positive?"نشانه‌های آمیخته":"نشانهٔ واژگانی یافت نشد";
  return {label,positive,negative,evidence:evidence.slice(0,30),aspectFound:true};
}

export function poetryStructure(input) {
  const lines = normalizePersian(input).split("\n").map(x=>x.trim()).filter(Boolean);
  const tailGroups = new Map();
  const endings = [];
  for (const line of lines) {
    const words = tokenize(line);
    const final = words.at(-1) ?? "";
    if (!final) continue;
    const ending = Array.from(final).slice(-2).join("");
    endings.push(final);
    const entry = tailGroups.get(ending) ?? [];
    entry.push(final);
    tailGroups.set(ending,entry);
  }
  const repeatedEndings=[...tailGroups].filter(([,words])=>words.length>1)
    .map(([ending,words])=>({ending,words,count:words.length}))
    .sort((a,b)=>b.count-a.count || a.ending.localeCompare(b.ending,"fa"))
    .slice(0,8);
  const wordCounts = lines.map(line=>tokenize(line).length);
  const frequentWords=wordFrequencies(lines.join("\n"),6);
  return {
    lines:lines.length,
    possibleCouplets:Math.floor(lines.length/2),
    words:wordCounts.reduce((a,b)=>a+b,0),
    averageWordsPerLine:lines.length?Math.round(wordCounts.reduce((a,b)=>a+b,0)/lines.length*10)/10:0,
    endings:endings.slice(0,25),
    repeatedEndings,
    frequentWords
  };
}

export const moduleSamples = Object.freeze({
  corpus:"زبان فارسی از واژه‌های گوناگون ساخته شده است. زبان و واژه در کنار هم معنای تازه می‌سازند.",
  hekasreh:"خانه ی زیبا کنار خانه‌ی قدیمی بود. خانهٔ کوچک هنوز روشن است.",
  medicine:"acetaminophen",
  sentiment:"داستان جذاب بود اما موسیقی ضعیف و بازیگری عالی بود.",
  poetry:"بهار آمد و باغ از شوق بیدار\nنسیم آمد و دل شد بی‌قرار\nنفس در روشنای روز جاری\nنگاه از شوق فردا پر ز یاری"
});
