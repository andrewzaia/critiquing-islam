import { readFile, readdir } from "node:fs/promises";
import { Script } from "node:vm";

const dir = "site/data/qiraat/";
const manifest = JSON.parse(await readFile(dir + "manifest.json", "utf8"));
if (manifest.license !== "CC BY-SA 4.0" || manifest.counts.length !== 114 ||
    manifest.readers.length !== 7 || manifest.transmitters.length !== 14 ||
    manifest.verses !== 6236 || manifest.words !== 77432 ||
    manifest.changedWords !== 2802 || manifest.variantAssignments !== 14024 ||
    manifest.missingCsvPositions.join(",") !== "2:185:35,12:110:11") {
  throw new Error("Qiraat manifest integrity or licence regression");
}
let verses = 0, words = 0, changed = 0, assignments = 0;
const unknown = [];
const baselineIndex = new Map();
for (let s = 1; s <= 114; s++) {
  const data = JSON.parse(await readFile(dir + s + ".json", "utf8"));
  if (data.surah !== s || data.verses.length !== manifest.counts[s - 1]) {
    throw new Error("Qiraat chapter mismatch: " + s);
  }
  for (let v = 1; v <= data.verses.length; v++) {
    const verse = data.verses[v - 1];
    if (!Array.isArray(verse) || !verse.length) throw new Error("Empty verse " + s + ":" + v);
    verses++;
    baselineIndex.set(s + ":" + v, [verse.map(w => w[0]).join(" "), verse.map(w => w[1]).join(" ")]);
    for (let i = 0; i < verse.length; i++) {
      const token = verse[i];
      if (!token[0] || !token[1] || token.length > 4) throw new Error("Damaged baseline at " + s + ":" + v + ":" + (i + 1));
      words++;
      if (token[3] === 1) unknown.push(s + ":" + v + ":" + (i + 1));
      if (token[2]) {
        const diff = Object.entries(token[2]);
        if (diff.length) changed++;
        for (const [reader, value] of diff) {
          if (!/^(?:[0-9]|1[0-3])$/.test(reader) || !value || value === token[1]) {
            throw new Error("Invalid attributed word at " + s + ":" + v + ":" + (i + 1));
          }
          assignments++;
        }
      }
    }
  }
}
if (verses !== manifest.verses || words !== manifest.words || changed !== manifest.changedWords ||
    assignments !== manifest.variantAssignments || unknown.join(",") !== manifest.missingCsvPositions.join(",")) {
  throw new Error("Corpus count or source-gap regression");
}
const fatiha = JSON.parse(await readFile(dir + "1.json", "utf8"));
if (fatiha.verses[3][0][1] !== "māliki" || fatiha.verses[3][0][2]["0"] !== "maliki" ||
    Object.hasOwn(fatiha.verses[3][0][2], "9")) {
  throw new Error("Reference Hafs and known 1:4 variants have been conflated");
}
let indexed = 0;
for (const path of manifest.searchFiles) {
  if (!/^\/data\/qiraat\/search-\d+\.json$/.test(path)) throw new Error("Unexpected search URL");
  const data = JSON.parse(await readFile("site" + path, "utf8"));
  for (const row of data) {
    const ref = row[0] + ":" + row[1];
    if (row.length !== 4 || !baselineIndex.has(ref) ||
        baselineIndex.get(ref)[0] !== row[2] || baselineIndex.get(ref)[1] !== row[3]) {
      throw new Error("Search index diverges from Quran reference at " + ref);
    }
    indexed++;
  }
}
if (indexed !== 6236) throw new Error("Search data has missing or duplicate verses");
const sourceFiles = await readdir(dir);
if (sourceFiles.filter(x => /^\d+\.json$/.test(x)).length !== 114 ||
    sourceFiles.filter(x => /^search-\d+\.json$/.test(x)).length !== manifest.searchFiles.length) {
  throw new Error("One or more Quran data shards are missing");
}
const ui = await readFile("site/quran/index.html", "utf8");
for (const token of ["qiraat-search-form", "qiraat-readings", "qiraat-show-all",
  "CC BY-SA 4.0", "reconstructed scholarly transliteration", "/assets/qiraat.js", "/assets/qiraat.css"]) {
  if (!ui.includes(token)) throw new Error("Quran comparison UI lost " + token);
}
// The explorer's Hafs reference and its search rows must follow the same
// Arabic, scholarly transliteration, then English sequence as verse popups.
const english = JSON.parse(await readFile("site/data/quran-english/pickthall.json", "utf8"));
if (english.translation !== "Marmaduke Pickthall (1930)" || english.language !== "en" ||
    english.chapters.length !== 114 ||
    english.chapters.some((chapter, i) => chapter.length !== manifest.counts[i]) ||
    english.chapters.flat().length !== manifest.verses ||
    !english.chapters[3][156].includes("crucified") ||
    !english.chapters[4][31].includes("all mankind")) {
  throw new Error("Local English translation is missing or misaligned");
}
const baseMarkup = ui.slice(ui.indexOf('<div class="qiraat-base">'), ui.indexOf("</div>", ui.indexOf('<div class="qiraat-base">')));
const baseFields = ['id="qiraat-arabic"', 'id="qiraat-baseline-trans"', 'id="qiraat-baseline-english"'];
if (baseFields.some(value => !baseMarkup.includes(value)) ||
    baseFields.map(value => baseMarkup.indexOf(value)).some((position, i, positions) => i > 0 && position <= positions[i - 1]) ||
    !baseMarkup.includes('lang="ar-Latn"') || !baseMarkup.includes('lang="en"') ||
    !baseMarkup.includes("Marmaduke Pickthall (1930)")) {
  throw new Error("Quran explorer verse fields are not stacked in the required order");
}
if (!ui.includes("Each result shows Arabic, transliteration") ||
    !ui.includes("This is not a translation of every recorded reading")) {
  throw new Error("English provenance or reading scope labels are missing");
}
if (ui.split("<form ").length - 1 !== 1 || !ui.includes('role="search"') ||
    !ui.includes('id="qiraat-query"') || !ui.includes('id="qiraat-prev"') || !ui.includes('id="qiraat-next"') ||
    ["qiraat-jump-form", "qiraat-surah", "qiraat-ayah", ">Open verse<"].some(token => ui.includes(token))) {
  throw new Error("Quran explorer must use one search form with previous/next navigation");
}
const browserScript = await readFile("site/assets/qiraat.js", "utf8");
if (["qiraat-jump-form", "qiraat-surah", "qiraat-ayah"].some(token => browserScript.includes(token)) ||
    !browserScript.includes("searchInput(") || !browserScript.includes("parseRef(")) {
  throw new Error("Quran verse lookup is no longer consolidated");
}
const resultFields = ['const ar = make("span", "qiraat-result-arabic"', 'const transliteration = make("small", "qiraat-result-latin"', 'const english = make("span", "qiraat-result-english"'];
const resultSection = browserScript.slice(browserScript.indexOf("function showMatches("), browserScript.indexOf("async function loadSearchIndex("));
if (resultFields.some(field => !resultSection.includes(field)) ||
    resultFields.map(field => resultSection.indexOf(field)).some((pos, i, positions) => i > 0 && pos <= positions[i - 1])) {
  throw new Error("Quran search result text is not in Arabic, transliteration, English order");
}
for (const token of ['"/data/quran-english/pickthall.json"', 'loadEnglish().then(chapters =>',
  'english.isConnected', 'current?.s === s && current?.v === v',
  '"English translation unavailable.', 'chapters[s - 1][v - 1]']) {
  if (!browserScript.includes(token)) throw new Error("English Quran explorer loading or fallback is missing: " + token);
}
new Script(browserScript);
const css = await readFile("site/assets/qiraat.css", "utf8");
if (!css.includes("@media(max-width:600px)")) throw new Error("Quran mobile CSS missing");
if (css.includes(".qiraat-jump")) throw new Error("Unused Quran jump layout was retained");
if (!css.includes(".qiraat-english") || !css.includes(".qiraat-result-english") ||
    !css.includes(".qiraat-result-list{display:grid;grid-template-columns:minmax(0,1fr)") ||
    css.includes("max-height:85px") || css.includes("-webkit-line-clamp:2")) {
  throw new Error("Quran English verse and untruncated stacked results styles regressed");
}
const home = await readFile("site/index.html", "utf8");
if (home.includes('class="wrap editorial-note"')) throw new Error("Old home editorial panels restored");
if (!home.includes('href="/quran/"')) throw new Error("Quran explorer not linked from home");
let htmlCount = 0;
async function walk(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = folder + "/" + entry.name;
    if (entry.isDirectory()) { await walk(path); continue; }
    if (!path.endsWith(".html")) continue;
    const content = await readFile(path, "utf8");
    const navStart = content.indexOf('<nav class="navigation"');
    const footerStart = content.indexOf('<nav aria-label="Footer links">');
    if (navStart < 0 || footerStart < 0 ||
        !content.slice(navStart, content.indexOf("</nav>", navStart)).includes('href="/quran/"') ||
        !content.slice(footerStart, content.indexOf("</nav>", footerStart)).includes('href="/quran/"')) {
      throw new Error("Quran nav missing from " + path);
    }
    htmlCount++;
  }
}
await walk("site");
if (htmlCount < 44) throw new Error("Expected Quran comparison page and all existing pages");
console.log("Qiraat data and UI checks passed: " + verses + " verses, " + words +
  " words, " + changed + " changed positions, " + assignments +
  " attributed transmission changes, " + indexed + " searchable verses, " + htmlCount + " linked pages.");
