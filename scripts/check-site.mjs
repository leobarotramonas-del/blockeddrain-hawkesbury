import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const htmlFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) htmlFiles.push(file);
  }
};
walk(root);

const errors = [];
const origin = 'https://blockeddrainshawkesbury.com.au';
const preview = process.env.PUBLIC_ALLOW_INDEXING === 'false';
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedUrls = [];
const pageSchemaIds = new Map();
const pageSchemaSignatures = new Map();
const serviceSchemaIds = new Map();
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
if (preview ? !robots.includes('Disallow: /') : (!robots.includes('Allow: /') || robots.includes('Disallow: /') || !robots.includes(`Sitemap: ${origin}/sitemap.xml`))) errors.push('robots.txt: incorrect production/preview rules');
const usSpellings = /\b(color|center|organization|organize|organized|analyze|analyzed|behavior|favor|neighbor|neighborhood)\b/gi;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file);
  const route = relative.replaceAll('\\', '/');
  const is404 = route === '404.html' || route === '404/index.html';
  const pagePath = route === 'index.html' ? '/' : `/${route.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`;
  const expectedUrl = `${origin}${pagePath}`;
  if (!is404) expectedUrls.push(expectedUrl);
  const count = (pattern) => [...html.matchAll(pattern)].length;
  if (!is404 && (count(/<link rel="canonical"/g) !== 1 || !html.includes(`<link rel="canonical" href="${expectedUrl}"`))) errors.push(`${relative}: incorrect self-canonical`);
  const directive = preview || is404 ? 'noindex,nofollow' : 'index,follow,max-image-preview:large';
  if (!html.includes(`<meta name="robots" content="${directive}"`)) errors.push(`${relative}: incorrect robots meta`);
  if (/https?:\/\/[^"\s<>]*(?:pages\.dev|workers\.dev)/.test(html)) errors.push(`${relative}: preview domain leaked into HTML`);
  for (const tag of ['og:url', 'og:image']) {
    if (!html.includes(`<meta property="${tag}" content="${origin}/`)) errors.push(`${relative}: missing production ${tag}`);
  }
  for (const tag of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    if (!html.includes(`<meta name="${tag}" content="`)) errors.push(`${relative}: missing ${tag}`);
  }
  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    // Astro serializes the valid empty decorative attribute as `alt`.
    if (!/\balt(?:="[^"]*"|(?=\s|>))/.test(image[0])) errors.push(`${relative}: image lacks alt attribute`);
    if (/src="\/images\/(?!the-ryde-plumber-logo)[^"]+"/.test(image[0]) && /\balt=""/.test(image[0])) errors.push(`${relative}: work photograph needs descriptive alt text`);
  }
  const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  try {
    const nodes = scripts.flatMap((match) => { const data = JSON.parse(match[1]); return data['@graph'] ?? [data]; });
    const typed = (type) => nodes.filter((node) => [node['@type']].flat().includes(type));
    for (const type of ['WebPage', 'WebSite', 'Plumber']) {
      if (typed(type).length !== 1) errors.push(`${relative}: expected one ${type} schema node`);
    }
    const ids = nodes.map((node) => node['@id']);
    if (ids.some((id) => !id || !/^https:\/\//.test(id)) || new Set(ids).size !== ids.length) errors.push(`${relative}: schema IDs must be unique absolute URLs`);
    const business = typed('Plumber')[0];
    const webPage = typed('WebPage')[0];
    if (business?.['@id'] !== `${origin}/#business` || typed('WebSite')[0]?.url !== `${origin}/` || webPage?.url !== expectedUrl) errors.push(`${relative}: incorrect production schema URLs`);
    const pageSignature = JSON.stringify({ name: webPage?.name, description: webPage?.description, url: webPage?.url });
    if (pageSchemaIds.has(webPage?.['@id'])) errors.push(`${relative}: WebPage schema ID duplicates ${pageSchemaIds.get(webPage?.['@id'])}`);
    if (pageSchemaSignatures.has(pageSignature)) errors.push(`${relative}: page-specific schema duplicates ${pageSchemaSignatures.get(pageSignature)}`);
    pageSchemaIds.set(webPage?.['@id'], relative);
    pageSchemaSignatures.set(pageSignature, relative);
    if (business?.identifier?.value !== '210933C') errors.push(`${relative}: missing business licence`);
    if (route !== 'index.html' && typed('BreadcrumbList').length !== 1) errors.push(`${relative}: missing breadcrumbs`);
    for (const crumb of typed('BreadcrumbList').flatMap((node) => node.itemListElement)) {
      if (!/^https:\/\//.test(crumb.item)) errors.push(`${relative}: breadcrumb URL must be absolute`);
    }
    if (/^(services|service-areas)\/(?!index\.html)[^/]+\/index\.html$/.test(route)) {
      const service = typed('Service')[0];
      if (typed('Service').length !== 1 || service?.provider?.['@id'] !== business?.['@id']) errors.push(`${relative}: service must reference shared business`);
      if (serviceSchemaIds.has(service?.['@id'])) errors.push(`${relative}: Service schema ID duplicates ${serviceSchemaIds.get(service?.['@id'])}`);
      serviceSchemaIds.set(service?.['@id'], relative);
      if (!service?.description || !service?.serviceType || !service?.serviceOutput || !service?.areaServed) errors.push(`${relative}: service schema lacks page-specific detail`);
      if (count(/id="reviews-title"/g) !== 1 || !visibleReviewHeading(html)) errors.push(`${relative}: missing Honest Reviews section`);
    }
    if (typed('AggregateRating').length || typed('Review').length) errors.push(`${relative}: unexpected review rating schema`);
  } catch (error) { errors.push(`${relative}: invalid JSON-LD: ${error.message}`); }
  const visibleText = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  if (count(/<h1\b/gi) !== 1) errors.push(`${relative}: expected one h1`);
  if (count(/<title>[^<]+<\/title>/gi) !== 1) errors.push(`${relative}: missing title`);
  if (count(/<meta name="description" content="[^"]+"/gi) !== 1) errors.push(`${relative}: missing description`);
  const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? '';
  const decodedDescription = description.replace(/&#(x[0-9a-f]+|\d+);|&(amp|quot|apos|lt|gt);/gi, (_, code, name) => code ? String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code)) : ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[name.toLowerCase()]));
  if (!is404 && [...decodedDescription].length < 130) errors.push(`${relative}: description has ${[...decodedDescription].length} characters; minimum 130`);
  const spellingMatches = [...visibleText.matchAll(usSpellings)].map((match) => match[0]);
  if (spellingMatches.length) errors.push(`${relative}: review US spelling: ${[...new Set(spellingMatches)].join(', ')}`);
  const faqPage = /^(index\.html|about\/index\.html|contact\/index\.html|services\/.+\/index\.html|service-areas\/.+\/index\.html)$/.test(route);
  if (faqPage) {
    const visibleFaqs = count(/<details>/gi);
    const schemaFaqs = count(/@type":"Question/gi);
    if (visibleFaqs < 4) errors.push(`${relative}: expected at least 4 visible FAQs`);
    if (schemaFaqs !== visibleFaqs) errors.push(`${relative}: visible and schema FAQ counts differ`);
  }
  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = match[1].split('#')[0].split('?')[0];
    if (!href || href.startsWith('//')) continue;
    const target = href === '/' ? path.join(root, 'index.html') : path.join(root, href, 'index.html');
    const direct = path.join(root, href.replace(/^\//, ''));
    if (!fs.existsSync(target) && !fs.existsSync(direct)) errors.push(`${relative}: broken local link ${href}`);
  }
}

if (new Set(sitemapUrls).size !== sitemapUrls.length || sitemapUrls.length !== expectedUrls.length || expectedUrls.some((url) => !sitemapUrls.includes(url))) errors.push('sitemap.xml: expected every indexable route once, excluding 404');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Checked ${htmlFiles.length} HTML files: metadata, H1s, links, Australian English, local FAQs, schema and Honest Reviews passed.`);

function visibleReviewHeading(html) { return /<h2[^>]*id="reviews-title"[^>]*>Honest Reviews<\/h2>/.test(html); }
