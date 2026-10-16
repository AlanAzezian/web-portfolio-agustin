import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const LEGACY_PUBLIC_DIR = path.join(
  ROOT,
  "public",
  "projects",
  "projects",
  "centro-de-trasbordo"
);
const ASSETS_SRC_DIR = path.join(ROOT, "assets-src", "centro-de-trasbordo");
const OUTPUT_DIR = path.join(ROOT, "public", "projects", "centro-de-trasbordo");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await fs.mkdir(ASSETS_SRC_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Si existen originales en la carpeta legacy de public, moverlos a assets-src
  if (await exists(LEGACY_PUBLIC_DIR)) {
    const legacyFiles = await fs.readdir(LEGACY_PUBLIC_DIR);
    for (const file of legacyFiles) {
      if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg")) {
        const srcPath = path.join(LEGACY_PUBLIC_DIR, file);
        const destPath = path.join(ASSETS_SRC_DIR, file);
        if (!(await exists(destPath))) {
          await fs.copyFile(srcPath, destPath);
        }
        await fs.unlink(srcPath);
      }
    }
    // Limpiar directorio legacy si quedó vacío (o solo con .gitkeep)
    const remaining = await fs.readdir(LEGACY_PUBLIC_DIR);
    for (const f of remaining) {
      await fs.unlink(path.join(LEGACY_PUBLIC_DIR, f));
    }
    await fs.rmdir(LEGACY_PUBLIC_DIR);
    const parentLegacy = path.dirname(LEGACY_PUBLIC_DIR);
    const parentRemaining = await fs.readdir(parentLegacy);
    if (parentRemaining.length === 0) {
      await fs.rmdir(parentLegacy);
    }
  }

  const srcFiles = (await fs.readdir(ASSETS_SRC_DIR))
    .filter((f) => /\.(png|jpe?g)$/i.test(f))
    .sort();

  const blurMap = {};
  let totalBefore = 0;
  let totalAfter = 0;

  console.log("Optimizando imágenes con sharp (WebP q=82, maxWidth=2400px)...\n");

  for (const file of srcFiles) {
    const inputPath = path.join(ASSETS_SRC_DIR, file);
    const cleanBase = file.replace(/\.(jpg|png|jpeg)\.(png|jpg|jpeg)$/i, "").replace(/\.(png|jpe?g)$/i, "");
    const outFile = `${cleanBase}.webp`;
    const outputPath = path.join(OUTPUT_DIR, outFile);

    const inputStat = await fs.stat(inputPath);
    totalBefore += inputStat.size;

    await sharp(inputPath)
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(outputPath);

    const outStat = await fs.stat(outputPath);
    totalAfter += outStat.size;

    const blurBuffer = await sharp(inputPath)
      .resize({ width: 16 })
      .webp({ quality: 40 })
      .toBuffer();

    const publicUrl = `/projects/centro-de-trasbordo/${outFile}`;
    blurMap[publicUrl] = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

    const beforeKB = (inputStat.size / 1024).toFixed(1);
    const afterKB = (outStat.size / 1024).toFixed(1);
    console.log(`✓ ${outFile.padEnd(34)} ${beforeKB.padStart(8)} KB -> ${afterKB.padStart(7)} KB`);
  }

  console.log(
    `\nTotal original: ${(totalBefore / (1024 * 1024)).toFixed(2)} MB`
  );
  console.log(
    `Total WebP:     ${(totalAfter / (1024 * 1024)).toFixed(2)} MB (${(
      totalAfter / 1024
    ).toFixed(1)} KB)`
  );

  await fs.writeFile(
    path.join(ASSETS_SRC_DIR, "blur-data.json"),
    JSON.stringify(blurMap, null, 2),
    "utf8"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
