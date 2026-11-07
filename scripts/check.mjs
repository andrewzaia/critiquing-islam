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

// Editorial capitalisation policy: display Biblical with a capital B.
// Preserve stable slugs, href/src identifiers, and historical file paths.
function assertBiblicalCapitalisation(content, path) {
  const segments = content.split(/(<[^>]*>)/g);
  for (const segment of segments) {
    if (segment.startsWith("<")) {
      for (const m of segment.matchAll(/\b(?:content|title|alt|aria-label|data-search|placeholder)="([^"]*)"/g)) {
        if (/\bbiblical\b/.test(m[1])) {
          throw new Error(path + " contains a lowercase Biblical display attribute");
        }
      }
    } else if (/\bbiblical\b/.test(segment)) {
      throw new Error(path + " contains lowercase Biblical display text");
    }
  }
}

for (const path of htmlFiles) {
  const content = await readFile(path, "utf8");
  assertBiblicalCapitalisation(content, path);
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
  ["mary-sister-of-aaron", "Text-first verdict:"],
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
for (const phrase of ["Quran 5:32","Mishnah Sanhedrin 4:5","Genesis 4:8-10",
  "of Israel","capital","corruption","uniquely Quranic","remains a separate historical question"]) {
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
if (!doctrineIndex.includes("40 published investigations / 1 research guide")) {
  throw new Error("Research count not updated for v0.28.0");
}


const newStudies = [
  {slug:"first-revelation-gabriel-waraqah",code:"038",sections:20,references:26,words:2500,wordsToKeep:["Khadijah","Waraqah","Galatians 1:8","1 Corinthians 15:3-4","Text-first verdict:","Historical verdict:"]},
  {slug:"companions-of-the-cave-seven-sleepers",code:"039",sections:17,references:18,words:1500,wordsToKeep:["Syriac","Jacob of Serugh","Text-first verdict:","Historical verdict:"]}
];
for (const study of newStudies) {
  const html = await readFile("site/research/" + study.slug + "/index.html","utf8");
  const article = html.slice(0,html.indexOf('<section id="references">'));
  const sectionIds = [...article.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(m => m[1]);
  const sourceIds = [...html.matchAll(/<li id="ref-([0-9]+)">/g)].map(m => Number(m[1]));
  const citedIds = [...article.matchAll(/href="#ref-([0-9]+)"/g)].map(m => Number(m[1]));
  const wordCount = article.replace(/<[^>]*>/g," ").trim().split(/\s+/).length;
  if (sectionIds.length < study.sections || sourceIds.length < study.references || wordCount < study.words)
    throw new Error("CI-" + study.code + " lost expected research depth");
  if (!sourceIds.every((n,i) => n === i+1) || sourceIds.some(n => !citedIds.includes(n)) || citedIds.some(n => !sourceIds.includes(n)))
    throw new Error("CI-" + study.code + " citations are incomplete or inconsistent");
  for (const id of sectionIds) if (!html.includes('href="#' + id + '"'))
    throw new Error("CI-" + study.code + " section missing navigation: " + id);
  for (const phrase of study.wordsToKeep) if (!html.includes(phrase))
    throw new Error("CI-" + study.code + " lost required content: " + phrase);
  for (const page of ["site/index.html","site/research/index.html","site/sources/index.html"]) {
    if (!(await readFile(page,"utf8")).includes('href="/research/' + study.slug + '/"'))
      throw new Error("CI-" + study.code + " missing in navigation: " + page);
  }
}


// v0.34.1: protect evidence-weighted rather than merely possibility-led conclusions.
const method34 = await readFile("site/methodology/index.html", "utf8");
const ci038a = await readFile("site/research/first-revelation-gabriel-waraqah/index.html", "utf8");
for (const phrase of ["balance of probabilities", "rescue hypothesis", "independent historical assessment"]) {
  if (!method34.includes(phrase)) {
    throw new Error("Methodological evidence standard lost: " + phrase);
  }
}
for (const phrase of ["Comparative theological verdict, on the balance of probabilities:",
 "a deceptive, non-divine messenger", "Galatians 1:8", "Historical verdict:"]) {
  if (!ci038a.includes(phrase)) throw new Error("CI-038 comparative verdict lost: " + phrase);
}
for (const [slug, requiredPhrase] of [
  ["mary-sister-of-aaron", "Historical verdict, on the balance of probabilities:"],
  ["muhammad-in-torah-and-gospel", "Balance-of-probabilities assessment:"],
  ["ezra-son-of-god-claim", "Balance-of-probabilities assessment:"]
]) {
  if (!(await readFile("site/research/" + slug + "/index.html","utf8")).includes(requiredPhrase)) {
    throw new Error("Evidence-weighted interpretation missing: " + slug);
  }
}


// CI-008 v0.35.0: protect primary sources, original-language scrutiny and substantial depth.
const ci008 = await readFile("site/research/mary-sister-of-aaron/index.html", "utf8");
const ci008Body = ci008.slice(ci008.indexOf('<article class="prose'), ci008.indexOf('<section id="references">'));
const ci008Sections = [...ci008.matchAll(/<section id="([^"]+)"><span class="section-index">/g)]
  .map(x => x[1]).filter(id => id !== "references");
const ci008References = [...ci008.matchAll(/<li id="ref-(\d+)">/g)].map(x => Number(x[1]));
const ci008Citations = [...ci008Body.matchAll(/href="#ref-(\d+)"/g)].map(x => Number(x[1]));
const ci008Words = ci008Body.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
if (ci008Sections.length < 20 || ci008References.length < 25 || ci008Words < 3200 ||
    !ci008References.every((n,i) => n === i + 1) ||
    ci008References.some(n => !ci008Citations.includes(n)) ||
    ci008Citations.some(n => !ci008References.includes(n))) {
  throw new Error("CI-008 lacks complete source-critical analysis or citations");
}
for (const id of ci008Sections) if (!ci008.includes('href="#' + id + '"')) {
  throw new Error("CI-008 is missing section navigation: " + id);
}
for (const phrase of ["Quran 19:28", "Quran 66:12", "Exodus 15:20",
  "Numbers 26:59", "Joachim", "Papyrus Bodmer V", "Gregory of Nyssa",
  "Sahih Muslim 2135", "Text-first verdict:", "Historical verdict, on the balance of probabilities:"]) {
  if (!ci008.includes(phrase)) throw new Error("CI-008 lost required evidence: " + phrase);
}
for (const page of ["site/index.html","site/research/index.html","site/sources/index.html"]) {
  if (!(await readFile(page,"utf8")).includes('href="/research/mary-sister-of-aaron/"')) {
    throw new Error("CI-008 missing from site navigation: " + page);
  }
}


// CI-007 v0.36.0: original-language, fourth-century creed, Marian devotion and historical verdict coverage.
const ci007 = await readFile("site/research/quran-5-116-and-trinity/index.html", "utf8");
const ci007Body = ci007.slice(ci007.indexOf('<article class="prose'), ci007.indexOf('<section id="references">'));
const ci007Sections = [...ci007Body.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(m => m[1]);
const ci007Refs = [...ci007.matchAll(/<li id="ref-(\d+)">/g)].map(m => Number(m[1]));
const ci007Cited = [...ci007Body.matchAll(/href="#ref-(\d+)"/g)].map(m => Number(m[1]));
const ci007Words = ci007Body.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
if (ci007Sections.length < 20 || ci007Refs.length < 28 || ci007Words < 3200 ||
    !ci007Refs.every((n,i) => n === i + 1) ||
    ci007Refs.some(n => !ci007Cited.includes(n)) ||
    ci007Cited.some(n => !ci007Refs.includes(n))) {
  throw new Error("CI-007 lost research depth or has incomplete source references");
}
for (const id of ci007Sections) if (!ci007.includes('href="#' + id + '"')) {
  throw new Error("CI-007 is missing its anchor navigation: " + id);
}
for (const text of [
  "Quran 5:116", "Quran 5:73", "Quran 4:171", "Nicaea",
  "Constantinople", "Epiphanius", "Mohsen Goudarzi",
  "Original", "two deities", "Historical verdict, on the balance of probabilities:"
]) {
  if (!ci007.includes(text)) throw new Error("CI-007 lost essential evidence: " + text);
}
for (const page of ["site/index.html", "site/research/index.html", "site/sources/index.html"]) {
  if (!(await readFile(page, "utf8")).includes('href="/research/quran-5-116-and-trinity/"')) {
    throw new Error("CI-007 navigation missing from " + page);
  }
}


 
// CI-006 v0.37.0: exact fractions, alternative legal methods and documented evidence.
const ci006 = await readFile("site/research/inheritance-shares-and-awl/index.html", "utf8");
const ci006Body = ci006.slice(ci006.indexOf('<article class="prose'), ci006.indexOf('<section id="references">'));
const ci006Sections = [...ci006Body.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(m => m[1]);
const ci006Refs = [...ci006.matchAll(/<li id="ref-(\d+)">/g)].map(m => Number(m[1]));
const ci006Citations = [...ci006Body.matchAll(/href="#ref-(\d+)"/g)].map(m => Number(m[1]));
const ci006Words = ci006Body.replace(/<[^>]*>/g," ").trim().split(/\s+/).length;
if (ci006Sections.length < 20 || ci006Refs.length < 21 || ci006Words < 3200 ||
    !ci006Refs.every((n,i) => n === i + 1) ||
    ci006Refs.some(n => !ci006Citations.includes(n)) ||
    ci006Citations.some(n => !ci006Refs.includes(n))) {
  throw new Error("CI-006 research depth or references regressed");
}
for (const id of ci006Sections) if (!ci006.includes('href="#' + id + '"')) {
  throw new Error("CI-006 section navigation missing: " + id);
}
for (const phrase of ["27/24","112.5%","15/12","125 percent","Imami","Sunni",
  "thumun","fawqa","Direct textual finding:","Comparative legal verdict:"]) {
  if (!ci006.toLowerCase().includes(phrase.toLowerCase())) {
    throw new Error("CI-006 missing required research finding: " + phrase);
  }
}
const widow24 = 16 + 4 + 4 + 3;
const husband12 = 8 + 2 + 2 + 3;
const sunni27 = 16 + 4 + 4 + 3;
const imami24 = 13 + 4 + 4 + 3;
const sunni15 = 8 + 2 + 2 + 3;
const imami12 = 5 + 2 + 2 + 3;
if (widow24 !== 27 || husband12 !== 15 || sunni27 !== 27 ||
    imami24 !== 24 || sunni15 !== 15 || imami12 !== 12 ||
    100 * widow24 / 24 !== 112.5 || 100 * husband12 / 12 !== 125) {
  throw new Error("CI-006 inheritance mathematics check failed");
}
for (const page of ["site/index.html","site/research/index.html","site/sources/index.html"]) {
  if (!(await readFile(page,"utf8")).includes('href="/research/inheritance-shares-and-awl/"')) {
    throw new Error("CI-006 discovery link missing: " + page);
  }
}



// CI-005 v0.38.0: Quran-first manuscript chronology, original Arabic and evidentiary depth.
const ci005 = await readFile("site/research/quran-and-earlier-scriptures/index.html", "utf8");
const ci005Body = ci005.slice(ci005.indexOf('<article class="prose'), ci005.indexOf('<section id="references">'));
const ci005Sections = [...ci005Body.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(x => x[1]);
const ci005Sources = [...ci005.matchAll(/<li id="ref-(\d+)">/g)].map(x => Number(x[1]));
const ci005Citations = [...ci005Body.matchAll(/href="#ref-(\d+)"/g)].map(x => Number(x[1]));
const ci005Words = ci005Body.replace(/<[^>]*>/g," ").trim().split(/\s+/).length;
const ci005Urls = [...ci005.matchAll(/<li id="ref-\d+">[\s\S]*?<a href="([^"]+)" target="_blank"/g)].map(x => x[1].replaceAll("&amp;","&"));
if (ci005Sections.length < 23 || ci005Sources.length < 34 || ci005Words < 4500 ||
    !ci005Sources.every((n,i) => n === i + 1) ||
    ci005Sources.some(n => !ci005Citations.includes(n)) ||
    ci005Citations.some(n => !ci005Sources.includes(n)) ||
    ci005Urls.length !== ci005Sources.length || new Set(ci005Urls).size !== ci005Urls.length) {
  throw new Error("CI-005 lost article depth, source uniqueness or citation integrity");
}
for (const id of ci005Sections) if (!ci005.includes('href="#' + id + '"')) {
  throw new Error("CI-005 research navigation missing: " + id);
}
for (const phrase of ["Textual standard:","Historical verdict, on the balance of probabilities:",
  "Quran 5:43","Quran 5:47","Quran 5:48","Quran 2:79","Quran 3:78",
  "4Q11","4Q22","Great Isaiah Scroll","Codex Vaticanus","Codex Sinaiticus",
  "Codex Alexandrinus","Papyrus 66","John 20:28", "universal"]) {
  if (!ci005.includes(phrase)) throw new Error("CI-005 lost essential source or assessment: " + phrase);
}
for (const page of ["site/index.html","site/research/index.html","site/sources/index.html"]) {
  if (!(await readFile(page,"utf8")).includes('href="/research/quran-and-earlier-scriptures/"')) {
    throw new Error("CI-005 missing from discovery: " + page);
  }
}



// CI-004 v0.39.0: enforce source-critical hadith depth, original chain comparison and navigation.
const ci004 = await readFile("site/research/how-is-a-hadith-authenticated/index.html", "utf8");
const ci004Body = ci004.slice(ci004.indexOf('<article class="prose'), ci004.indexOf('<section id="references">'));
const ci004Sections = [...ci004Body.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(x=>x[1]);
const ci004References = [...ci004.matchAll(/<li id="ref-(\d+)">/g)].map(x=>Number(x[1]));
const ci004Cites = [...ci004Body.matchAll(/href="#ref-(\d+)"/g)].map(x=>Number(x[1]));
const ci004Words = ci004Body.replace(/<[^>]*>/g," ").trim().split(/\s+/).length;
const ci004Urls = [...ci004.matchAll(/<li id="ref-\d+">[\s\S]*?<a href="([^"]+)" target="_blank"/g)].map(x=>x[1].replaceAll("&amp;","&"));
if (ci004Sections.length < 25 || ci004References.length < 29 || ci004Words < 3500 ||
    !ci004References.every((n,i)=>n===i+1) ||
    ci004References.some(n=>!ci004Cites.includes(n)) ||
    ci004Cites.some(n=>!ci004References.includes(n)) ||
    ci004Urls.length !== ci004References.length ||
    new Set(ci004Urls).size !== ci004Urls.length) {
  throw new Error("CI-004 depth, citations, sequential references or source URLs regressed");
}
for (const id of ci004Sections) if (!ci004.includes('href="#' + id + '"')) {
  throw new Error("CI-004 missing section navigation: " + id);
}
for (const phrase of ["Historical verdict, on the balance of probabilities:",
  "Yahya ibn Said","Muhammad ibn Ibrahim","Alqama ibn Waqqas",
  "Sahih al-Bukhari 1","Sahih Muslim 1907a", "Ibn Sirin",
  "Gregor Schoeler","Harald Motzki","Joshua J. Little",
  "isnad-cum-matn","Sahih Muslim 3004","common link","Sahih al-Bukhari 3636"]) {
  if (!ci004.toLowerCase().includes(phrase.toLowerCase())) {
    throw new Error("CI-004 lost an essential source-critical finding: " + phrase);
  }
}
for (const page of ["site/index.html","site/research/index.html","site/sources/index.html"]) {
  if (!(await readFile(page,"utf8")).includes('href="/research/how-is-a-hadith-authenticated/"')) {
    throw new Error("CI-004 discovery link missing from " + page);
  }
}



// CI-003 v0.40.0: preservation must distinguish manuscript evidence from oral claims.
const ci003 = await readFile("site/research/quran-preservation-and-manuscripts/index.html", "utf8");
const ci003Body = ci003.slice(ci003.indexOf('<article class="prose'), ci003.indexOf('<section id="references">'));
const ci003Sections = [...ci003Body.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(x=>x[1]);
const ci003Refs = [...ci003.matchAll(/<li id="ref-(\d+)">/g)].map(x=>Number(x[1]));
const ci003Cites = [...ci003Body.matchAll(/href="#ref-(\d+)"/g)].map(x=>Number(x[1]));
const ci003Words = ci003Body.replace(/<[^>]*>/g," ").trim().split(/\s+/).length;
const ci003Urls = [...ci003.matchAll(/<li id="ref-\d+">[\s\S]*?<a href="([^"]+)" target="_blank"/g)].map(x=>x[1].replaceAll("&amp;","&"));
if (ci003Sections.length < 23 || ci003Refs.length < 31 || ci003Words < 3500 ||
    !ci003Refs.every((n,i)=>n===i+1) ||
    ci003Refs.some(n=>!ci003Cites.includes(n)) ||
    ci003Cites.some(n=>!ci003Refs.includes(n)) ||
    ci003Urls.length!==ci003Refs.length ||
    new Set(ci003Urls).size!==ci003Urls.length) {
  throw new Error("CI-003 manuscript depth, citation coverage or source uniqueness regressed");
}
for (const id of ci003Sections) if (!ci003.includes('href="#' + id + '"')) {
  throw new Error("CI-003 missing section navigation: " + id);
}
for (const phrase of ["Text-first finding:","Historical verdict, on the balance of probabilities:",
  "Birmingham","Sanaa","Mingana","Marijn van Putten","Hythem Sidky",
  "Quran 2:184","Quran 10:22","regional","consonantal","Sahih Muslim 1452a",
  "Sahih Muslim 1050","Sahih al-Bukhari 6829"]) {
  if (!ci003.toLowerCase().includes(phrase.toLowerCase())) {
    throw new Error("CI-003 missing essential primary source or verdict: " + phrase);
  }
}
for (const page of ["site/index.html","site/research/index.html","site/sources/index.html"]) {
  if (!(await readFile(page,"utf8")).includes('href="/research/quran-preservation-and-manuscripts/"')) {
    throw new Error("CI-003 missing site discovery: " + page);
  }
}



// CI-002 v0.41.0: original Arabic, early witnesses and historical source independence.
const ci002 = await readFile("site/research/crucifixion-and-quran-4-157/index.html", "utf8");
const ci002Body = ci002.slice(ci002.indexOf('<article class="prose'), ci002.indexOf('<section id="references">'));
const ci002Sections = [...ci002Body.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(x=>x[1]);
const ci002Sources = [...ci002.matchAll(/<li id="ref-(\d+)">/g)].map(x=>Number(x[1]));
const ci002Citations = [...ci002Body.matchAll(/href="#ref-(\d+)"/g)].map(x=>Number(x[1]));
const ci002Words = ci002Body.replace(/<[^>]*>/g," ").trim().split(/\s+/).length;
const ci002Urls = [...ci002.matchAll(/<li id="ref-\d+">[\s\S]*?<a href="([^"]+)" target="_blank"/g)].map(x=>x[1].replaceAll("&amp;","&"));
if (ci002Sections.length < 31 || ci002Sources.length < 44 || ci002Words < 4700 ||
    !ci002Sources.every((n,i)=>n===i+1) ||
    ci002Sources.some(n=>!ci002Citations.includes(n)) ||
    ci002Citations.some(n=>!ci002Sources.includes(n)) ||
    ci002Urls.length!==ci002Sources.length || new Set(ci002Urls).size!==ci002Urls.length) {
  throw new Error("CI-002 research depth, source uniqueness or citation coverage regressed");
}
for (const id of ci002Sections) if (!ci002.includes('href="#' + id + '"')) {
  throw new Error("CI-002 missing navigation anchor: " + id);
}
for (const phrase of ["Historical verdict, on the balance of probabilities:",
  "shubbiha", "Paul", "Galatians 1:18-19", "Papyrus 46",
  "Tacitus", "Yehohanan", "Irenaeus", "Basilides", "Ignatius",
  "Pilate", "Quran 4:157", "Codex Sinaiticus",
  "agency", "Roman", "theological"]) {
  if (!ci002.toLowerCase().includes(phrase.toLowerCase())) {
    throw new Error("CI-002 lost original language or historical evidence: " + phrase);
  }
}
for (const page of ["site/index.html","site/research/index.html","site/sources/index.html"]) {
  if (!(await readFile(page,"utf8")).includes('href="/research/crucifixion-and-quran-4-157/"')) {
    throw new Error("CI-002 missing from site discovery: " + page);
  }
}



// CI-001 v0.42.0: original-language, manuscript and attribution evidence regression checks.
const ci001 = await readFile("site/research/quran-61-6-and-paraclete/index.html","utf8");
const ci001Body = ci001.slice(ci001.indexOf('<article class="prose'), ci001.indexOf('<section id="references">'));
const ci001Sections = [...ci001Body.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(x=>x[1]);
const ci001Refs = [...ci001.matchAll(/<li id="ref-(\d+)">/g)].map(x=>Number(x[1]));
const ci001Cites = [...ci001Body.matchAll(/href="#ref-(\d+)"/g)].map(x=>Number(x[1]));
const ci001Urls = [...ci001.matchAll(/<li id="ref-\d+">[\s\S]*?<a href="([^"]+)" target="_blank"/g)].map(x=>x[1].replaceAll("&amp;","&"));
const ci001Words = ci001Body.replace(/<[^>]*>/g," ").trim().split(/\s+/).length;
if (ci001Sections.length < 25 || ci001Refs.length < 30 || ci001Words < 4200 ||
    !ci001Refs.every((x,i)=>x===i+1) ||
    ci001Refs.some(x=>!ci001Cites.includes(x)) ||
    ci001Cites.some(x=>!ci001Refs.includes(x)) ||
    ci001Urls.length !== ci001Refs.length ||
    new Set(ci001Urls).size !== ci001Urls.length) {
  throw new Error("CI-001 depth, reference numbering, source uniqueness or citation coverage regressed");
}
for (const id of ci001Sections) if (!ci001.includes('href="#'+id+'"')) {
  throw new Error("CI-001 missing navigation anchor: " + id);
}
for (const term of ["Text-first verdict:", "Historical verdict, on the balance of probabilities:",
  "John 14:26", "Papyrus 66", "Papyrus 75", "Holy Spirit", "Ibn Ishaq",
  "Sean W. Anthony", "Raymond E. Brown", "parakletos", "periklutos", "John 14:17",
  "Quran 61:6", "Spirit of truth", "First John 2:1", "falsification"]) {
  if (!ci001.toLowerCase().includes(term.toLowerCase())) {
    throw new Error("CI-001 lost a crucial linguistic or historical finding: " + term);
  }
}
for (const p of ["site/index.html","site/research/index.html","site/sources/index.html"]) {
  if (!(await readFile(p,"utf8")).includes('href="/research/quran-61-6-and-paraclete/"')) {
    throw new Error("CI-001 missing discovery link from " + p);
  }
}


// CI-040 v0.43.0: explicit Biblical perspective with independent historical evidence.
const ci040 = await readFile("site/research/paul-vs-muhammad-prophetic-authority/index.html", "utf8");
const ci040Body = ci040.slice(ci040.indexOf('<article class="prose'), ci040.indexOf('<section id="references">'));
const ci040Sections = [...ci040Body.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(x=>x[1]);
const ci040Refs = [...ci040.matchAll(/<li id="ref-(\d+)">/g)].map(x=>Number(x[1]));
const ci040Cites = [...ci040Body.matchAll(/href="#ref-(\d+)"/g)].map(x=>Number(x[1]));
const ci040Urls = [...ci040.matchAll(/<li id="ref-\d+">[\s\S]*?<a href="([^"]+)" target="_blank"/g)].map(x=>x[1].replaceAll("&amp;","&"));
const ci040Words = ci040Body.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
if (ci040Sections.length < 24 || ci040Refs.length < 38 || ci040Words < 3600 ||
    !ci040Refs.every((x,i)=>x===i+1) ||
    ci040Refs.some(x=>!ci040Cites.includes(x)) ||
    ci040Cites.some(x=>!ci040Refs.includes(x)) ||
    ci040Urls.length !== ci040Refs.length || new Set(ci040Urls).size !== ci040Urls.length) {
  throw new Error("CI-040 depth, source numbering, citation coverage or URL uniqueness regressed");
}
for (const id of ci040Sections) if (!ci040.includes('href="#'+id+'"')) {
  throw new Error("CI-040 missing section navigation: " + id);
}
for (const term of ["Biblical theological verdict:", "Historical verdict:",
  "Galatians", "Cephas", "James", "Gabriel", "Bukhari", "Deuteronomy",
  "Tacitus", "Philippians", "crucifixion", "Quran 33:40", "falsification"]) {
  if (!ci040.toLowerCase().includes(term.toLowerCase())) {
    throw new Error("CI-040 missing required source or verdict: " + term);
  }
}
for (const p of ["site/index.html","site/research/index.html","site/sources/index.html"]) {
  if (!(await readFile(p,"utf8")).includes('href="/research/paul-vs-muhammad-prophetic-authority/"')) {
    throw new Error("CI-040 missing research discovery: " + p);
  }
}
const ciFramework = await readFile("site/methodology/index.html", "utf8");
if (!ciFramework.includes("Our stated Biblical-Christian framework") ||
    !(await readFile("site/about/index.html", "utf8")).includes("Our perspective is stated openly.")) {
  throw new Error("Project-wide Biblical framework must remain explicit");
}


for (const path of ["README.md", "CHANGELOG.md", ...(await readdir("docs")).filter(x=>x.endsWith(".md")).map(x=>"docs/"+x)]) {
  const markdown = await readFile(path, "utf8");
  const prose = markdown.replace(/https?:\/\/[^\s)>"']+|(?:site\/research\/|\/research\/|docs\/)[^\s)>"']+|tahrif-and-biblical-corruption/g, "");
  if (/\bbiblical\b/.test(prose)) {
    throw new Error(path + " contains lowercase Biblical in editorial prose");
  }
}


// CI-009 v0.44.0: substantive investigation integrity checks.
const ci009 = await readFile("site/research/was-jesus-a-muslim/index.html","utf8");
const ci009Body = ci009.slice(ci009.indexOf('<article class="prose'),ci009.indexOf('<section id="references">'));
const ci009Sections = [...ci009Body.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(x=>x[1]);
const ci009Refs = [...ci009.matchAll(/<li id="ref-(\d+)">/g)].map(x=>Number(x[1]));
const ci009Cites = [...ci009Body.matchAll(/href="#ref-(\d+)"/g)].map(x=>Number(x[1]));
const ci009Urls = [...ci009.matchAll(/<li id="ref-\d+">[\s\S]*?<a href="([^"]+)" target="_blank"/g)].map(x=>x[1].replaceAll("&amp;","&"));
const ci009Words = ci009Body.replace(/<[^>]*>/g," ").trim().split(/\s+/).length;
if(ci009Sections.length<24 || ci009Refs.length<44 || ci009Words<3800 ||
  !ci009Refs.every((n,i)=>n===i+1) ||
  ci009Refs.some(n=>!ci009Cites.includes(n)) ||
  ci009Cites.some(n=>!ci009Refs.includes(n)) ||
  ci009Urls.length!==ci009Refs.length || new Set(ci009Urls).size!==ci009Urls.length)
  throw new Error("CI-009 evidence depth, citations or references regressed");
for(const id of ci009Sections)if(!ci009.includes('href="#'+id+'"'))throw new Error("CI-009 missing navigation "+id);
for(const term of ["muslimuna","musliman","Galatians 1:18-19","P46","Paula Fredriksen","Biblical theological verdict:","Historical verdict:","Falsification"])
  if(!ci009.toLowerCase().includes(term.toLowerCase()))throw new Error("CI-009 lost evidence: "+term);
for(const path of ["site/index.html","site/research/index.html","site/sources/index.html"])
  if(!(await readFile(path,"utf8")).includes('href="/research/was-jesus-a-muslim/"'))throw new Error("CI-009 missing discovery "+path);


// CI-010 v0.45.0: original languages, pre-Nicene sources and evidence integrity.
const ci010 = await readFile("site/research/is-jesus-god/index.html","utf8");
const ci010Body = ci010.slice(ci010.indexOf('<article class="prose'),ci010.indexOf('<section id="references">'));
const ci010Sections = [...ci010Body.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(m=>m[1]);
const ci010Refs = [...ci010.matchAll(/<li id="ref-(\d+)">/g)].map(m=>Number(m[1]));
const ci010Citations = [...ci010Body.matchAll(/href="#ref-(\d+)"/g)].map(m=>Number(m[1]));
const ci010Urls = [...ci010.matchAll(/<li id="ref-\d+">[\s\S]*?<a href="([^"]+)" target="_blank"/g)].map(m=>m[1].replaceAll("&amp;","&"));
const ci010Words = ci010Body.replace(/<[^>]*>/g," ").trim().split(/\s+/).length;
if(ci010Sections.length<25||ci010Refs.length<50||ci010Words<4950||
  !ci010Refs.every((n,i)=>n===i+1)||
  ci010Refs.some(n=>!ci010Citations.includes(n))||
  ci010Citations.some(n=>!ci010Refs.includes(n))||
  ci010Urls.length!==ci010Refs.length||new Set(ci010Urls).size!==ci010Urls.length)
  throw new Error("CI-010 depth, numbering, bibliography or citation coverage regressed");
for(const id of ci010Sections)if(!ci010.includes('href="#'+id+'"'))
  throw new Error("CI-010 missing navigation "+id);
for(const term of ["kalimatuhu","harpagmon","monogenes theos","P66","P75",
  "Ignatius","Pliny","Hebrews 1:8","Biblical theological verdict:","Historical verdict:","Falsification"])
  if(!ci010.toLowerCase().includes(term.toLowerCase()))
    throw new Error("CI-010 lost critical source or argument: "+term);
for(const path of ["site/index.html","site/research/index.html","site/sources/index.html"])
  if(!(await readFile(path,"utf8")).includes('href="/research/is-jesus-god/"'))
    throw new Error("CI-010 missing discovery from "+path);


// CI-011 v0.46.0: source-specific claims, citations and navigation.
const ci011 = await readFile("site/research/muhammad-in-torah-and-gospel/index.html","utf8");
const ci011Body = ci011.slice(ci011.indexOf('<article class="prose'), ci011.indexOf('<section id="references">'));
const ci011Sections = [...ci011Body.matchAll(/<section id="([^"]+)"><span class="section-index">/g)].map(m=>m[1]);
const ci011Refs = [...ci011.matchAll(/<li id="ref-(\d+)">/g)].map(m=>Number(m[1]));
const ci011Cites = [...ci011Body.matchAll(/href="#ref-(\d+)"/g)].map(m=>Number(m[1]));
const ci011Urls = [...ci011.matchAll(/<li id="ref-\d+">[\s\S]*?<a href="([^"]+)" target="_blank"/g)].map(m=>m[1].replaceAll("&amp;","&"));
const ci011Words = ci011Body.replace(/<[^>]*>/g," ").trim().split(/\s+/).length;
if(ci011Sections.length<26||ci011Refs.length<34||ci011Words<4150||
  !ci011Refs.every((n,i)=>n===i+1)||
  ci011Refs.some(n=>!ci011Cites.includes(n))||
  ci011Cites.some(n=>!ci011Refs.includes(n))||
  ci011Urls.length!==ci011Refs.length||new Set(ci011Urls).size!==ci011Urls.length)
  throw new Error("CI-011 source coverage, depth or reference numbering regressed");
for(const id of ci011Sections)if(!ci011.includes('href="#'+id+'"'))
  throw new Error("CI-011 missing navigation "+id);
for(const term of ["maktuban","miqqirbekha","Paran","machamadim","Kedar","Isaiah 29",
 "Spirit of truth","John 14:26","Falsification","Historical verdict:","Biblical theological verdict:"])
 if(!ci011.toLowerCase().includes(term.toLowerCase()))throw new Error("CI-011 missing argument: "+term);
for(const path of ["site/index.html","site/research/index.html","site/sources/index.html"])
 if(!(await readFile(path,"utf8")).includes('href="/research/muhammad-in-torah-and-gospel/"'))
  throw new Error("CI-011 discovery missing "+path);

await import("./check-qiraat.mjs");
await import("./check-quran-previews.mjs");
await import("./check-qf.mjs");
await import("./audit-evidence.mjs");
await import("./audit-reference-labels.mjs");
await import("./audit-claim-citations.mjs");
console.log("Verified ten standalone doctrine investigations and their research index entries.");
