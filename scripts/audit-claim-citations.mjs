import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = "site/research";
const scholars = [
  ["Ibn Kathir", /\bIbn Kathir\b/i, /Ibn Kathir/i],
  ["al-Tabari", /\bal.Tabari\b/i, /Tabari/i],
  ["al-Jalalayn", /\bal.Jalalayn\b/i, /Jalalayn/i],
  ["Houghton", /\bHoughton\b/i, /Houghton/i],
  ["Nongbri", /\bNongbri\b/i, /Nongbri/i],
  ["van Putten", /\bvan Putten\b/i, /van Putten/i],
  ["Sadeghi", /\bSadeghi\b/i, /Sadeghi/i]
];
const reviewed = [
  ["is-jesus-god", "The Septuagint is a family of translation texts", [32]],
  ["is-jesus-god", "The classical commentary of Ibn Kathir explicitly", [33]],
  ["muhammad-seal-of-prophets", "Ibn Kathir's argument assumes", [2]],
  ["quran-65-4-and-marriage-age", "An adult with absent menstruation may be within the wording", [1, 5, 6]],
  ["quran-preservation-and-manuscripts", "Sadeghi and Goudarzi examine", [12]],
  ["tahrif-and-biblical-corruption", "Houghton's specific finding", [18, 19]],
  ["abrogated-quranic-recitation", "Chain-level qualification", [3, 4]],
  ["abrogated-quranic-recitation", "The Umar accounts are not independent", [5, 6]],
  ["muhammad-miracle-claims-and-witnesses", "Visible convergence in the isnads", [16, 17, 18, 19]]
];
const pages = new Map();
let scholarMatches = 0;
let auditedStudies = 0;

for (const folder of await readdir(root, { withFileTypes: true })) {
  if (!folder.isDirectory()) continue;
  const html = await readFile(join(root, folder.name, "index.html"), "utf8");
  pages.set(folder.name, html);
  const stop = html.indexOf('<section id="references">');
  if (stop < 0) continue;
  auditedStudies++;
  const body = html.slice(0, stop);
  const sourceTitles = new Map(
    [...html.slice(stop).matchAll(/<li id="ref-([0-9]+)">[\s\S]*?<strong>([^<]+)<\/strong>/g)]
      .map(match => [Number(match[1]), match[2]])
  );
  for (const paragraph of body.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)) {
    const content = paragraph[1].replace(/<[^>]*>/g, " ");
    const ids = [...paragraph[1].matchAll(/href="#ref-([0-9]+)"/g)]
      .map(match => Number(match[1]));
    if (!ids.length) continue;
    for (const [name, mention, title] of scholars) {
      if (!mention.test(content)) continue;
      if (!ids.some(id => title.test(sourceTitles.get(id) ?? ""))) {
        throw new Error(
          folder.name + ": a paragraph naming " + name +
          " cites no reference actually attributed to that scholar"
        );
      }
      scholarMatches++;
    }
  }
}
if (auditedStudies < 30) throw new Error("Too few studies for source attribution audit");

for (const [slug, phrase, required] of reviewed) {
  const html = pages.get(slug);
  if (!html) throw new Error("Missing reviewed article " + slug);
  const start = html.indexOf(phrase);
  if (start < 0 || start >= html.indexOf('<section id="references">')) {
    throw new Error("Reviewed source-level finding missing: " + slug + " / " + phrase);
  }
  const paragraphStart = html.lastIndexOf("<p", start);
  const paragraphEnd = html.indexOf("</p>", start);
  if (paragraphStart < 0 || paragraphEnd < start) {
    throw new Error("Reviewed claim not inside a paragraph: " + slug);
  }
  const paragraph = html.slice(paragraphStart, paragraphEnd);
  for (const id of required) {
    if (!paragraph.includes('href="#ref-' + id + '"')) {
      throw new Error("Reviewed claim lost required citation " + slug + " #" + id);
    }
  }
}
console.log(
  "Claim citation check passed: " + auditedStudies +
  " studies, " + scholarMatches + " named-scholar citations, " +
  reviewed.length + " manually reviewed source mappings."
);
