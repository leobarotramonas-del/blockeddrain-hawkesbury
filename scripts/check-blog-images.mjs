import fs from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const post=JSON.parse(fs.readFileSync('src/data/week-one-articles.json'))[0];
const html=fs.readFileSync('dist'+post.indexPath.replace(/\/$/,'')+'/index.html','utf8');
const cards=[...html.matchAll(/<article class="guide-card"[\s\S]*?<\/article>/g)].map(([c])=>({path:c.match(/data-guide-path="([^"]+)"/)[1],image:c.match(/<img[^>]*src="([^"]+)"/)[1]}));
assert(cards.length>=3,'Expected the complete published blog archive');
// Compare normalised pixels so a renamed or resized copy is still recognised.
const pixels=await Promise.all(cards.map(c=>sharp('dist'+c.image).rotate().resize(32,32,{fit:'fill'}).greyscale().raw().toBuffer()));
const duplicates=[];
for(let a=0;a<cards.length;a++)for(let b=a+1;b<cards.length;b++){
 const rms=Math.sqrt(pixels[a].reduce((s,v,k)=>s+(v-pixels[b][k])**2,0)/pixels[a].length);
 if(rms<8)duplicates.push(cards[a].path+' and '+cards[b].path);
}
assert(!duplicates.length,'Visually duplicate featured images: '+duplicates.join('; ')+'. Choose a different photograph for each article within this website.');
console.log('Featured-image check passed: '+cards.length+' published blogs have distinct photographs.');
