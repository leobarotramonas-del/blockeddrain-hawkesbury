# Map preview assets

The seven `public/images/map-preview-*.png` images are locally rendered previews of real OpenStreetMap geometry, not Google screenshots or imaginary map illustrations. Data obtained 30 September 2026 via https://overpass-api.de/api/interpreter.

Attribution: © OpenStreetMap contributors. Data licence: https://www.openstreetmap.org/copyright (ODbL). Visible linked attribution must remain beside the preview and must not be blurred or obscured. Interactive maps still use Google Maps after activation, with Google's own attribution.

The previews are simplified context maps, not suburb boundary polygons or business-location pins. Each suburb view is centred on the matching OSM place node; the homepage has a broader Ryde-area view. Styling is authored locally from the exported geometry, so no OSM tile-server downloading is required. Blur is applied in CSS, not to the source geography.

To regenerate, save this Overpass query's JSON response outside the public directory. Also export `[out:json][timeout:40];relation[natural=water](-33.85,151.04,-33.75,151.17);out geom;` to a second JSON file for river outlines. Run `node scripts/render-map-previews.mjs <export.json> <water.json>`:

```text
[out:json][timeout:40];
(
  way[highway~"^(primary|secondary|tertiary|residential|motorway|trunk)$"](-33.85,151.04,-33.75,151.17);
  way[natural=water](-33.85,151.04,-33.75,151.17);
  way[leisure=park](-33.85,151.04,-33.75,151.17);
  node[place~"suburb|town"](-33.85,151.04,-33.75,151.17);
);
out geom;
```

Astro generates responsive, compressed WebP derivatives. The map provider is not contacted by a visitor until they activate the interactive map or external link.
