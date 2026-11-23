import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
let count=0;const errors=[];
for(const file of files(root).filter(file=>file.endsWith('.html'))){
 const html=fs.readFileSync(file,'utf8');
 const graphs=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].flatMap(match=>{const parsed=JSON.parse(match[1]);return parsed['@graph']??[parsed];});
 const business=graphs.find(node=>String(node['@id']??'').endsWith('#business'));
 if(!business){errors.push(file+': missing business entity');continue;}
 if(business['@type']!=='Organization')errors.push(file+': expected Organization for service-area business');
 for(const field of ['name','url','logo','telephone','sameAs','contactPoint'])if(!business[field]||Array.isArray(business[field])&&!business[field].length)errors.push(file+': missing '+field);
 if(business.address)errors.push(file+': unexpected public business address');
 const logo=typeof business.logo==='string'?business.logo:business.logo?.url;
 if(logo&&!fs.existsSync(path.join(root,new URL(logo).pathname)))errors.push(file+': missing logo asset');
 function walk(value){if(!value||typeof value!=='object')return;if([value['@type']].flat().includes('Plumber'))errors.push(file+': unconverted Plumber entity');Object.values(value).forEach(child=>Array.isArray(child)?child.forEach(walk):walk(child));}
 graphs.forEach(walk);count++;
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Organization schema passed on ${count} HTML pages: verified identity, logo, contact details, service-area model.`);
