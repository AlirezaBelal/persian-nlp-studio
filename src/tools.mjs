import { importCorpus, MAX_IMPORT_BYTES } from "./corpus-import.mjs";
import {
  corpusExplorer,
  heKasrehReview,
  medicineNameLookup,
  sentimentEvidence,
  poetryStructure,
  moduleSamples,
} from "./features.mjs";

const $ = (id) => document.getElementById(id);
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
  put(
    "corpus-contexts",
    data.contexts.map((context, i) =>
      item("مورد " + nf.format(i + 1), context),
    ),
    !$("corpus-text").value.trim()
      ? "اول متن را وارد کن یا یک فایل متنی باز کن."
      : !$("corpus-query").value.trim()
        ? "حالا عبارتی را برای جست‌وجو بنویس."
        : "این عبارت در متن پیدا نشد؛ عبارت دیگری را امتحان کن.",
  );
  put(
    "corpus-bigrams",
    data.bigrams.map((x) => item(x.phrase, nf.format(x.occurrences) + " بار")),
    "متنی برای تحلیل وجود ندارد.",
  );
}
function updateHeKasreh() {
  const data = heKasrehReview($("hekasreh-text").value);
  $("hekasreh-count").textContent = nf.format(data.totalCandidates);
  put(
    "hekasreh-results",
    data.candidates.map((x) =>
      item(
        x.observed + " ← " + x.alternative,
        x.variant + " · پیشنهاد اختیاری، نه خطای قطعی",
      ),
    ),
    $("hekasreh-text").value.trim()
      ? "الگوی قابل‌بازبینی از نوع فعلی پیدا نشد؛ این نتیجه تأیید درستی کل متن نیست."
      : "یک متن وارد کن تا شکل‌های قابل‌بازبینی مشخص شوند.",
  );
}
function updateMedicine() {
  const data = medicineNameLookup($("medicine-query").value);
  put(
    "medicine-results",
    data.map((x) =>
      item(
        x.fa + " · " + x.en,
        x.matchType + " · امتیاز املایی " + nf.format(x.score),
      ),
    ),
    $("medicine-query").value.trim()
      ? "در فهرست کوچک فعلی نام مشابهی پیدا نشد؛ این موضوع به معنی نامعتبر بودن دارو نیست."
      : "یک نام فارسی یا انگلیسی بنویس؛ مثلاً متفورمین.",
  );
}
function updateSentiment() {
  const data = sentimentEvidence(
    $("sentiment-text").value,
    $("sentiment-aspect").value,
  );
  $("sentiment-label").textContent = data.label;
  $("sentiment-summary").textContent =
    nf.format(data.positive) +
    " نشانهٔ مثبت و " +
    nf.format(data.negative) +
    " نشانهٔ منفی. این‌ها نتیجهٔ مدل احساس‌سنجی نیستند.";
  put(
    "sentiment-evidence",
    data.evidence.map((x) =>
      item(
        x.word,
        (x.polarity > 0 ? "مثبت" : "منفی") +
          (x.negated ? " · با وارونگی ناشی از نشانهٔ نفی" : ""),
      ),
    ),
    data.aspectFound
      ? "در محدودهٔ بررسی، هیچ واژهٔ موجود در فهرست پیدا نشد."
      : "نام موضوع در متن وجود ندارد.",
  );
}
function updatePoetry() {
  const data = poetryStructure($("poetry-text").value);
  const metricNodes = [
    ["سطر", data.lines],
    ["جفت‌سطر احتمالی", data.possibleCouplets],
    ["واژه", data.words],
    ["میانگین واژه در سطر", data.averageWordsPerLine],
  ].map(([name, value]) => item(nf.format(value), name));
  put("poetry-metrics", metricNodes, "");
  put(
    "poetry-endings",
    data.repeatedEndings.map((x) =>
      item(
        x.ending + " · " + nf.format(x.count) + " سطر",
        "نمونهٔ پایان واژه‌ها: " + x.words.slice(0, 6).join("، "),
      ),
    ),
    "هنوز پایان‌بندی دوحرفی تکراری دیده نشده است.",
  );
  put(
    "poetry-frequencies",
    data.frequentWords.map((x) => item(x.word, nf.format(x.count) + " بار")),
    "هنوز واژه‌ای وارد نشده است.",
  );
}

let importSequence = 0;

