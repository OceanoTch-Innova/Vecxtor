import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = join(projectRoot, "dist");
const staticExtensions = new Set([".css", ".html", ".js"]);

const staticFiles = (await readdir(projectRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && staticExtensions.has(extname(entry.name)))
  .map((entry) => entry.name);
const entryFile = staticFiles.find(
  (fileName) => fileName.toLowerCase() === "index.html"
);

if (!entryFile) {
  throw new Error("No se encontró index.html para publicar el sitio.");
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await Promise.all(
  staticFiles.map((fileName) =>
    copyFile(
      join(projectRoot, fileName),
      join(outputDirectory, fileName === entryFile ? "index.html" : fileName)
    )
  )
);

console.log(`Sitio estático generado en dist (${staticFiles.length} archivos).`);
