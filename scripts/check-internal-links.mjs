import fs from 'node:fs';
import path from 'node:path';

// Count distinct source pages, not repeated links or self-links.
const root = path.resolve(process.argv[2] ?? 'dist');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]));
if (!urls.length) throw new Error('Sitemap has no pages to audit.');
const origin = urls[0].origin;
const normalise = (url) => url.pathname.replace(/\/+$/, '') || '/';
const pages = new Map(urls.map((url) => [normalise(url), { incoming: new Set(), content: new Set(), outgoing: new Set() }]));
const errors = [];
const exemptContent = new Set(['/', '/privacy', '/terms']);

function links(html, source) {
  const result = new Set();
  const markup = html.replace(/<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi, '');
  for (const match of markup.matchAll(/<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
    const href = (match[1] ?? match[2]).replaceAll('&amp;', '&');
    let url;
    try { url = new URL(href, `${origin}${source}`); }
    catch { errors.push(`${source}: invalid href ${href}`); continue; }
    if (url.origin !== origin) continue;
    const target = normalise(url);
    if (pages.has(target)) result.add(target);
    else {
      const direct = path.resolve(root, `.${decodeURIComponent(url.pathname)}`);
      if (!direct.startsWith(`${root}${path.sep}`) || !fs.existsSync(direct) || !fs.statSync(direct).isFile()) {
        errors.push(`${source}: internal link is not a sitemap page or file: ${href}`);
      }
    }
  }
  return result;
}

for (const [source, page] of pages) {
  const file = path.join(root, source === '/' ? 'index.html' : `${source.slice(1)}/index.html`);
  if (!fs.existsSync(file)) { errors.push(`${source}: missing built HTML`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  page.outgoing = links(html, source);
  for (const target of page.outgoing) if (target !== source) pages.get(target).incoming.add(source);
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';
  for (const target of links(main, source)) if (target !== source) pages.get(target).content.add(source);
}

const reachable = new Set();
const queue = ['/'];
for (let i = 0; i < queue.length; i++) {
  const route = queue[i];
  if (reachable.has(route)) continue;
  reachable.add(route);
  queue.push(...(pages.get(route)?.outgoing ?? []));
}
for (const [route, page] of pages) {
  if (!reachable.has(route)) errors.push(`${route}: unreachable from the homepage`);
  if (page.incoming.size < 3) errors.push(`${route}: ${page.incoming.size} incoming source pages; minimum 3`);
  if (!exemptContent.has(route) && page.content.size < 3) errors.push(`${route}: ${page.content.size} main-content source pages; minimum 3`);
}
console.table([...pages].map(([route, page]) => ({ page: route, incoming: page.incoming.size, content: page.content.size })));
if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  process.exit(1);
}
console.log(`Internal linking passed: ${pages.size} sitemap pages reachable, no orphans, at least 3 incoming source pages each and 3 content sources per commercial page.`);
