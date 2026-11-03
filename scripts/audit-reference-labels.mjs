import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

let verifiedQuran = 0;
let verifiedHadith = 0;
for (const dirent of await readdir("site/research", { withFileTypes: true })) {
  if (!dirent.isDirectory()) continue;
  const file = join("site/research", dirent.name, "index.html");
  const html = await readFile(file, "utf8");
  const boundary = html.indexOf('<section id="references">');
  if (boundary < 0) continue;
  const register = html.slice(boundary);
  const entries = [...register.matchAll(/<li id="ref-([0-9]+)">([\s\S]*?)<\/li>/g)];

  for (const match of entries) {
    const number = match[1];
    const title = match[2].match(/<strong>([^<]+)<\/strong>/)?.[1] ?? "";
    const url = (match[2].match(/<a href="([^"]+)"/)?.[1] ?? "").replaceAll("&amp;", "&");
    const quranLabel = /^Quran\s+([0-9]+):([0-9]+)/i.exec(title);
    const quranLink = /^https:\/\/quran\.com\/(?:en\/)?([0-9]+)\/([0-9]+)/i.exec(url);
    if (quranLabel && quranLink) {
      verifiedQuran++;
      if (quranLabel[1] !== quranLink[1] || quranLabel[2] !== quranLink[2]) {
        throw new Error(file + ": Quran source " + number + " title does not match its passage URL");
      }
      if (/\band\s+[0-9]+:[0-9]+/i.test(title)) {
        throw new Error(file + ": Quran source " + number + " names multiple passages but links only one");
      }
    }
    const sources = [
      { label: /^Sahih (?:al-)?Bukhari\s+([0-9]+)/i, url: /^https:\/\/sunnah\.com\/bukhari:([0-9]+)/i },
      { label: /^Sahih Muslim\s+([0-9]+[a-z]?)/i, url: /^https:\/\/sunnah\.com\/muslim:([0-9]+[a-z]?)/i }
    ];
    for (const src of sources) {
      const titleId = src.label.exec(title)?.[1];
      const urlId = src.url.exec(url)?.[1];
      if (!titleId || !urlId) continue;
      verifiedHadith++;
      if (titleId.toLowerCase() !== urlId.toLowerCase()) {
        throw new Error(file + ": hadith source " + number + " title does not match its URL");
      }
    }
  }
}
if (!verifiedQuran || !verifiedHadith) throw new Error("No primary references were validated");
console.log("Primary source labels checked: " + verifiedQuran + " Quran passages and " + verifiedHadith + " hadith records.");
