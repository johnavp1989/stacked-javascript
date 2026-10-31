// Writes src/home/style.json, the home map's base style: the stock
// @protomaps/basemaps light flavour (the same version the app's map uses),
// pointed at our tiles, fonts and icons. The map adds the stack layers itself.
// Run with `npm run style` after changing the basemaps version or config.js.
import { layers, namedFlavor } from '@protomaps/basemaps';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glyphsUrl, spriteUrl, tileJsonUrl } from '../src/home/config.js';

const style = {
  version: 8,
  glyphs: glyphsUrl,
  sprite: spriteUrl,
  sources: { protomaps: { type: 'vector', url: tileJsonUrl } },
  layers: layers('protomaps', namedFlavor('light'), { lang: 'en' }),
};
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'home', 'style.json');
fs.writeFileSync(out, JSON.stringify(style));
console.log(`${out}: ${style.layers.length} layers`);
