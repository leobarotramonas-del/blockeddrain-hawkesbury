import sharp from 'sharp';
import path from 'node:path';

const jobs = [
  ['ryde-plumber-van-hero.png', 'ryde-plumber-van-hero.webp', 1600, 82],
  ['licensed-plumber-portrait.png', 'licensed-plumber-portrait.webp', 1200, 80],
  ['drain-camera-inspection.png', 'drain-camera-inspection.webp', 1200, 80],
  ['toilet-repair-service.png', 'toilet-repair-service.webp', 1200, 80],
  ['hot-water-system-service.jpg', 'hot-water-system-service.webp', 1200, 80],
  ['drainage-excavation-team.jpg', 'drainage-excavation-team.webp', 1400, 80],
];

const imageDir = path.resolve('public/images');
for (const [source, output, width, quality] of jobs) {
  await sharp(path.join(imageDir, source))
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(path.join(imageDir, output));
  console.log(`Optimized ${source} -> ${output}`);
}
