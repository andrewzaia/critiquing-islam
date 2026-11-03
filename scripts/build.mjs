import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseChangelog, renderChangelog } from "./changelog.mjs";
const packageData = JSON.parse(await readFile("package.json", "utf8"));
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("site", "dist", { recursive: true });
async function injectVersion(path) {
  for (const item of await readdir(path, { withFileTypes: true })) {
    const target = join(path, item.name);
    if (item.isDirectory()) await injectVersion(target);
    else if (item.name.endsWith(".html")) {
      const original = await readFile(target, "utf8");
      await writeFile(target, original.replaceAll("{{VERSION}}", packageData.version));
    }
  }
}
const entries = parseChangelog(await readFile("CHANGELOG.md", "utf8"), packageData.version);
const changelogFile = "dist/changelog/index.html";
const template = await readFile(changelogFile, "utf8");
if (!template.includes("{{CHANGELOG_ENTRIES}}") || !template.includes("{{CHANGELOG_COUNT}}")) {
  throw new Error("Missing public changelog template placeholders");
}
await writeFile(changelogFile, template.replaceAll("{{CHANGELOG_ENTRIES}}", renderChangelog(entries))
  .replaceAll("{{CHANGELOG_COUNT}}", String(entries.length)));
await injectVersion("dist");
async function connectVersionHistory(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const target = join(dir, item.name);
    if (item.isDirectory()) await connectVersionHistory(target);
    else if (item.name.endsWith(".html")) {
      const html = await readFile(target, "utf8");
      const footerVersion = '<span class="footer-version">v' + packageData.version + '</span>';
      const footerLinks = '<a href="/about/">About</a></nav>';
      if (!html.includes(footerVersion) || !html.includes(footerLinks)) {
        throw new Error("Missing standard footer markup in " + target);
      }
      const linked = html.replace(footerVersion,
        '<a class="footer-version" href="/changelog/" aria-label="View version history for v' +
        packageData.version + '">v' + packageData.version + '</a>')
        .replace(footerLinks, '<a href="/about/">About</a><a href="/changelog/">Version history</a></nav>');
      await writeFile(target, linked);
    }
  }
}
await connectVersionHistory("dist");
console.log("Built Critiquing Islam v" + packageData.version + " in dist/");
