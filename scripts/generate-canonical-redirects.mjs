import fs from 'node:fs';

// Generate only known HTML aliases. Never strip slashes from arbitrary assets.
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const rules = paths.filter((p) => p !== '/').map((p) => {
  if (p.endsWith('/')) throw new Error(`Expected no-slash canonical: ${p}`);
  return `${p}/ ${p} 301`;
});
fs.writeFileSync('dist/_redirects', `# Generated from canonical sitemap URLs at build time.\n${rules.join('\n')}\n`);
console.log(`Generated ${rules.length} permanent trailing-slash redirects.`);
