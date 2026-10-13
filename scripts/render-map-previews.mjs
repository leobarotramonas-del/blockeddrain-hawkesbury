// Renders real OpenStreetMap geometry, not invented road patterns or provider tiles.
// Input: an Overpass `out geom` JSON export; see docs/map-previews.md.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/render-map-previews.mjs <overpass-export.json>');
const { elements } = JSON.parse(fs.readFileSync(input, 'utf8'));
const water = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')).elements : [];
const rings = [];
const same = (a, b) => a.lat === b.lat && a.lon === b.lon;
for (const relation of water) {
  const pending = (relation.members ?? []).filter((m) => m.role === 'outer' && m.geometry).map((m) => [...m.geometry]);
  while (pending.length) {
    const ring = pending.pop();
    while (!same(ring[0], ring.at(-1))) {
      const index = pending.findIndex((line) => same(line[0], ring.at(-1)) || same(line.at(-1), ring.at(-1)));
      if (index < 0) break;
      const line = pending.splice(index, 1)[0];
      if (!same(line[0], ring.at(-1))) line.reverse();
      ring.push(...line.slice(1));
    }
    if (same(ring[0], ring.at(-1))) rings.push(ring);
  }
}
const places = elements.filter((item) => item.type === 'node' && item.tags?.name);
const names = ['Ryde', 'North Ryde', 'West Ryde', 'Eastwood', 'Gladesville', 'Meadowbank'];
const escape = (text) => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
const output = path.resolve('public/images');
for (const name of [...names, 'Ryde Surrounds']) {
  const overview = name === 'Ryde Surrounds';
  const centre = overview ? { lat: -33.805, lon: 151.107 } : places.find((place) => place.tags.name === name);
  if (!centre) throw new Error(`No verified OSM place node for ${name}`);
  const width = 1000, height = overview ? 660 : 460;
  const span = overview ? .095 : .052;
  const latitudeSpan = span * Math.cos(centre.lat * Math.PI / 180) * height / width;
  const project = ({ lat, lon }) => [(lon - centre.lon) / span * width + width / 2, (centre.lat - lat) / latitudeSpan * height + height / 2];
  const visible = (geometry) => geometry?.some((point) => { const [x, y] = project(point); return x >= -80 && x <= width + 80 && y >= -80 && y <= height + 80; });
  const shapes = elements.filter((item) => visible(item.geometry));
  const d = (geometry) => geometry.map((point, i) => `${i ? 'L' : 'M'}${project(point).map((v) => v.toFixed(1)).join(',')}`).join('');
  const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#eaece6"/>`];
  for (const ring of rings) parts.push(`<path d="${d(ring)}Z" fill="#afcedd"/>`);
  for (const item of shapes.filter((item) => item.tags?.natural === 'water' || item.tags?.leisure === 'park')) {
    parts.push(`<path d="${d(item.geometry)}Z" fill="${item.tags.natural === 'water' ? '#afcedd' : '#c9dbbf'}"/>`);
  }
  const roads = shapes.filter((item) => item.tags?.highway);
  for (const major of [false, true]) {
    const group = roads.filter((item) => (item.tags.highway !== 'residential') === major);
    for (const casing of [true, false]) for (const item of group) {
      const stroke = major ? (casing ? '#cbbb92' : '#fff1c6') : (casing ? '#d3d6cd' : '#fff');
      parts.push(`<path d="${d(item.geometry)}" fill="none" stroke="${stroke}" stroke-width="${major ? (casing ? 7 : 4.5) : (casing ? 4 : 2.6)}" stroke-linejoin="round" stroke-linecap="round"/>`);
    }
  }
  // Suburb labels come from the export; no business pin or invented office.
  for (const place of places) {
    const [x, y] = project(place);
    if (x < 65 || x > width - 65 || y < 28 || y > height - 28) continue;
    parts.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${overview ? 19 : 23}" font-weight="600" fill="#53636b" stroke="#f7f8f2" stroke-width="4" paint-order="stroke">${escape(place.tags.name)}</text>`);
  }
  parts.push('</svg>');
  const slug = name.toLowerCase().replaceAll(' ', '-');
  await sharp(Buffer.from(parts.join(''))).png().toFile(path.join(output, `map-preview-${slug}.png`));
  console.log(`Rendered ${slug}: ${centre.lat}, ${centre.lon}; ${shapes.length} real geographic features`);
}
