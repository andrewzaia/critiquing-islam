import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
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
await injectVersion("dist");
console.log("Built Critiquing Islam v" + packageData.version + " in dist/");
