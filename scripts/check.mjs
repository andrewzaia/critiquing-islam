import { access, readFile, readdir, stat } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";
import { parseChangelog, renderChangelog } from "./changelog.mjs";
const pkg = JSON.parse(await readFile("package.json", "utf8"));
const doctrineStudies = ["tawhid-and-trinity","divine-sonship","jesus-prophet-or-god","crucifixion-substitution-claim","tahrif-and-biblical-corruption","quran-finality-and-preservation","muhammad-seal-of-prophets","original-sin-and-atonement","islamic-salvation-faith-deeds-mercy","jesus-return-eschatology"];
const required = [...doctrineStudies.map(x => "site/research/" + x + "/index.html"), "site/research/abrogated-quranic-recitation/index.html", "site/research/theology-evidence-audit/index.html", "site/research/al-muhaymin-and-quran-5-48/index.html", "site/index.html", "site/404.html", "site/quran/index.html", "site/assets/qiraat.js", "site/assets/quran-previews.js", "site/assets/qiraat.css", "site/assets/qf-live.js", "functions/api/quran.js", "site/research/index.html", "site/research/quran-61-6-and-paraclete/index.html", "site/research/quran-preservation-and-manuscripts/index.html", "site/research/how-is-a-hadith-authenticated/index.html", "site/research/muhammad-miracle-claims-and-witnesses/index.html", "site/research/uthman-and-quranic-authenticity/index.html", "site/research/dhul-qarnayn-alexander-legend/index.html", "site/research/ezra-son-of-god-claim/index.html", "site/research/quran-salvation-jews-christians/index.html", "site/research/no-compulsion-jizya-and-religious-freedom/index.html", "site/research/shooting-stars-and-devils/index.html", "site/sources/index.html", "site/methodology/index.html", "site/about/index.html", "site/changelog/index.html", "site/assets/site.css", "site/assets/site.js", "site/robots.txt", "site/_headers", "CHANGELOG.md", "README.md"];
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
const expandedEarlyStudies = [
  ["inheritance-shares-and-awl", 4, 6],
  ["quran-5-116-and-trinity", 4, 10],
  ["mary-sister-of-aaron", 4, 10]
];
for (const [slug, requiredSections, requiredSources] of expandedEarlyStudies) {
  const html = await readFile("site/research/" + slug + "/index.html", "utf8");
  const depth = [...html.matchAll(/<section id="depth([0-9]+)"/g)].map(match => Number(match[1]));
  const refs = [...html.matchAll(/<li id="ref-([0-9]+)"/g)].map(match => Number(match[1]));
  const navLinks = [...html.matchAll(/href="#depth([0-9]+)"/g)].map(match => Number(match[1]));
  if (depth.length < requiredSections || refs.length < requiredSources ||
      !depth.every((id, i) => id === i + 1) ||
      !depth.every(id => navLinks.includes(id)) ||
      !refs.every((id, i) => id === i + 1)) {
    throw new Error("Early investigation research depth has regressed: " + slug);
  }
}
const evidenceMethodology = await readFile("site/methodology/index.html", "utf8");
for (const required of [
  "Quran-first research standard",
  "Hadith and commentary: limited evidentiary roles",
  "Distortion claims and an equal standard"
]) {
  if (!evidenceMethodology.includes(required)) {
    throw new Error("Primary-text evidence standard is missing: " + required);
  }
}
const primaryTextFindings = [
  ["inheritance-shares-and-awl", "Direct textual finding:"],
  ["quran-5-116-and-trinity", "Direct textual finding:"],
  ["mary-sister-of-aaron", "Direct textual finding:"],
  ["tahrif-and-biblical-corruption", "Quran-first verdict:"],
  ["crucifixion-substitution-claim", "Quran-first verdict:"],
  ["quran-finality-and-preservation", "Quran-first finding:"],
  ["islamic-salvation-faith-deeds-mercy", "Quran-first finding:"],
  ["jesus-return-eschatology", "Quran-first finding:"],
  ["muhammad-seal-of-prophets", "Quran-first finding:"],
  ["al-muhaymin-and-quran-5-48", "What the Quran establishes:"],
  ["quran-and-earlier-scriptures", "Textual standard:"],
  ["theology-evidence-audit", "Reading standard:"]
];
for (const [slug, assertion] of primaryTextFindings) {
  const html = await readFile("site/research/" + slug + "/index.html", "utf8");
  if (!html.includes(assertion)) {
    throw new Error("Research reverted to an unsupported later-source resolution: " + slug);
  }
}
const revisedPrimaryStudies = [
  ["quran-65-4-and-marriage-age", "language", "scope", "An adult-only limitation is not written into Quran 65:4", 11],
  ["quran-salvation-jews-christians", null, null, "Text-first finding:", 10],
  ["no-compulsion-jizya-and-religious-freedom", null, null, "Text-first finding:", 12],
  ["quran-preservation-and-manuscripts", null, null, "Text-first finding:", 15]
];
for (const [slug, firstSection, secondSection, finding, minSources] of revisedPrimaryStudies) {
  const html = await readFile("site/research/" + slug + "/index.html", "utf8");
  const sourceNumbers = [...html.matchAll(/<li id="ref-([0-9]+)"/g)]
    .map(match => Number(match[1]));
  if (sourceNumbers.length < minSources || !html.includes(finding)) {
    throw new Error("Primary-text audit regression: " + slug);
  }
  for (const id of [firstSection, secondSection].filter(Boolean)) {
    if (!html.includes('<section id="' + id + '">') ||
        !html.includes('href="#' + id + '"')) {
      throw new Error("Primary-text investigation section or navigation missing: " + slug + "/" + id);
    }
  }
}
const ageStudy = await readFile("site/research/quran-65-4-and-marriage-age/index.html", "utf8");
const ageConclusionStart = ageStudy.indexOf('<section id="conclusion">');
const ageReferencesStart = ageStudy.indexOf('<section id="references">');
if (ageConclusionStart < 0 || ageReferencesStart <= ageConclusionStart) {
  throw new Error("Quran 65:4 conclusion missing");
}
const ageConclusion = ageStudy.slice(ageConclusionStart, ageReferencesStart);
for (const citation of ['href="#ref-1"', 'href="#ref-2"', 'href="#ref-4"', 'href="#ref-7"']) {
  if (!ageConclusion.includes(citation)) {
    throw new Error("Quran 65:4 verdict lost Quranic wording or translation evidence: " + citation);
  }
}
const expandedClaimStudies = [
  ["quran-61-6-and-paraclete", 10, 11, ["quran-claim", "greek-word", "burden"], "Text-first verdict:"],
  ["muhammad-in-torah-and-gospel", 13, 17, ["claim-scope", "moses-kinship", "missing-evidence"], "Text-first verdict:"],
  ["muhammad-miracle-claims-and-witnesses", 16, 21, ["requested-signs", "named-witnesses", "evidence-threshold"], "Quran-first verdict:"],
  ["shooting-stars-and-devils", 14, 14, ["arabic", "physical-test", "scientific-claim"], "Text-first finding:"]
];
for (const [slug, minSections, minReferences, requiredIds, finding] of expandedClaimStudies) {
  const html = await readFile("site/research/" + slug + "/index.html", "utf8");
  const sections = [...html.matchAll(/<section id="([^"]+)"><span class="section-index">/g)]
    .map(match => match[1]).filter(id => id !== "references");
  const sources = [...html.matchAll(/<li id="ref-([0-9]+)"/g)]
    .map(match => Number(match[1]));
  const body = html.slice(html.indexOf('<article class="prose'), html.indexOf('<section id="references">'));
  const words = body.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
  if (sections.length < minSections || sources.length < minReferences ||
      words < 1150 || !body.includes(finding) ||
      !sources.every((n, i) => n === i + 1)) {
    throw new Error("Primary-text depth or reference regression: " + slug);
  }
  for (const id of requiredIds) {
    if (!html.includes('<section id="' + id + '">') ||
        !html.includes('href="#' + id + '"')) {
      throw new Error("Primary-text study lost a section or navigation: " + slug + "/" + id);
    }
  }
  const citations = [...body.matchAll(/href="#ref-([0-9]+)"/g)]
    .map(match => Number(match[1]));
  if (citations.some(n => !sources.includes(n))) {
    throw new Error("Expanded study has an unresolved reference: " + slug);
  }
}

