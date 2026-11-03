import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = "site/research";
const folders = await readdir(root, { withFileTypes: true });
let examined = 0;
let citedSources = 0;
let noteLinks = 0;

for (const folder of folders) {
  if (!folder.isDirectory()) continue;
  const path = join(root, folder.name, "index.html");
  const html = await readFile(path, "utf8");
  const marker = '<section id="references">';
  const boundary = html.indexOf(marker);
  if (boundary === -1) {
    if (/<li id="ref-[0-9]+">/.test(html) || /href="#ref-[0-9]+"/.test(html)) {
      throw new Error(path + ": numbered sources exist without a reference section");
    }
    continue;
  }

  const article = html.slice(0, boundary);
  const register = html.slice(boundary);
  const entries = [...register.matchAll(/<li id="ref-([0-9]+)">([\s\S]*?)<\/li>/g)];
  const sources = entries.map((match, i) => {
    const id = Number(match[1]);
    if (id !== i + 1) {
      throw new Error(path + ": reference numbers must be sequential from 1");
    }
    const source = match[2].match(/<a href="([^"]+)"[^>]*>/);
    if (!source) throw new Error(path + ": source " + id + " has no outbound citation");
    const url = source[1].replaceAll("&amp;", "&");
    if (!/^https?:\/\//i.test(url)) {
      throw new Error(path + ": source " + id + " is not an external web reference");
    }
    return { id, url };
  });
  if (!sources.length) {
    throw new Error(path + ": reference section has no numbered citations");
  }

  const seenUrls = new Set();
  for (const source of sources) {
    if (seenUrls.has(source.url)) {
      throw new Error(path + ": repeated URL counted as independent source " + source.id);
    }
    seenUrls.add(source.url);
  }

  const cited = [...article.matchAll(/href="#ref-([0-9]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  const citedIds = new Set();
  for (const match of cited) {
    const number = Number(match[1]);
    if (number < 1 || number > sources.length) {
      throw new Error(path + ": unresolved citation [ " + number + " ]");
    }
    const label = match[2].trim();
    const numericLabel = /^\[([0-9]+)\]$/.exec(label);
    if (numericLabel && Number(numericLabel[1]) !== number) {
      throw new Error(path + ": citation label and target disagree at source " + number);
    }
    citedIds.add(number);
  }
  for (const source of sources) {
    if (!citedIds.has(source.id)) {
      throw new Error(path + ": source " + source.id + " is listed but never cited");
    }
  }
  const bodyRefIds = [...article.matchAll(/id="ref-([0-9]+)"/g)];
  if (bodyRefIds.length) throw new Error(path + ": source IDs must be in the register");

  const sectionIds = [...article.matchAll(/<section id="s([0-9]+)"/g)]
    .map(match => Number(match[1]));
  if (sectionIds.length) {
    if (!sectionIds.every((number, i) => number === i + 1)) {
      throw new Error(path + ": analysis section IDs are not sequential");
    }
    for (const link of article.matchAll(/href="#s([0-9]+)"/g)) {
      if (!sectionIds.includes(Number(link[1]))) {
        throw new Error(path + ": broken analysis-section anchor " + link[1]);
      }
    }
  }
  examined++;
  citedSources += sources.length;
  noteLinks += cited.length;
}
if (examined < 30) {
  throw new Error("Expected at least 30 individually sourced investigations; found " + examined);
}
console.log(
  "Evidence audit passed: " + examined + " investigations, " +
  citedSources + " distinct in-article sources, " + noteLinks +
  " resolved source links, and no unused source entries."
);
