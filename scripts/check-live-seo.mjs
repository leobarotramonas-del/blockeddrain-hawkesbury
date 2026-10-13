// Run after Cloudflare's Git deployment completes, not during the build.
const origin = 'https://blockeddrainshawkesbury.com.au';
const errors = [];
const rows = [];
const responses = new Map();
const decode = (value) => value.replace(/&#(x[0-9a-f]+|\d+);|&(amp|quot|apos|lt|gt);/gi, (_, code, name) => code ? String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code)) : ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[name.toLowerCase()]));

async function read(url) {
  if (!responses.has(url)) responses.set(url, (async () => {
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
    return { status: response.status, location: response.headers.get('location'), robots: response.headers.get('x-robots-tag') ?? '', text: await response.text() };
  })());
  return responses.get(url);
}
async function redirect(source, target, statuses = [301, 308]) {
  const response = await read(source);
  const destination = response.location ? new URL(response.location, source).href : null;
  if (!statuses.includes(response.status) || destination !== target) errors.push(`${source}: expected permanent redirect to ${target}; got ${response.status} ${destination}`);
}

const sitemap = await read(`${origin}/sitemap.xml`);
if (sitemap.status !== 200) throw new Error(`Sitemap returned ${sitemap.status}, expected direct 200.`);
const urls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
if (!urls.length || new Set(urls).size !== urls.length) throw new Error('Sitemap is empty or has duplicate URLs.');
const internalLinks = new Set();
for (let i = 0; i < urls.length; i += 4) {
  await Promise.all(urls.slice(i, i + 4).map(async (url) => {
    const parsed = new URL(url);
    if (parsed.origin !== origin || (parsed.pathname !== '/' && parsed.pathname.endsWith('/'))) errors.push(`Non-canonical sitemap URL: ${url}`);
    const page = await read(url);
    if (page.status !== 200) errors.push(`${url}: sitemap URL returns ${page.status}, expected direct 200`);
    const canonicals = [...page.text.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/gi)];
    if (canonicals.length !== 1 || decode(canonicals[0][1]) !== url) errors.push(`${url}: missing or non-self canonical`);
    if (/noindex/i.test(page.robots) || /<meta name="robots" content="[^"]*noindex/i.test(page.text)) errors.push(`${url}: unexpected noindex`);
    const metas = [...page.text.matchAll(/<meta name="description" content="([^"]*)"/gi)];
    const length = [...decode(metas[0]?.[1] ?? '')].length;
    if (metas.length !== 1 || length < 130) errors.push(`${url}: expected one description of at least 130 characters; got ${length}`);
    for (const link of page.text.matchAll(/<a\b[^>]*href="([^"]*)"/gi)) {
      const target = new URL(decode(link[1]), url);
      if ([parsed.hostname, `www.${parsed.hostname}`].includes(target.hostname)) {
        target.hash = '';
        internalLinks.add(target.href);
      }
    }
    await redirect(url.replace('https:', 'http:'), url);
    if (parsed.pathname !== '/') await redirect(`${url}/`, url);
    rows.push({ page: parsed.pathname, status: page.status, descriptionCharacters: length });
  }));
}
for (const url of internalLinks) {
  const response = await read(url);
  if (response.status !== 200) errors.push(`${url}: internal link returns ${response.status}, expected direct 200`);
}
const robots = await read(`${origin}/robots.txt`);
if (robots.status !== 200 || !robots.text.includes(`Sitemap: ${origin}/sitemap.xml`)) errors.push('robots.txt: wrong status or sitemap reference');
for (const path of ['/robots.txt', '/sitemap.xml', '/about?redirect_test=1&source=seo-check']) {
  for (const scheme of ['http', 'https']) await redirect(`${scheme}://www.blockeddrainshawkesbury.com.au${path}`, `${origin}${path}`);
  await redirect(`http://blockeddrainshawkesbury.com.au${path}`, `${origin}${path}`);
}
if ((await read(`${origin}/seo-check-nonexistent-page`)).status !== 404) errors.push('Unknown route must return 404, not a soft 404.');
console.table(rows.sort((a, b) => a.page.localeCompare(b.page)));
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Live SEO passed: ${urls.length} direct-200 canonical pages, descriptions >=130 characters, direct internal links, permanent aliases, HTTPS/www redirects and 404 handling.`);
