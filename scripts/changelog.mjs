// The Markdown changelog is the sole source of public release history.
export function parseChangelog(markdown, currentVersion) {
  const chunks = markdown.split(/^##\s+/m).slice(1);
  if (!chunks.length) throw new Error("No version entries in CHANGELOG.md");
  const seen = new Set();
  const entries = chunks.map(chunk => {
    const [heading, ...lines] = chunk.trim().split(/\r?\n/);
    const match = /^v(\d+\.\d+\.\d+) - (\d{4}-\d{2}-\d{2})(?::\s*(.+))?$/.exec(heading.trim());
    if (!match) throw new Error("Invalid changelog heading: " + heading);
    const [, version, date, title = ""] = match;
    if (seen.has(version)) throw new Error("Duplicate changelog entry v" + version);
    seen.add(version);
    const dateObject = new Date(date + "T00:00:00Z");
    if (Number.isNaN(dateObject.getTime()) || dateObject.toISOString().slice(0, 10) !== date) {
      throw new Error("Invalid release date for v" + version);
    }
    const notes = lines.filter(line => line.trim().startsWith("- "))
      .map(line => line.trim().slice(2).trim());
    if (!notes.length || notes.some(note => !note || /release notes to be completed/i.test(note))) {
      throw new Error("Complete release notes for v" + version + " before publication");
    }
    return { version, date, title, notes };
  });
  const numbers = value => value.split(".").map(Number);
  for (let index = 1; index < entries.length; index++) {
    const newer = numbers(entries[index - 1].version);
    const older = numbers(entries[index].version);
    const difference = newer[0] - older[0] || newer[1] - older[1] || newer[2] - older[2];
    if (difference <= 0) throw new Error("Changelog versions must be newest first");
  }
  if (entries[0].version !== currentVersion) {
    throw new Error("Changelog v" + entries[0].version + " does not match package v" + currentVersion);
  }
  return entries;
}
const escapeHtml = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
export function renderChangelog(entries) {
  return entries.map((entry, index) => {
    const dateText = new Intl.DateTimeFormat("en-AU", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
    }).format(new Date(entry.date + "T00:00:00Z"));
    const content = entry.notes.map(note => "<li>" + escapeHtml(note) + "</li>").join("");
    const label = index === 0 ? '<span class="version-latest">Current version</span>' : "";
    const title = entry.title ? '<p class="version-title">' + escapeHtml(entry.title) + '</p>' : "";
    return '<details class="version-entry"' + (index === 0 ? " open" : "") +
      '><summary><span class="version-summary-main"><span class="version-heading">v' +
      escapeHtml(entry.version) + '</span>' + label + '</span><span class="version-summary-side"><time datetime="' +
      entry.date + '">' + dateText + '</time><span class="version-chevron" aria-hidden="true">+</span></span></summary>' +
      '<div class="version-detail">' + title + '<ul>' + content + '</ul></div></details>';
  }).join("\n");
}
