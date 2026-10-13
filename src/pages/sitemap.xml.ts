import type { APIRoute } from 'astro';
import { areas, services } from '../data/site';

export const GET: APIRoute = ({ site }) => {
  const paths = ['/', '/about', '/contact', '/services', '/service-areas', '/privacy', '/terms',
    ...services.map(({ slug }) => `/services/${slug}`),
    ...areas.map(({ slug }) => `/service-areas/${slug}`)];
  const entries = paths.map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
