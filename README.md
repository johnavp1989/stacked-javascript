# stacked-javascript

Scripts the stacked.camp Webflow site loads from Google Cloud Storage. The
site's head defines `load_cloud_script(path)`, which loads
`stacked_javascript/mini_javascript<path>` on stacked.camp and
`stacked_javascript/dev_javascript<path>` on stacked-staging.webflow.io.

- A push to `master` minifies `javascript/` into `mini_javascript/` and uploads
  both (`.github/workflows/gstorage.yml`): that is production.
- A push to any other branch uploads `javascript/` to `dev_javascript/`
  (`gstorage_dev.yml`), which only the staging site reads.

## The maps

Two files are built, not written: `npm ci && npm run build` bundles them with
esbuild (CI does this before uploading), and they are gitignored.

| Built file | Source | What it is |
|---|---|---|
| `javascript/home/map.js` | `src/home/` | the home page map, with every stack |
| `javascript/add-firewood/location-lookup-preview-map.js` | `src/add-firewood/` | the add-firewood location preview |

Both are MapLibre GL JS vector maps over our own tiles on the API nodes, the
same tiles and base style as the app (`stacked_app`, `docs/map-tiles.md`).

- MapLibre itself is loaded from jsDelivr at the exact version in
  `src/shared/config.js`.
- `src/shared/style.json` is generated: `npm run style` (from
  `@protomaps/basemaps`, pinned in `package.json` to the version the app uses).
  Run it after changing the tile build or asset URLs in `config.js`.
- Webflow still requests the old Leaflet-era home scripts (`populate-map.js`,
  `marker-click.js`, ...); they are empty, since the bundle does what they did.
- The preview map keeps the old script's globals, `createPreviewMap(lat, lon)`
  and `map.invalidateSize()`, which the other add-firewood scripts call.
- Each stack's own page has a small map whose code is inline in the Webflow
  template, not here; it is still Leaflet over Mapbox.

To try a change before pushing, save the live home page's HTML, point its
`javascript_bucket_url_prefix` at a local static server whose
`mini_javascript/` is this repo's `javascript/`, and open it. The API's read
gate admits the home network whatever the Referer, so this cannot show a gate
problem: check the staging site from a phone on cellular for that.
