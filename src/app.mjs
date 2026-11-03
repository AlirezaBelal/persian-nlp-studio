import {
  analyzeText,
  compareTexts,
  normalizePersian,
  demoText,
  exportableMetrics,
} from "./engine.mjs";

const $ = (id) => document.getElementById(id);
const nf = new Intl.NumberFormat("fa-IR");
const mainInput = $("main-text");
const compareA = $("compare-a");
const compareB = $("compare-b");
let latestAnalysis = analyzeText("");

function setCount(id, value) {
  $(id).textContent = nf.format(value);
}

function createFrequencyRow({ word, count }, max) {
  const row = document.createElement("div");
  row.className = "frequency-row";
  const wordLabel = document.createElement("span");
  wordLabel.className = "frequency-word";
  wordLabel.textContent = word;
  const rail = document.createElement("span");
  rail.className = "frequency-rail";
  rail.setAttribute("aria-hidden", "true");
  const bar = document.createElement("span");
  bar.style.width = `${(count / max) * 100}%`;
  rail.append(bar);
  const amount = document.createElement("span");
  amount.className = "frequency-count";
  amount.textContent = nf.format(count);
  row.append(wordLabel, rail, amount);
  return row;
}

function updateAnalysis() {
  const value = mainInput.value;
  latestAnalysis = analyzeText(value);
  $("input-length").textContent =
    `${nf.format(value.length)} / ${nf.format(20000)}`;
  setCount("count-words", latestAnalysis.words);
  setCount("count-unique", latestAnalysis.uniqueWords);
  setCount("count-chars", latestAnalysis.characters);
  setCount("count-lines", latestAnalysis.lines);

  const frequencyList = $("frequencies");
  frequencyList.replaceChildren();
  if (!latestAnalysis.topWords.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "برای دیدن واژه‌ها، متنی وارد کنید.";
    frequencyList.append(empty);
  } else {
    const max = latestAnalysis.topWords[0].count;
    const fragment = document.createDocumentFragment();
    latestAnalysis.topWords.forEach((entry) =>
      fragment.append(createFrequencyRow(entry, max)),
    );
    frequencyList.append(fragment);
  }

  const normalized = normalizePersian(value);
  $("normalized-output").textContent =
    normalized || "متن یکدست‌شده اینجا نمایش داده می‌شود.";
  $("export-btn").disabled = !normalized.trim();
  $("copy-btn").disabled = !normalized.trim();
  $("analysis-status").textContent = normalized.trim()
    ? "به‌روز شد"
    : "آمادهٔ تحلیل";
}

function updateComparison() {
  const result = compareTexts(compareA.value, compareB.value);
  $("overlap-value").textContent = `${nf.format(result.overlapPercent)}٪`;
  $("compare-counts").textContent =
    `${nf.format(result.sharedCount)} واژهٔ مشترک از ${nf.format(result.leftUnique)} و ${nf.format(result.rightUnique)} واژهٔ یکتا`;
  $("overlap-bar").style.width = `${result.overlapPercent}%`;
  $("overlap-meter").setAttribute(
    "aria-valuenow",
    String(result.overlapPercent),
  );
  $("shared-words").textContent = result.sharedWords.length
    ? result.sharedWords.join(" · ")
    : "واژهٔ مشترکی در این دو متن پیدا نشد.";
}

function exportAnalysis() {
  if (mainInput.value.trim().length === 0) return;
  // Export only computed metrics, never user-entered source text.
  const report = exportableMetrics(latestAnalysis);
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "persian-nlp-analysis.json";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  $("announcements").textContent =
    "گزارش آماری دریافت شد؛ متن اصلی در فایل وجود ندارد.";
}

$("sample-btn").addEventListener("click", () => {
  mainInput.value = demoText;
  updateAnalysis();
  mainInput.focus();
});
$("clear-btn").addEventListener("click", () => {
  mainInput.value = "";
  updateAnalysis();
  mainInput.focus();
});
$("export-btn").addEventListener("click", exportAnalysis);
mainInput.addEventListener("input", updateAnalysis);
compareA.addEventListener("input", updateComparison);
compareB.addEventListener("input", updateComparison);
updateAnalysis();
updateComparison();

$("copy-btn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(normalizePersian(mainInput.value));
    $("announcements").textContent = "متن یکدست‌شده کپی شد.";
    $("copy-btn").textContent = "کپی شد ✓";
    setTimeout(() => {
      $("copy-btn").textContent = "کپی متن ⧉";
    }, 1800);
  } catch {
    $("announcements").textContent =
      "کپی در این مرورگر در دسترس نیست؛ متن خروجی را انتخاب و کپی کن.";
  }
});
