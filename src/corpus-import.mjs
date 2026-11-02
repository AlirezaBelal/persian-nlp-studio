/** User-owned UTF-8 text/JSONL only; no remote corpora or automatic persistence. */
export const MAX_IMPORT_BYTES = 80000;
export function importCorpus(bytes, format = 'text') {
  if (!(bytes instanceof Uint8Array)) throw new TypeError('Expected file bytes');
  if (bytes.byteLength > MAX_IMPORT_BYTES) throw new RangeError('فایل باید حداکثر ۸۰٬۰۰۰ بایت باشد.');
  let text;
  try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
  catch { throw new TypeError('فایل باید با UTF-8 ذخیره شده باشد.'); }
  if (format === 'jsonl') {
    const lines = text.split(/\r?\n/u).filter(line => line.trim());
    if (lines.length > 1000) throw new RangeError('حداکثر هزار سند پذیرفته می‌شود.');
    text = lines.map((line, index) => {
      let value;
      try { value = JSON.parse(line); } catch { throw new TypeError(`JSON نامعتبر در سطر ${index + 1}`); }
      if (!value || typeof value !== 'object' || typeof value.text !== 'string')
        throw new TypeError(`سطر ${index + 1} باید فیلد متنی text داشته باشد.`);
      return value.text;
    }).join('\n\n');
  } else if (format !== 'text') throw new TypeError('قالب پشتیبانی نمی‌شود.');
  if (text.includes('\0')) throw new TypeError('فایل متنی معتبر نیست.');
  if (text.length > 20000) throw new RangeError('متن باید حداکثر ۲۰٬۰۰۰ واحد UTF-16 باشد؛ بخشی از فایل را انتخاب کنید.');
  return text;
}
