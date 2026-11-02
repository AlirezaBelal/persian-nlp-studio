import { importCorpus, MAX_IMPORT_BYTES } from "./corpus-import.mjs";
import {
  corpusExplorer, heKasrehReview, medicineNameLookup, sentimentEvidence,
  poetryStructure, moduleSamples
} from "./features.mjs";

const $ = id => document.getElementById(id);
const nf = new Intl.NumberFormat("fa-IR");
const txt = (tag, content, className = "") => {
  const element = document.createElement(tag);
  element.textContent = String(content);
  if (className) element.className = className;
  return element;
};
const put = (id, nodes, emptyMessage) => {
  const root = $(id);
  root.replaceChildren();
  if (nodes.length === 0) {
    root.append(txt("p", emptyMessage, "empty-tool"));
  } else root.append(...nodes);
};
const item = (heading, description) => {
  const card = document.createElement("div");
  card.className = "result-item";
  card.append(txt("strong", heading), txt("span", description));
  return card;
};

function updateCorpus() {
  const data = corpusExplorer($("corpus-text").value, $("corpus-query").value);
  $("corpus-count").textContent = nf.format(data.occurrences);
  put("corpus-contexts", data.contexts.map((context,i)=>item("مورد " + nf.format(i+1), context)),
    data.occurrences ? "فقط ۱۰ بافت اول نمایش داده می‌شود." : "موردی پیدا نشد یا عبارت جست‌وجو خالی است.");
  put("corpus-bigrams", data.bigrams.map(x=>item(x.phrase, nf.format(x.occurrences) + " بار")),
    "متنی برای تحلیل وجود ندارد.");
}
function updateHeKasreh() {
  const data = heKasrehReview($("hekasreh-text").value);
  $("hekasreh-count").textContent = nf.format(data.totalCandidates);
  put("hekasreh-results", data.candidates.map(x=>item(
    x.observed + " ← " + x.alternative,
    x.variant + " · پیشنهاد اختیاری، نه خطای قطعی"
  )), "الگوی قابل‌بازبینی از نوع فعلی پیدا نشد.");
}
function updateMedicine() {
  const data = medicineNameLookup($("medicine-query").value);
  put("medicine-results", data.map(x=>item(x.fa + " · " + x.en, x.matchType + " · امتیاز املایی " + nf.format(x.score))),
    "در فهرست کوچک فعلی نام مشابهی پیدا نشد؛ این موضوع به معنی نامعتبر بودن دارو نیست.");
}
function updateSentiment() {
  const data = sentimentEvidence($("sentiment-text").value, $("sentiment-aspect").value);
  $("sentiment-label").textContent = data.label;
  $("sentiment-summary").textContent = nf.format(data.positive) +
    " نشانهٔ مثبت و " + nf.format(data.negative) + " نشانهٔ منفی. این‌ها نتیجهٔ مدل احساس‌سنجی نیستند.";
  put("sentiment-evidence", data.evidence.map(x=>item(x.word,
    (x.polarity>0 ? "مثبت" : "منفی") + (x.negated ? " · با وارونگی ناشی از نشانهٔ نفی" : "")
  )), data.aspectFound ? "در محدودهٔ بررسی، هیچ واژهٔ موجود در فهرست پیدا نشد." : "نام موضوع در متن وجود ندارد.");
}
function updatePoetry() {
  const data = poetryStructure($("poetry-text").value);
  const metricNodes=[
    ["سطر",data.lines],
    ["جفت‌سطر احتمالی",data.possibleCouplets],
    ["واژه",data.words],
    ["میانگین واژه در سطر",data.averageWordsPerLine]
  ].map(([name,value])=>item(nf.format(value),name));
  put("poetry-metrics", metricNodes,"");
  put("poetry-endings",data.repeatedEndings.map(x=>item(x.ending + " · " + nf.format(x.count) + " سطر",
    "نمونهٔ پایان واژه‌ها: " + x.words.slice(0,6).join("، "))),
    "هنوز پایان‌بندی دوحرفی تکراری دیده نشده است.");
  put("poetry-frequencies",data.frequentWords.map(x=>item(x.word,nf.format(x.count)+" بار")),
    "هنوز واژه‌ای وارد نشده است.");
}

const bindings=[
  ["corpus-text",updateCorpus,"input"],["corpus-query",updateCorpus,"input"],
  ["hekasreh-text",updateHeKasreh,"input"],
  ["medicine-query",updateMedicine,"input"],
  ["sentiment-text",updateSentiment,"input"],
  ["sentiment-aspect",updateSentiment,"change"],
  ["poetry-text",updatePoetry,"input"]
];
for(const [id,handler,event] of bindings) $(id).addEventListener(event,handler);

for(const btn of document.querySelectorAll("[data-sample]")){
  btn.addEventListener("click",()=>{
    const module=btn.getAttribute("data-sample");
    const target={
      corpus:"corpus-text", hekasreh:"hekasreh-text",
      medicine:"medicine-query",sentiment:"sentiment-text",poetry:"poetry-text"
    }[module];
    $(target).value=moduleSamples[module];
    if(module==="corpus")$("corpus-query").value="زبان";
    ({corpus:updateCorpus,hekasreh:updateHeKasreh,medicine:updateMedicine,
      sentiment:updateSentiment,poetry:updatePoetry})[module]();
    $(target).focus();
  });
}
for(const update of [updateCorpus,updateHeKasreh,updateMedicine,updateSentiment,updatePoetry])update();

let importSequence = 0;
$("corpus-file").addEventListener("change", async event => {
  const sequence = ++importSequence;
  const file = event.target.files?.[0];
  if (!file) return;
  const status = $("corpus-import-status");
  try {
    if (file.size > MAX_IMPORT_BYTES) throw new RangeError("فایل بیش از حد بزرگ است.");
    status.textContent = "در حال خواندن فایل محلی…";
    const content = importCorpus(new Uint8Array(await file.arrayBuffer()), file.name.toLowerCase().endsWith('.jsonl') ? 'jsonl' : 'text');
    if (sequence !== importSequence) return;
    $("corpus-text").value = content;
    updateCorpus();
    status.textContent = "فایل به‌صورت محلی خوانده شد؛ متن قبلی جایگزین شد.";
  } catch (error) {
    if (sequence === importSequence) status.textContent = error.message;
  } finally { if (sequence === importSequence) event.target.value = ""; }
});
