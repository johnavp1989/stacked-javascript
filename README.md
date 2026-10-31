# stacked-javascript

Scripts the stacked.camp Webflow site loads from Google Cloud Storage. The
site's head defines `load_cloud_script(path)`, which loads
`stacked_javascript/mini_javascript<path>` on stacked.camp and
`stacked_javascript/dev_javascript<path>` on stacked-staging.webflow.io.

- A push to `master` minifies `javascript/` into `mini_javascript/` and uploads
  both (`.github/workflows/gstorage.yml`): that is production.
- A push to any other branch uploads `javascript/` to `dev_javascript/`
  (`gstorage_dev.yml`), which only the staging site reads.

## The home map

`javascript/home/map.js` is built, not written: `npm ci && npm run build`
bundles `src/home/` with esbuild (CI does this before uploading). It is a
MapLibre GL JS vector map over our own tiles on the API nodes, the same tiles
and base style as the app (`stacked_app`, `docs/map-tiles.md`).

- MapLibre itself is loaded from jsDelivr at the exact version in
  `src/home/config.js`.
- `src/home/style.json` is generated: `npm run style` (from
  `@protomaps/basemaps`, pinned in `package.json` to the version the app uses).
  Run it after changing the tile build or asset URLs in `config.js`.
- Webflow still requests the old Leaflet-era home scripts (`populate-map.js`,
  `marker-click.js`, ...); they are empty, since the bundle does what they did.

To try a change before pushing, save the live home page's HTML, point its
`javascript_bucket_url_prefix` at a local static server whose
`mini_javascript/` is this repo's `javascript/`, and open it. The API's read
gate admits the home network whatever the Referer, so this cannot show a gate
problem: check the staging site from a phone on cellular for that.
