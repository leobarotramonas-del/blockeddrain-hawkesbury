import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const htmlFiles = [];
const collect = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const item = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(item);
    else if (entry.name.endsWith('.html')) htmlFiles.push(item);
  }
};
collect(root);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
  for (const image of images) {
    assert.match(image, /\bsrcset="[^"]+"/, `${file}: image needs responsive candidates`);
    assert.match(image, /\bsizes="[^"]+"/, `${file}: image needs display sizes`);
    assert.match(image, /\bwidth="\d+"/, `${file}: image needs an intrinsic width`);
    assert.match(image, /\bheight="\d+"/, `${file}: image needs an intrinsic height`);
  }
  for (const video of html.matchAll(/<video\b[\s\S]*?<\/video>/g)) {
    assert.match(video[0], /<track\b[^>]*kind="captions"/, `${file}: video needs captions`);
  }
}

const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const hero = [...home.matchAll(/<img\b[^>]*>/g)]
  .map(([tag]) => tag)
  .find((tag) => tag.includes('data-source="/images/drain-jetting-team.jpeg"'));
assert.ok(hero, 'Homepage hero image must be discoverable in initial HTML');
assert.match(hero, /fetchpriority="high"/);
assert.match(hero, /loading="eager"/);
assert.match(hero, /\b672w\b/, 'Homepage hero needs a near-display-width mobile candidate');
assert.doesNotMatch(home, /<iframe\b/, 'Third-party embeds must not download during initial rendering');
assert.doesNotMatch(home, /<link\b[^>]*rel="stylesheet"/, 'Initial styles should remain inline');
assert.equal([...home.matchAll(/as="font"/g)].length, 2, 'Only critical body and heading fonts are preloaded');

console.log(`Performance checks passed for ${htmlFiles.length} pages: responsive images, fixed dimensions, priority hero, captions and lean initial loading.`);
