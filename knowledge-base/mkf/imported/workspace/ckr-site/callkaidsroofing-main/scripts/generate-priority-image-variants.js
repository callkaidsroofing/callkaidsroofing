import path from 'node:path';
import { promises as fs } from 'node:fs';
import sharp from 'sharp';

const projectRoot = path.resolve(process.cwd());
const uploadsDir = path.join(projectRoot, 'public', 'lovable-uploads');

const priorityImages = [
  {
    file: '80e5f731-db09-4c90-8350-01fcb1fe353d.png',
    widths: [640, 1024, 1600],
    fallbackWidth: 1200,
  },
  {
    file: '5eea137e-7ec4-407d-8452-faeea24c872f.png',
    widths: [480, 960, 1440],
    fallbackWidth: 960,
  },
  {
    file: 'dfb36f59-24c0-44d0-8049-9677f7a3f7ba.png',
    widths: [400, 800, 1200],
    fallbackWidth: 800,
  },
  {
    file: 'f33cbcfa-005e-435c-a104-9a21d080a343.png',
    widths: [320, 640, 960],
    fallbackWidth: 640,
  },
  {
    file: '116450ad-e39b-42bd-891b-c7e312d4cf91.png',
    widths: [320, 640, 960],
    fallbackWidth: 640,
  },
  {
    file: '992cf8cb-032a-4253-b9d7-45f675e69217.png',
    widths: [320, 640, 960],
    fallbackWidth: 640,
  },
  {
    file: '8d1be6f1-c743-47df-8d3e-f1ab6230f326.png',
    widths: [240, 360, 540],
    fallbackWidth: 360,
  },
  {
    file: '5984413e-46ac-4f11-ac75-953d93235faa.png',
    widths: [360, 540, 720],
    fallbackWidth: 720,
  },
  {
    file: '7b53e2bb-e419-483c-b48c-ea2d1f5c139e.png',
    widths: [640, 960, 1440],
    fallbackWidth: 1200,
  },
  {
    file: 'b583ddb3-be15-4d62-b3fe-1d5a4ed4cd2a.png',
    widths: [360, 540, 720],
    fallbackWidth: 720,
  },
  {
    file: 'e1922069-2f8f-4a3e-988e-a8631602ed44.png',
    widths: [640, 960, 1440],
    fallbackWidth: 1200,
  },
];

const formatQuality = {
  avif: { quality: 55 },
  webp: { quality: 70 },
  jpeg: { quality: 82, progressive: true },
};

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function generateVariants() {
  await ensureDir(uploadsDir);

  for (const image of priorityImages) {
    const sourcePath = path.join(uploadsDir, image.file);
    await fs.access(sourcePath);

    const baseName = path.basename(image.file, path.extname(image.file));

    for (const width of image.widths) {
      for (const format of ['avif', 'webp']) {
        const outputPath = path.join(uploadsDir, `${baseName}-${width}.${format}`);
        await sharp(sourcePath)
          .resize({ width, withoutEnlargement: true })
          .toFormat(format, formatQuality[format])
          .toFile(outputPath);
        console.log(`Created ${path.relative(projectRoot, outputPath)}`);
      }
    }

    const jpegPath = path.join(uploadsDir, `${baseName}-${image.fallbackWidth}.jpg`);
    await sharp(sourcePath)
      .resize({ width: image.fallbackWidth, withoutEnlargement: true })
      .jpeg(formatQuality.jpeg)
      .toFile(jpegPath);
    console.log(`Created ${path.relative(projectRoot, jpegPath)}`);
  }
}

generateVariants().catch((error) => {
  console.error('Failed to create image variants:', error);
  process.exit(1);
});
