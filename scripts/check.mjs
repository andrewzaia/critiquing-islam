import { access, readFile, readdir, stat } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";
import { parseChangelog, renderChangelog } from "./changelog.mjs";
const pkg = JSON.parse(await readFile("package.json", "utf8"));
const doctrineStudies = ["tawhid-and-trinity","divine-sonship","jesus-prophet-or-god","crucifixion-substitution-claim","tahrif-and-biblical-corruption","quran-finality-and-preservation","muhammad-seal-of-prophets","original-sin-and-atonement","islamic-salvation-faith-deeds-mercy","jesus-return-eschatology"];
const required = [...doctrineStudies.map(x => "site/research/" + x + "/index.html"), "site/research/abrogated-quranic-recitation/index.html", "site/research/theology-evidence-audit/index.html", "site/research/al-muhaymin-and-quran-5-48/index.html", "site/index.html", "site/404.html", "site/research/index.html", "site/research/quran-61-6-and-paraclete/index.html", "site/research/quran-preservation-and-manuscripts/index.html", "site/research/how-is-a-hadith-authenticated/index.html", "site/research/muhammad-miracle-claims-and-witnesses/index.html", "site/research/uthman-and-quranic-authenticity/index.html", "site/research/dhul-qarnayn-alexander-legend/index.html", "site/research/ezra-son-of-god-claim/index.html", "site/research/quran-salvation-jews-christians/index.html", "site/research/no-compulsion-jizya-and-religious-freedom/index.html", "site/research/shooting-stars-and-devils/index.html", "site/sources/index.html", "site/methodology/index.html", "site/about/index.html", "site/changelog/index.html", "site/assets/site.css", "site/assets/site.js", "site/robots.txt", "site/_headers", "CHANGELOG.md", "README.md"];
if (!/^\d+\.\d+\.\d+$/.test(pkg.version)) throw new Error("Version must use semantic versioning");
for (const path of required) await access(path);
const entries = parseChangelog(await readFile("CHANGELOG.md", "utf8"), pkg.version);
if (entries.length < 2 || !renderChangelog(entries).includes("v" + pkg.version)) {
  throw new Error("Invalid public release history");
}
const historyTemplate = await readFile("site/changelog/index.html", "utf8");
if (!historyTemplate.includes("{{CHANGELOG_ENTRIES}}") ||
    !historyTemplate.includes("{{CHANGELOG_COUNT}}")) {
  throw new Error("Changelog template placeholders are missing");
}
const htmlFiles = [];
async function list(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) await list(path);
    else if (path.endsWith(".html")) htmlFiles.push(path);
  }
}
await list("site");
const fileSet = new Set();
async function collect(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) await collect(path);
    else fileSet.add(resolve(path));
  }
}
await collect("site");
for (const path of htmlFiles) {
  const content = await readFile(path, "utf8");
  if (!content.includes("{{VERSION}}")) throw new Error(path + " lacks shared version placeholder");
  if (!content.includes('<main id="main">')) throw new Error(path + " lacks main landmark");
  if (/[\u2010-\u2015\u2212]/.test(content)) throw new Error(path + " contains a typographic dash");
  for (const match of content.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1].split("#")[0].split("?")[0];
    if (!target || !target.startsWith("/")) continue;
    const base = join("site", target);
    const candidate = target.endsWith("/") ? join(base, "index.html") : base;
    if (!fileSet.has(resolve(candidate))) throw new Error(path + ": missing internal link " + target);
  }
}
if (!htmlFiles.length) throw new Error("No HTML pages found");
console.log("Checked " + htmlFiles.length + " HTML pages, internal assets, and semantic version v" + pkg.version);

