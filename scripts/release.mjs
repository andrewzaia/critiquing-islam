import { readFile, writeFile } from "node:fs/promises";
const level = process.argv[2];
if (!["patch", "minor", "major"].includes(level)) {
  console.error("Usage: npm run release -- patch|minor|major");
  process.exit(1);
}
const file = "package.json";
const data = JSON.parse(await readFile(file, "utf8"));
const parts = data.version.split(".").map(Number);
if (level === "major") { parts[0]++; parts[1] = 0; parts[2] = 0; }
if (level === "minor") { parts[1]++; parts[2] = 0; }
if (level === "patch") parts[2]++;
const next = parts.join(".");
data.version = next;
await writeFile(file, JSON.stringify(data, null, 2) + "\n");
const changelog = await readFile("CHANGELOG.md", "utf8");
const heading = "## v" + next + " - " + new Date().toISOString().slice(0, 10);
await writeFile("CHANGELOG.md", changelog.replace("# Changelog\n", "# Changelog\n\n" + heading + "\n\n- Release notes to be completed before publication.\n"));
console.log("Bumped version to v" + next + ". Review CHANGELOG.md, then commit and tag manually.");
