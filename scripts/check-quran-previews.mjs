import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {parseQuranReference, findQuranReferences, expandQuranRange, validateEnglishChapters} from "../site/assets/quran-previews.js";

const labels = text => findQuranReferences(text).map(({ref}) => ref.label);
assert.deepEqual(labels("Quran 4:157-158"), ["4:157-158"]);
assert.deepEqual(labels("Quran 5:43, 5:47, 5:48 and 10:94"), ["5:43","5:47","5:48","10:94"]);
assert.deepEqual(labels("Qur'an 65:4; 2:228 and 2:234"), ["65:4","2:228","2:234"]);
assert.deepEqual(labels("Qurʾān 61:6 and Quran 7:157"), ["61:6","7:157"]);
assert.deepEqual(labels("Quran 1:7-2:2"), ["1:7-2:2"]);
assert.deepEqual(labels("Genesis 37:28 and Quran 12:20"), ["12:20"]);
assert.deepEqual(labels("Quran 4:157 and John 1:18"), ["4:157"]);
assert.deepEqual(labels("John 14:16-17 and Acts 2:4"), []);
assert.deepEqual(labels("2:62, 5:69 and 3:85"), []);
assert.deepEqual(labels("Quran 2:62, 5:69 and 3:85"), ["2:62","5:69","3:85"]);
assert.equal(parseQuranReference("4:0"), null);
assert.equal(parseQuranReference("115:1"), null);
assert.equal(parseQuranReference("4:158-157"), null);
assert.equal(parseQuranReference("not a reference"), null);

const manifest = JSON.parse(await readFile("site/data/qiraat/manifest.json", "utf8"));
// The complete local English text must align verse-for-verse with the Hafs reference.
// Do not let a missing or malformed translation silently pair the wrong English text.
const english = JSON.parse(await readFile("site/data/quran-english/pickthall.json", "utf8"));
assert.equal(english.language, "en");
assert.equal(english.translation, "Marmaduke Pickthall (1930)");
assert.equal(english.source_blob_sha, "21553802599fabf06f1b35046d2f99ea85979399");
assert.equal(english.source_dataset_license, "CC BY-SA 4.0");
assert.ok(validateEnglishChapters(english, manifest.counts));
assert.equal(english.chapters.flat().length, 6236);
assert.match(english.chapters[3][156], /crucified/i);
assert.match(english.chapters[4][31], /all mankind/i);
assert.equal(validateEnglishChapters({...english, chapters: english.chapters.slice(1)}, manifest.counts), false);
assert.equal(validateEnglishChapters({...english, chapters: [english.chapters[0].slice(1), ...english.chapters.slice(1)]}, manifest.counts), false);
assert.equal(validateEnglishChapters({...english, chapters: [["", ...english.chapters[0].slice(1)], ...english.chapters.slice(1)]}, manifest.counts), false);

const range = expandQuranRange(parseQuranReference("4:157-158"), manifest.counts);
assert.equal(range.total, 2);
assert.deepEqual(range.items.map(v => v.key), ["4:157", "4:158"]);
const boundary = expandQuranRange(parseQuranReference("1:7-2:2"), manifest.counts);
assert.deepEqual(boundary.items.map(v => v.key), ["1:7", "2:1", "2:2"]);
const long = expandQuranRange(parseQuranReference("2:1-286"), manifest.counts);
assert.equal(long.total, 286);
assert.equal(long.items.length, 12);
assert.equal(long.omitted, 274);
assert.equal(expandQuranRange(parseQuranReference("2:287"), manifest.counts), null);

const page = await readFile("site/research/crucifixion-substitution-claim/index.html", "utf8");
assert.ok(page.includes("Quran 4:157"));
assert.ok(labels("Quran 4:157-158").length);
const sources = await readFile("site/methodology/index.html", "utf8");
assert.ok(sources.includes("https://quran.com/3/78"));

// Prevent broad preview targeting on clickable research cards.
// Card navigation stays on the parent anchor; only the verse-text span previews.
const previewScript = await readFile("site/assets/quran-previews.js", "utf8");
assert.ok(previewScript.includes('document.createElement(parentLink ? "span" : "a")'));
assert.ok(previewScript.includes('.closest?.(".quran-preview-reference, a.quran-preview-source")'));
assert.ok(!previewScript.includes('parentLink.dataset.quranReference ='),
  "Never annotate a whole research card with a Quran hover target");
const homePage = await readFile("site/index.html", "utf8");
assert.ok(homePage.includes('research-card is-live') && homePage.includes("Quran 65:4"),
  "The homepage research-card regression fixture has changed");

const builder = await readFile("scripts/build.mjs", "utf8");
assert.ok(builder.includes('src="/assets/quran-previews.js"'),
  "Generated pages must install Quran previews sitewide");
const styles = await readFile("site/assets/site.css", "utf8");
assert.ok(styles.includes(".quran-preview-card") && styles.includes("@media(max-width:600px)"));
assert.ok(!styles.includes(".quran-preview-pair"), "Quran previews must not use side-by-side columns");
assert.ok(!styles.includes('grid-template-areas:"english arabic"'));
assert.ok(styles.includes(".quran-preview-arabic") &&
  styles.includes(".quran-preview-latin") && styles.includes(".quran-preview-english"),
  "All three text rows must retain their styles");
assert.ok(previewScript.includes('loadEnglish().catch(() => null)'), "English failures must not disable the Arabic preview");
assert.ok(previewScript.includes('section.append(arabic, latin, english)'),
  "Each verse must show Arabic, transliteration and English in that order");
assert.ok(!previewScript.includes('pair.append(arabic, english)'));
assert.ok(previewScript.includes('latin.lang = "ar-Latn"'));
assert.ok(previewScript.includes('english.lang = "en"'));
assert.ok(previewScript.includes("if (thisRequest !== serial) return;"), "Do not apply stale hover translations");
console.log("Sitewide Quran preview references, English alignment, failure fallback, and responsive presentation checks passed.");