const doctrineHub = await readFile("site/research/theology-evidence-audit/index.html", "utf8");
const doctrineIndex = await readFile("site/research/index.html", "utf8");
for (const slug of doctrineStudies) {
  const path = "site/research/" + slug + "/index.html";
  const content = await readFile(path, "utf8");
  const sections = (content.match(/<section id="s[0-9]+"/g) || []).length;
  const references = (content.match(/<li id="ref-[0-9]+"/g) || []).length;
  const visibleWords = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
  const unresolvedReferences = [...content.matchAll(/href="#ref-([0-9]+)"/g)].filter(
    match => !content.includes('id="ref-' + match[1] + '"')
  );
  if (unresolvedReferences.length) {
    throw new Error(path + " contains broken source-note anchors");
  }
  if (sections < 10 || references < 10 || visibleWords < 1100) {
    throw new Error(path + " is not a substantive, independently referenced investigation: " +
      sections + " sections, " + references + " references, " + visibleWords + " words");
  }
  for (const catalogue of [doctrineHub, doctrineIndex]) {
    if (!catalogue.includes('href="/research/' + slug + '/"')) {
      throw new Error("The doctrine study is missing from the research guide or index: " + slug);
    }
  }
}
const depthThresholds = new Map([
  ["tawhid-and-trinity", { sections: 16, references: 19 }],
  ["divine-sonship", { sections: 16, references: 21 }],
  ["jesus-prophet-or-god", { sections: 15, references: 22 }]
]);
for (const [slug, threshold] of depthThresholds) {
  const content = await readFile("site/research/" + slug + "/index.html", "utf8");
  const sections = (content.match(/<section id="s[0-9]+"/g) || []).length;
  const references = (content.match(/<li id="ref-[0-9]+"/g) || []).length;
  if (sections < threshold.sections || references < threshold.references) {
    throw new Error("Expanded investigation has regressed: " + slug);
  }
}
const criticalHistoryDepth = [["crucifixion-substitution-claim",17,22],["tahrif-and-biblical-corruption",17,25],["quran-finality-and-preservation",19,18]];
for (const [slug, minSections, minReferences] of criticalHistoryDepth) {
  const content = await readFile("site/research/" + slug + "/index.html", "utf8");
  const sections = (content.match(/<section id="s[0-9]+"/g) || []).length;
  const references = (content.match(/<li id="ref-[0-9]+"/g) || []).length;
  if (sections < minSections || references < minReferences) {
    throw new Error("Critical-history investigation has regressed: " + slug);
  }
}
const finalDoctrineDepth = [["muhammad-seal-of-prophets",16,18],["original-sin-and-atonement",17,18],["islamic-salvation-faith-deeds-mercy",17,22],["jesus-return-eschatology",17,17]];
for (const [slug, minSections, minReferences] of finalDoctrineDepth) {
  const html = await readFile("site/research/" + slug + "/index.html", "utf8");
  const sections = [...html.matchAll(/<section id="s([0-9]+)"/g)].map(match => Number(match[1]));
  const references = [...html.matchAll(/<li id="ref-([0-9]+)"/g)].map(match => Number(match[1]));
  if (sections.length < minSections || references.length < minReferences ||
      !sections.every((n, i) => n === i + 1) ||
      !references.every((n, i) => n === i + 1)) {
    throw new Error("Expanded study has incomplete or non-sequential sections/sources: " + slug);
  }
  for (const kind of ["s", "ref-"]) {
    const numbers = kind === "s" ? sections : references;
    const misses = [...html.matchAll(new RegExp('href="#' + kind + '([0-9]+)"', "g"))]
      .filter(match => !numbers.includes(Number(match[1])));
    if (misses.length) throw new Error("Expanded study contains unresolved " + kind + " links: " + slug);
  }
  const urls = [...html.matchAll(/<li id="ref-[0-9]+">[\s\S]*?<a href="([^"]+)" target="_blank"/g)]
    .map(match => match[1].replaceAll("&amp;", "&"));
  if (urls.length !== references.length || new Set(urls).size !== urls.length) {
    throw new Error("Expanded study source register has duplicate or missing URLs: " + slug);
  }
}
const recitationStudy = await readFile("site/research/abrogated-quranic-recitation/index.html", "utf8");
const recitationSections = [...recitationStudy.matchAll(/<section id="s([0-9]+)"/g)].map(match => Number(match[1]));
const recitationReferences = [...recitationStudy.matchAll(/<li id="ref-([0-9]+)"/g)].map(match => Number(match[1]));
const recitationWords = recitationStudy.slice(recitationStudy.indexOf('<article class="prose">'), recitationStudy.indexOf('<section id="references">'))
  .replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
if (recitationSections.length < 12 || recitationReferences.length < 19 || recitationWords < 2200 ||
    !recitationSections.every((n, i) => n === i + 1) ||
    !recitationReferences.every((n, i) => n === i + 1)) {
  throw new Error("CI-032 no longer satisfies its full research-depth and citation requirements");
}
for (const page of [
  "site/research/index.html",
  "site/index.html",
  "site/research/quran-finality-and-preservation/index.html",
  "site/research/uthman-and-quranic-authenticity/index.html",
  "site/research/tahrif-and-biblical-corruption/index.html"
]) {
  const html = await readFile(page, "utf8");
  if (!html.includes('href="/research/abrogated-quranic-recitation/"')) {
    throw new Error(page + " lacks the CI-032 cross-reference");
  }
}
await import("./audit-evidence.mjs");
await import("./audit-reference-labels.mjs");
await import("./audit-claim-citations.mjs");
console.log("Verified ten standalone doctrine investigations and their research index entries.");
