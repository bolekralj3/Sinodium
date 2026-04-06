/**
 * Hero + 12 gallery JPEGs + 4 location images → /images
 * Run: npm run optimize:images
 * SOURCE=/path/to/jpegs HERO_FILE=Villa\ Sinodium_103.jpg GALLERY_COUNT=12 npm run optimize:images
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SOURCE =
  process.env.SOURCE || path.join(ROOT, 'images', 'gallery');

const HERO_FILE =
  process.env.HERO_FILE || 'Villa Sinodium_103.jpg';

const GALLERY_COUNT = Math.min(
  24,
  Math.max(1, parseInt(process.env.GALLERY_COUNT || '12', 10) || 12)
);

const ASSETS_DIR =
  process.env.ASSETS_DIR || path.join(ROOT, 'assets', 'location-sources');

const LOCATION_SOURCES = [
  { id: 'krka', filename: 'KRKA-fc5a1cf5-0f0c-4b59-8433-5a6a7a77f083.png' },
  { id: 'sibenik', filename: 'sibenik-d6b00ea8-8c69-4773-b058-31c3303c4ce3.png' },
  { id: 'zrmanja', filename: 'Zrmanja-8690616a-9a32-4ef6-ace5-93eb6817ae4e.png' },
  { id: 'split', filename: 'Split-feea27ee-0826-4583-9490-18b5750ad7e6.png' }
];

const LOCATION_FALLBACK_URL = {
  krka: 'https://images.unsplash.com/photo-1575408264798-b50b252663e6?auto=format&fit=max&w=1920&q=85',
  sibenik: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=max&w=1920&q=85',
  zrmanja: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=max&w=1920&q=85',
  split: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=max&w=1920&q=85'
};

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function ensureDir(d) {
  await fs.promises.mkdir(d, { recursive: true });
}

async function collectJpegs(dir) {
  try {
    const names = await fs.promises.readdir(dir);
    return names.filter(
      (f) =>
        /\.(jpe?g)$/i.test(f) &&
        !f.startsWith('.') &&
        !/^gallery-\d{2}\.jpe?g$/i.test(f)
    );
  } catch {
    return [];
  }
}

async function metaFor(dir, file) {
  const p = path.join(dir, file);
  try {
    const m = await sharp(p).metadata();
    return {
      file,
      path: p,
      w: m.width || 0,
      h: m.height || 0,
      ratio: (m.width || 1) / (m.height || 1)
    };
  } catch {
    return null;
  }
}

function pickGalleryDiverse(metas, excludeFile, count) {
  const pool = metas.filter((m) => m.file !== excludeFile);
  const landscape = pool
    .filter((m) => m.ratio >= 1.15)
    .sort((a, b) => b.w * b.h - a.w * a.h);
  const portrait = pool
    .filter((m) => m.ratio < 0.95)
    .sort((a, b) => b.w * b.h - a.w * a.h);
  const mid = pool
    .filter((m) => m.ratio >= 0.95 && m.ratio < 1.15)
    .sort((a, b) => b.w * b.h - a.w * a.h);

  const picked = [];
  const used = new Set();

  while (picked.length < count) {
    const before = picked.length;
    for (const bucket of [landscape, portrait, mid]) {
      if (picked.length >= count) break;
      const item = bucket.find((x) => !used.has(x.file));
      if (item) {
        picked.push(item);
        used.add(item.file);
      }
    }
    if (picked.length === before) {
      const rest = pool
        .filter((x) => !used.has(x.file))
        .sort((a, b) => b.w * b.h - a.w * a.h);
      for (const x of rest) {
        if (picked.length >= count) break;
        picked.push(x);
        used.add(x.file);
      }
      break;
    }
  }

  return picked.slice(0, count);
}

function pipeline(buf, maxW) {
  return sharp(buf)
    .rotate()
    .resize({
      width: maxW,
      withoutEnlargement: true,
      fit: 'inside'
    });
}

async function writeWebpAndJpeg(buf, outBase, { maxW, qualityWebp, qualityJpeg, maxBytes }) {
  let webpQ = qualityWebp;
  let jpegQ = qualityJpeg;

  let webpBuf = await pipeline(buf, maxW).webp({ quality: webpQ, effort: 6 }).toBuffer();
  while (webpBuf.length > maxBytes && webpQ > 55) {
    webpQ -= 5;
    webpBuf = await pipeline(buf, maxW).webp({ quality: webpQ, effort: 6 }).toBuffer();
  }

  let jpegBuf = await pipeline(buf, maxW).jpeg({ quality: jpegQ, mozjpeg: true }).toBuffer();
  while (jpegBuf.length > maxBytes && jpegQ > 60) {
    jpegQ -= 5;
    jpegBuf = await pipeline(buf, maxW).jpeg({ quality: jpegQ, mozjpeg: true }).toBuffer();
  }

  await fs.promises.writeFile(`${outBase}.webp`, webpBuf);
  await fs.promises.writeFile(`${outBase}.jpg`, jpegBuf);
  return { webp: webpBuf.length, jpeg: jpegBuf.length };
}

async function main() {
  await ensureDir(path.join(ROOT, 'images', 'main'));
  await ensureDir(path.join(ROOT, 'images', 'gallery'));
  await ensureDir(path.join(ROOT, 'images', 'locations'));

  const jpegs = await collectJpegs(SOURCE);
  if (!jpegs.length) {
    console.error('No JPEGs in SOURCE:', SOURCE);
    console.error('Set SOURCE to your villa photo folder and re-run.');
    process.exit(1);
  }

  const metas = [];
  for (const f of jpegs) {
    const meta = await metaFor(SOURCE, f);
    if (meta) metas.push(meta);
  }

  const heroMeta = metas.find((m) => m.file === HERO_FILE);
  if (!heroMeta) {
    console.error('Hero file not found:', HERO_FILE);
    process.exit(1);
  }

  const heroBuf = await fs.promises.readFile(heroMeta.path);
  console.log('Hero:', heroMeta.file, `${heroMeta.w}×${heroMeta.h}`);

  for (const { suffix, width, maxBytes } of [
    { suffix: '-800', width: 800, maxBytes: 120 * 1024 },
    { suffix: '-1200', width: 1200, maxBytes: 220 * 1024 },
    { suffix: '-1920', width: 1920, maxBytes: 400 * 1024 }
  ]) {
    const base = path.join(ROOT, 'images', 'main', `hero-main${suffix}`);
    const sizes = await writeWebpAndJpeg(heroBuf, base, {
      maxW: width,
      qualityWebp: 82,
      qualityJpeg: 82,
      maxBytes
    });
    console.log(`  hero-main${suffix}`, kb(sizes.webp), kb(sizes.jpeg));
  }

  const heroDefault = path.join(ROOT, 'images', 'main', 'hero-main');
  await fs.promises.copyFile(
    path.join(ROOT, 'images', 'main', 'hero-main-1920.webp'),
    `${heroDefault}.webp`
  );
  await fs.promises.copyFile(
    path.join(ROOT, 'images', 'main', 'hero-main-1920.jpg'),
    `${heroDefault}.jpg`
  );

  const galleryFiles = pickGalleryDiverse(metas, HERO_FILE, GALLERY_COUNT);
  if (galleryFiles.length < GALLERY_COUNT) {
    console.warn(`Only ${galleryFiles.length} gallery images (wanted ${GALLERY_COUNT}).`);
  }

  for (let i = 0; i < galleryFiles.length; i++) {
    const g = galleryFiles[i];
    const num = String(i + 1).padStart(2, '0');
    const buf = await fs.promises.readFile(g.path);
    const base = path.join(ROOT, 'images', 'gallery', `gallery-${num}`);
    const sizes = await writeWebpAndJpeg(buf, base, {
      maxW: 1200,
      qualityWebp: 80,
      qualityJpeg: 80,
      maxBytes: 250 * 1024
    });
    console.log(`Gallery ${num} <- ${g.file}`, kb(sizes.webp), kb(sizes.jpeg));
  }

  for (const { id, filename } of LOCATION_SOURCES) {
    const localPath = path.join(ASSETS_DIR, filename);
    let buf;
    try {
      await fs.promises.access(localPath);
      buf = await fs.promises.readFile(localPath);
      console.log(`Location ${id} <- local ${filename}`);
    } catch {
      const url = LOCATION_FALLBACK_URL[id];
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch ${id}: ${res.status}`);
      buf = Buffer.from(await res.arrayBuffer());
      console.log(`Location ${id} <- fallback URL`);
    }
    const base = path.join(ROOT, 'images', 'locations', id);
    const sizes = await writeWebpAndJpeg(buf, base, {
      maxW: 1400,
      qualityWebp: 78,
      qualityJpeg: 78,
      maxBytes: 300 * 1024
    });
    console.log(`  ${kb(sizes.webp)}`, kb(sizes.jpeg));
  }

  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