const scientificClaims = await readFile("site/research/quran-scientific-miracles/index.html", "utf8");
for (const [slug, secMinimum, refMinimum, anchors] of [
  ["ezra-son-of-god-claim", 14, 15, ["arabic", "fourth-ezra", "sect-test"]],
  ["muhammad-miracle-claims-and-witnesses", 21, 25, ["contemporaries", "more-signs", "lunar-test"]],
  ["quran-scientific-miracles", 13, 18, ["joined", "expansion", "embryology", "fluid", "verdict"]]
]) {
  const doc = await readFile("site/research/" + slug + "/index.html", "utf8");
  const sections = [...doc.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(x => x[1]).filter(x => x !== "references");
  const refs = [...doc.matchAll(/<li id="ref-(\d+)"/g)].map(x => Number(x[1]));
  const links = [...doc.matchAll(/href="#ref-(\d+)"/g)].map(x => Number(x[1]));
  if (sections.length < secMinimum || refs.length < refMinimum || !refs.every((n, i) => n === i + 1) ||
      links.some(n => !refs.includes(n)) || refs.some(n => !links.includes(n))) {
    throw new Error("v0.25.0 research depth or citation regression: " + slug);
  }
  for (const id of anchors) if (!doc.includes('<section id="' + id + '">') || !doc.includes('href="#' + id + '"'))
    throw new Error("v0.25.0 missing section navigation: " + slug + "/" + id);
}
for (const p of ["site/index.html", "site/research/index.html", "site/sources/index.html"]) {
  const html = await readFile(p, "utf8");
  if (!html.includes('href="/research/quran-scientific-miracles/"')) throw new Error("CI-033 missing from " + p);
}
for (const text of ["Quran 21:30", "Quran 51:47", "Quran 23:12-14", "Quran 86:5-7", "Text-first verdict:"]) {
  if (!scientificClaims.includes(text)) throw new Error("Missing primary scientific study evidence: " + text);
}

const ci020Html = await readFile("site/research/haman-in-pharaohs-court/index.html", "utf8");
const ci020Body = ci020Html.slice(ci020Html.indexOf('<article class="prose'), ci020Html.indexOf('<section id="references">'));
const ci020Sections = [...ci020Html.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(m => m[1]).filter(x => x !== "references");
const ci020Sources = [...ci020Html.matchAll(/<li id="ref-(\d+)"/g)].map(m => Number(m[1]));
const ci020Cited = [...ci020Body.matchAll(/href="#ref-(\d+)"/g)].map(m => Number(m[1]));
const ci020Words = ci020Body.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
if (ci020Sections.length < 17 || ci020Sources.length < 20 || ci020Words < 1700 ||
    !ci020Sources.every((n, i) => n === i + 1) ||
    ci020Cited.some(n => !ci020Sources.includes(n)) || ci020Sources.some(n => !ci020Cited.includes(n)) ||
    !ci020Body.includes("Text-first verdict:")) {
  throw new Error("CI-020 failed historical research depth, verdict or reference checks");
}
for (const id of ["claim", "six", "esther", "chronology", "babel", "distinct", "epigraphy", "evidence-matrix", "verdict"]) {
  if (!ci020Html.includes('<section id="' + id + '">') || !ci020Html.includes('href="#' + id + '"')) {
    throw new Error("CI-020 section missing from its navigation: " + id);
  }
}
const ci020Guide = await readFile("site/research/theology-evidence-audit/index.html", "utf8");
if (ci020Guide.includes("CI-020") || !ci020Guide.includes("RESEARCH GUIDE / TEN DOCTRINES")) {
  throw new Error("The former CI-020 guide must remain accessible but unnumbered");
}
for (const path of ["site/index.html", "site/research/index.html", "site/sources/index.html"]) {
  const html = await readFile(path, "utf8");
  if (!html.includes('href="/research/haman-in-pharaohs-court/"') ||
      !html.includes('href="/research/theology-evidence-audit/"')) {
    throw new Error("CI-020 or doctrine guide navigation missing: " + path);
  }
}


const samiriDoc = await readFile("site/research/al-samiri-and-golden-calf/index.html", "utf8");
const samiriBody = samiriDoc.slice(samiriDoc.indexOf('<article class="prose'), samiriDoc.indexOf('<section id="references">'));
const samiriSections = [...samiriDoc.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(m => m[1]).filter(x => x !== "references");
const samiriRefs = [...samiriDoc.matchAll(/<li id="ref-(\d+)"/g)].map(m => Number(m[1]));
const samiriCitations = [...samiriBody.matchAll(/href="#ref-(\d+)"/g)].map(m => Number(m[1]));
const samiriWordCount = samiriBody.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
if (samiriSections.length < 18 || samiriRefs.length < 21 || samiriWordCount < 1900 ||
    !samiriRefs.every((n, i) => n === i + 1) ||
    samiriCitations.some(n => !samiriRefs.includes(n)) ||
    samiriRefs.some(n => !samiriCitations.includes(n))) {
  throw new Error("CI-034 depth or reference regression");
}
for (const id of ["assertion", "exodus", "arabic-name", "conditional", "omri", "other-meanings", "matrix", "verdict"]) {
  if (!samiriDoc.includes('<section id="' + id + '">') || !samiriDoc.includes('href="#' + id + '"')) {
    throw new Error("CI-034 section or navigation missing: " + id);
  }
}
for (const phrase of ["Text-first verdict:", "Historical verdict:", "Exodus 32:1-6", "I Kings 16:24"]) {
  if (!samiriDoc.includes(phrase)) throw new Error("CI-034 source finding missing: " + phrase);
}
const newHome = await readFile("site/index.html", "utf8");
const newCss = await readFile("site/assets/site.css", "utf8");
const newSources = await readFile("site/sources/index.html", "utf8");
if (newHome.includes('class="wrap editorial-note"') ||
    !newCss.includes(".inline-link{white-space:normal;overflow-wrap:anywhere}") ||
    !newCss.includes(".section-head{flex-wrap:wrap}")) {
  throw new Error("Homepage simplification or mobile wrapping is incomplete");
}
for (const url of [
  "/research/al-samiri-and-golden-calf/",
  "/research/abrogated-quranic-recitation/",
  "/research/theology-evidence-audit/"
]) {
  if (!newHome.includes('href="' + url + '"')) throw new Error("Homepage lost a key research route: " + url);
}
for (const doc of [doctrineIndex, newSources]) {
  if (!doc.includes('href="/research/al-samiri-and-golden-calf/"')) {
    throw new Error("CI-034 absent from library or source register");
  }
}


const joseph = await readFile("site/research/joseph-dirhams-and-coinage/index.html", "utf8");
const josephBody = joseph.slice(joseph.indexOf('<article class="prose'), joseph.indexOf('<section id="references">'));
const josephSections = [...joseph.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(m => m[1]).filter(id => id !== "references");
const josephSources = [...joseph.matchAll(/<li id="ref-(\d+)"/g)].map(m => Number(m[1]));
const josephCites = [...josephBody.matchAll(/href="#ref-(\d+)"/g)].map(m => Number(m[1]));
const josephWords = josephBody.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
if (josephSections.length < 17 || josephSources.length < 17 || josephWords < 2100 ||
    !josephSources.every((n, i) => n === i + 1) ||
    josephSources.some(n => !josephCites.includes(n)) ||
    josephCites.some(n => !josephSources.includes(n))) {
  throw new Error("CI-035 regression in research depth or reference integrity");
}
for (const section of ["arabic", "counted", "genesis", "egypt", "coinage", "etymology", "lexical-bridge", "matrix", "verdict"]) {
  if (!joseph.includes('<section id="' + section + '">') || !joseph.includes('href="#' + section + '"')) {
    throw new Error("CI-035 table of contents missing section: " + section);
  }
}
for (const text of ["Text-first verdict:", "Historical verdict:", "unit of weight", "Genesis 37:28", "minted coinage"]) {
  if (!joseph.includes(text)) throw new Error("CI-035 evidence qualification was lost: " + text);
}
// CI-036 must remain a substantive, individually sourced investigation.
const abrahamStudy = await readFile("site/research/abraham-father-azar-terah/index.html", "utf8");
const abrahamBody = abrahamStudy.slice(abrahamStudy.indexOf('<article class="prose'), abrahamStudy.indexOf('<section id="references">'));
const abrahamSections = [...abrahamStudy.matchAll(/<section id="([^"]+)"><span class="section-index">/g)]
  .map(m => m[1]).filter(id => id !== "references");
const abrahamRefs = [...abrahamStudy.matchAll(/<li id="ref-(\d+)">/g)].map(m => Number(m[1]));
const abrahamCited = [...abrahamBody.matchAll(/href="#ref-(\d+)"/g)].map(m => Number(m[1]));
const abrahamWords = abrahamBody.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
if (abrahamSections.length < 18 || abrahamRefs.length < 20 || abrahamWords < 2600 ||
    !abrahamRefs.every((number, i) => number === i + 1) ||
    abrahamCited.some(number => !abrahamRefs.includes(number)) ||
    abrahamRefs.some(number => !abrahamCited.includes(number)) ||
    !abrahamBody.includes("Text-first verdict:") ||
    !abrahamBody.includes("Historical verdict:")) {
  throw new Error("CI-036 lost research depth, complete citations or independent verdicts");
}
for (const id of ["claim","arabic","genesis","joshua","greek","josephus","jubilees","manuscripts",
  "midrash","uncle","alias","parents","matrix","verdict"]) {
  if (!abrahamStudy.includes('<section id="' + id + '">') ||
      !abrahamStudy.includes('href="#' + id + '"')) {
    throw new Error("CI-036 source-critical section missing: " + id);
  }
}
for (const item of ["Quran 6:74","Genesis 11","Joshua 24:2","Jubilees 12:1-8",
  "4Q216","possible reconciliations","unverified"]) {
  if (!abrahamStudy.includes(item)) throw new Error("CI-036 evidence limitation lost: " + item);
}
for (const path of ["site/index.html", "site/research/index.html", "site/sources/index.html"]) {
  if (!(await readFile(path,"utf8")).includes('href="/research/abraham-father-azar-terah/"')) {
    throw new Error("CI-036 must be discoverable through main research navigation: " + path);
  }
}

// CI-037: protect a complete source-critical rather than a source-directory article.
const ci037 = await readFile("site/research/quran-5-32-mishnah-sanhedrin/index.html", "utf8");
const ci037Body = ci037.slice(ci037.indexOf('<article class="prose'), ci037.indexOf('<section id="references">'));
const ci037Sections = [...ci037.matchAll(/<section id="([^"]+)"><span class="section-index">/g)]
  .map(m => m[1]).filter(id => id !== "references");
const ci037Refs = [...ci037.matchAll(/<li id="ref-(\d+)">/g)].map(m => Number(m[1]));
const ci037Cited = [...ci037Body.matchAll(/href="#ref-(\d+)"/g)].map(m => Number(m[1]));
const ci037Words = ci037Body.replace(/<[^>]*>/g," ").trim().split(/\s+/).length;
if (ci037Sections.length < 19 || ci037Refs.length < 23 || ci037Words < 3200 ||
    !ci037Refs.every((n,i) => n === i+1) ||
    ci037Cited.some(n => !ci037Refs.includes(n)) ||
    ci037Refs.some(n => !ci037Cited.includes(n)) ||
    !ci037Body.includes("Text-first verdict:") ||
    !ci037Body.includes("Historical verdict:")) {
  throw new Error("CI-037 lost substantive research, cited source coverage or independent verdicts");
}
for (const id of ["question","arabic","context","genesis","mishnah","bloods","adam",
  "dating","source-parallel","numbering","variants","language","exceptions",
  "next-verse","transmission","academic","originality","matrix","verdict"]) {
  if (!ci037.includes('<section id="' + id + '">') || !ci037.includes('href="#' + id + '"')) {
    throw new Error("CI-037 section or navigation missing: "+id);
  }
}
for (const phrase of ["Quran 5:32","Mishnah Sanhedrin 4:5","Genesis 4:10",
  "of Israel","capital","corruption","first introduced","not established"]) {
  if (!ci037.includes(phrase)) throw new Error("CI-037 textual evidence check lost: "+phrase);
}
for (const path of ["site/index.html","site/research/index.html","site/sources/index.html"]) {
  if (!(await readFile(path,"utf8")).includes('href="/research/quran-5-32-mishnah-sanhedrin/"')) {
    throw new Error("CI-037 missing from website navigation: "+path);
  }
}

const v028Home = await readFile("site/index.html", "utf8");
const v028Sources = await readFile("site/sources/index.html", "utf8");
if (v028Home.includes('class="wrap editorial-note"')) {
  throw new Error("The old homepage editorial panels were reintroduced");
}
for (const route of ["/research/joseph-dirhams-and-coinage/", "/research/al-samiri-and-golden-calf/", "/research/abrogated-quranic-recitation/", "/research/theology-evidence-audit/"]) {
  if (!v028Home.includes('href="' + route + '"')) throw new Error("Homepage navigation regression: " + route);
}
for (const doc of [doctrineIndex, v028Sources]) {
  if (!doc.includes('href="/research/joseph-dirhams-and-coinage/"')) throw new Error("CI-035 missing from the library or source register");
}
if (!doctrineIndex.includes("37 published investigations / 1 research guide")) {
  throw new Error("Research count not updated for v0.28.0");
}

await import("./check-qiraat.mjs");
await import("./check-quran-previews.mjs");
await import("./check-qf.mjs");
await import("./audit-evidence.mjs");
await import("./audit-reference-labels.mjs");
await import("./audit-claim-citations.mjs");
console.log("Verified ten standalone doctrine investigations and their research index entries.");
