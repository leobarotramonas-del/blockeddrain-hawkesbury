type SchemaNode = Record<string, any>;

// These are service-area websites: the operator has not supplied a public office address.
// Organization describes the verified business without claiming a LocalBusiness storefront.
export function organizationSchema(data: SchemaNode, root: string, name: string, logo: string): SchemaNode {
  const base = new URL('/', root).href;
  const businessId = `${base}#business`;
  const operatorUrl = 'https://antonsplumbingandgas.com.au/';
  function visit(value: any): any {
    if (Array.isArray(value)) return value.map(visit);
    if (!value || typeof value !== 'object') return value;
    const node: SchemaNode = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, visit(item)]));
    const types = [node['@type']].flat();
    if (types.includes('Plumber')) {
      node['@type'] = types.length === 1 ? 'Organization' : types.map(type => type === 'Plumber' ? 'Organization' : type);
      const hours = node.openingHoursSpecification;
      delete node.openingHoursSpecification;
      delete node.priceRange;
      delete node.geo;
      delete node.address;
      if (hours) node.contactPoint = { '@type': 'ContactPoint', telephone: node.telephone ?? '+61493824176', contactType: 'customer service', hoursAvailable: hours, ...node.contactPoint };
    }
    if (node['@id'] === businessId && node['@type'] === 'Organization') {
      node.name = name;
      node.url = base;
      node.logo ??= new URL(logo, base).href;
      node.sameAs = [...new Set([...(node.sameAs ?? []), operatorUrl])];
      node.telephone ??= '+61493824176';
      node.contactPoint = { '@type': 'ContactPoint', telephone: '+61493824176', contactType: 'customer service', areaServed: 'AU-NSW', availableLanguage: 'English', ...node.contactPoint };
    }
    return node;
  }
  return visit(data);
}
