import { maplibreBaseUrl } from './config.js';

// MapLibre GL JS 6 is published only as an ES module, and this bundle is a
// classic script (Webflow adds it with a plain <script> tag). The import goes
// through a Function so the minifiers in CI never have to parse `import()`.
const importModule = new Function('url', 'return import(url)');

/** Loads MapLibre's stylesheet and module from the CDN; resolves to the module. */
export function loadMaplibre() {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = `${maplibreBaseUrl}/maplibre-gl.css`;
  document.head.appendChild(css);
  return importModule(`${maplibreBaseUrl}/maplibre-gl.mjs`);
}
