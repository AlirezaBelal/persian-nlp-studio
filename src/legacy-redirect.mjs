// Preserve existing bookmarks without keeping a second product UI.
const permitted = new Set(["analyzer", "compare", "corpus", "hekasreh", "medicine", "sentiment", "poetry", "tool-notice"]);
const requested = location.hash.slice(1);
const target = permitted.has(requested) ? requested : "corpus";
location.replace(new URL("./index.html#" + target, location.href));
