import { access, readFile, readdir, stat } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";
import { parseChangelog, renderChangelog } from "./changelog.mjs";
const pkg = JSON.parse(await readFile("package.json", "utf8"));
const required = ["site/index.html", "site/404.html", "site/research/index.html", "site/research/quran-61-6-and-paraclete/index.html", "site/research/quran-preservation-and-manuscripts/index.html", "site/research/how-is-a-hadith-authenticated/index.html", "site/research/muhammad-miracle-claims-and-witnesses/index.html", "site/research/uthman-and-quranic-authenticity/index.html", "site/research/dhul-qarnayn-alexander-legend/index.html", "site/research/ezra-son-of-god-claim/index.html", "site/research/quran-salvation-jews-christians/index.html", "site/research/no-compulsion-jizya-and-religious-freedom/index.html", "site/research/dhul-qarnayn-alexander-legend/index.html", "site/research/shooting-stars-and-devils/index.html", "site/sources/index.html", "site/methodology/index.html", "site/about/index.html", "site/changelog/index.html", "site/assets/site.css", "site/assets/site.js", "site/robots.txt", "site/_headers", "CHANGELOG.md", "README.md"];
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
