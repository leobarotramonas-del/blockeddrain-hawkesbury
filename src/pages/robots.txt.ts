import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const allowIndexing = import.meta.env.PROD && import.meta.env.PUBLIC_ALLOW_INDEXING !== 'false';
  const body = allowIndexing
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
