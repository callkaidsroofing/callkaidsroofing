import path from 'node:path';
import { promises as fs } from 'node:fs';
import sharp from 'sharp';

const projectRoot = path.resolve(process.cwd());
const heroImagePath = path.join(projectRoot, 'public', 'lovable-uploads', '80e5f731-db09-4c90-8350-01fcb1fe353d.png');

const widths = [800, 1200, 1600];
const qualitySettings = {
  avif: { quality: 55 },
  webp: { quality: 72 },
  jpeg: { quality: 82, progressive: true },
};

async function generateVariants() {
  await fs.access(heroImagePath);
  const basename = path.basename(heroImagePath, path.extname(heroImagePath));
  const outputDir = path.dirname(heroImagePath);

  for (const width of widths) {
    for (const format of ['avif', 'webp']) {
      const outputPath = path.join(outputDir, `${basename}-${width}.${format}`);
      await sharp(heroImagePath)
        .resize({ width, withoutEnlargement: true })
        .toFormat(format, qualitySettings[format])
        .toFile(outputPath);
      console.log(`Created ${path.relative(projectRoot, outputPath)}`);
    }
  }

  // Generate a single JPEG fallback at 1200px width for broad support
  const jpegOutput = path.join(outputDir, `${basename}-1200.jpg`);
  await sharp(heroImagePath)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg(qualitySettings.jpeg)
    .toFile(jpegOutput);
  console.log(`Created ${path.relative(projectRoot, jpegOutput)}`);
}

generateVariants().catch((error) => {
  console.error('Failed to generate hero image variants:', error);
  process.exit(1);
});
