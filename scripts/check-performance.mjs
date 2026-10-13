import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const images = [...home.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
for (const image of images) {
  assert.match(image, /\bsrcset="[^"]+"/, 'Homepage images need responsive candidates');
  assert.match(image, /\bsizes="[^"]+"/, 'Homepage images need display sizes');
  for (const match of image.matchAll(/\/_astro\/[^\s",]+\.webp/g)) {
    assert.ok(fs.existsSync(path.join(root, match[0])), `Missing image: ${match[0]}`);
  }
}
const background = images.find((image) => image.includes('class="home-hero__background"'));
assert.ok(background, 'Hero background must be discoverable in initial HTML');
assert.match(background, /fetchpriority="high"/);
assert.match(background, /loading="eager"/);
assert.doesNotMatch(home, /<iframe\b/, 'Map must not download before user interaction');
assert.match(home, /Load Interactive Map/);
assert.match(home, /map-preview-ryde-surrounds/);
assert.match(home, /https:\/\/www.openstreetmap.org\/copyright/);
assert.match(home, /href="https:\/\/www.google.com\/maps\/search/);
assert.doesNotMatch(home, /<link\b[^>]*rel="stylesheet"/, 'Initial styles should be inline');
assert.equal([...home.matchAll(/as="font"/g)].length, 2, 'Only critical body and heading fonts are preloaded');
console.log('Performance checks passed: responsive assets, discoverable hero, on-demand map, inline CSS and font preloads.');

const areaMaps = [
  ['ryde', 'Ryde', '2112'], ['north-ryde', 'North Ryde', '2113'],
  ['west-ryde', 'West Ryde', '2114'], ['eastwood', 'Eastwood', '2122'],
  ['gladesville', 'Gladesville', '2111'], ['meadowbank', 'Meadowbank', '2114'],
];
for (const [slug, name, postcode] of areaMaps) {
  const page = fs.readFileSync(path.join(root, 'service-areas', slug, 'index.html'), 'utf8');
  const query = encodeURIComponent(`${name} NSW ${postcode}`);
  assert.ok(page.includes(`map-preview-${slug}`), `${slug}: missing matching map preview`);
  assert.ok(page.includes('https://www.openstreetmap.org/copyright'), `${slug}: missing map attribution`);
  assert.ok(page.includes(`maps?q=${query}`), `${slug}: incorrect map suburb`);
  assert.ok(page.replaceAll('&amp;', '&').includes(`maps/search/?api=1&query=${query}`), `${slug}: missing external map link`);
  assert.doesNotMatch(page, /<iframe\b/, `${slug}: map should load only on interaction`);
  assert.ok(page.indexOf('id="area-map"') < page.indexOf('class="cta-band"'), `${slug}: map should precede closing CTA`);
}
console.log('Six suburb maps passed: local targets, external links and deferred loading.');
