import { areas, services, site } from './site';

type Node = Record<string, any>;

export function pageSchema(baseUrl: string, path: string, title: string, description: string, extra?: Node | Node[]) {
  const root = new URL('/', baseUrl).href;
  const url = new URL(path, root).href;
  const businessId = `${root}#business`;
  const pageId = `${url}#webpage`;
  const supplied: Node[] = (Array.isArray(extra) ? extra : extra ? [extra] : []).flatMap((node) => node['@graph'] ?? [node]);
  const details = supplied.filter((node) => !['Plumber', 'BreadcrumbList'].includes(node['@type'])).map((node) => {
    const { '@context': context, ...detail } = node;
    if (node['@type'] === 'Service') return { ...detail, '@id': `${url}#service`, url, provider: { '@id': businessId }, mainEntityOfPage: { '@id': pageId } };
    if (node['@type'] === 'FAQPage') return { ...detail, '@id': `${url}#faq`, isPartOf: { '@id': pageId } };
    return detail;
  });
  const labels: Record<string, string> = { services: 'Services', 'service-areas': 'Service areas', about: 'About us', contact: 'Contact', privacy: 'Privacy policy', terms: 'Website terms', '404': 'Page not found' };
  const segments = path.split('/').filter(Boolean);
  const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: root }, ...segments.map((segment, index) => ({
    '@type': 'ListItem', position: index + 2,
    name: areas.find((area) => area.slug === segment)?.name ?? services.find((service) => service.slug === segment)?.name ?? labels[segment] ?? title,
    item: new URL(`/${segments.slice(0, index + 1).join('/')}`, root).href,
  }))];
  const type = path === '/about' ? 'AboutPage' : path === '/contact' ? 'ContactPage' : 'WebPage';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Plumber', '@id': businessId, name: site.name, alternateName: site.operator, url: root, telephone: '+61 493 824 176',
        identifier: { '@type': 'PropertyValue', propertyID: 'NSW contractor licence', value: site.licence },
        areaServed: areas.map((area) => ({ '@type': 'Place', name: `${area.name}, NSW ${area.postcode}, Australia` })),
        knowsAbout: services.map((service) => service.name) },
      { '@type': 'WebSite', '@id': `${root}#website`, url: root, name: site.name, inLanguage: 'en-AU', publisher: { '@id': businessId } },
      { '@type': type === 'WebPage' ? 'WebPage' : ['WebPage', type], '@id': pageId, url, name: title, description, inLanguage: 'en-AU', isPartOf: { '@id': `${root}#website` }, about: { '@id': businessId },
        ...(segments.length ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
        ...(details.some((node) => node['@type'] === 'Service') ? { mainEntity: { '@id': `${url}#service` } } : {}),
        ...(details.some((node) => node['@type'] === 'FAQPage') ? { hasPart: { '@id': `${url}#faq` } } : {}) },
      ...(segments.length ? [{ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: crumbs }] : []),
      ...details,
    ],
  };
}