const bindings = [
  ["corpus-text", updateCorpus, "input"],
  ["corpus-query", updateCorpus, "input"],
  ["hekasreh-text", updateHeKasreh, "input"],
  ["medicine-query", updateMedicine, "input"],
  ["sentiment-text", updateSentiment, "input"],
  ["sentiment-aspect", updateSentiment, "change"],
  ["poetry-text", updatePoetry, "input"],
];
for (const [id, handler, event] of bindings)
  $(id).addEventListener(event, () => {
    if (id === "corpus-text") {
      importSequence++;
      $("corpus-import-status").textContent =
        "ویرایش دستی؛ فایل شما ارسال یا ذخیره نمی‌شود.";
    }
    handler();
  });

for (const btn of document.querySelectorAll("[data-sample]")) {
  btn.addEventListener("click", () => {
    const module = btn.getAttribute("data-sample");
    if (module === "corpus") {
      importSequence++;
      $("corpus-import-status").textContent =
        "متن نمونه جای‌گذاری شد؛ فایلی خوانده نشده است.";
    }
    const target = {
      corpus: "corpus-text",
      hekasreh: "hekasreh-text",
      medicine: "medicine-query",
      sentiment: "sentiment-text",
      poetry: "poetry-text",
    }[module];
    $(target).value = moduleSamples[module];
    if (module === "corpus") $("corpus-query").value = "زبان";
    ({
      corpus: updateCorpus,
      hekasreh: updateHeKasreh,
      medicine: updateMedicine,
      sentiment: updateSentiment,
      poetry: updatePoetry,
    })[module]();
    $(target).focus();
  });
}
for (const update of [
  updateCorpus,
  updateHeKasreh,
  updateMedicine,
  updateSentiment,
  updatePoetry,
])
  update();

$("corpus-file").addEventListener("change", async (event) => {
  const sequence = ++importSequence;
  const file = event.target.files?.[0];
  if (!file) return;
  const status = $("corpus-import-status");
  try {
    if (file.size > MAX_IMPORT_BYTES)
      throw new RangeError("فایل بیش از حد بزرگ است.");
    status.textContent = "در حال خواندن فایل محلی…";
    const content = importCorpus(
      new Uint8Array(await file.arrayBuffer()),
      file.name.toLowerCase().endsWith(".jsonl") ? "jsonl" : "text",
    );
    if (sequence !== importSequence) return;
    $("corpus-text").value = content;
    updateCorpus();
    status.textContent = "فایل به‌صورت محلی خوانده شد؛ متن قبلی جایگزین شد.";
  } catch (error) {
    if (sequence === importSequence) status.textContent = error.message;
  } finally {
    if (event.target.files?.[0] === file) event.target.value = "";
  }
});

// Enhance in-page links into one focused workspace. Without JS all tools remain readable.
const toolIds = ["corpus", "hekasreh", "medicine", "sentiment", "poetry"];
const navigation = [...document.querySelectorAll(".tools-index a")];
function showTool(id, focus = false) {
  for (const name of toolIds) $(name).hidden = name !== id;
  for (const link of navigation) {
    if (link.hash === "#" + id) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  if (focus) $(id).querySelector("h2").focus({ preventScroll: true });
}
for (const id of toolIds) $(id).querySelector("h2").tabIndex = -1;
for (const link of navigation)
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, "", link.hash);
    showTool(link.hash.slice(1), true);
  });
function restoreTool() {
  const id = location.hash.slice(1);
  showTool(toolIds.includes(id) ? id : "corpus");
  if (id === "tool-notice") $("tool-notice").open = true;
}
window.addEventListener("popstate", restoreTool);
window.addEventListener("hashchange", restoreTool);
restoreTool();
for (const button of document.querySelectorAll("[data-clear]"))
  button.addEventListener("click", () => {
    const id = button.getAttribute("data-clear");
    const target = {
      corpus: "corpus-text",
      hekasreh: "hekasreh-text",
      medicine: "medicine-query",
      sentiment: "sentiment-text",
      poetry: "poetry-text",
    }[id];
    $(target).value = "";
    if (id === "corpus") {
      importSequence++;
      $("corpus-query").value = "";
      $("corpus-import-status").textContent =
        "ورودی پیکره پاک شد؛ فایلی ذخیره نشده است.";
    }
    ({
      corpus: updateCorpus,
      hekasreh: updateHeKasreh,
      medicine: updateMedicine,
      sentiment: updateSentiment,
      poetry: updatePoetry,
    })[id]();
    $(target).focus();
  });
