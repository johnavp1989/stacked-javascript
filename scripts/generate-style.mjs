// Writes src/shared/style.json, the website maps' base style: the stock
// @protomaps/basemaps light flavour (the same version the app's map uses),
// pointed at our tiles, fonts and icons. The home map adds the stack layers itself.
// Run with `npm run style` after changing the basemaps version or config.js.
import { layers, namedFlavor } from '@protomaps/basemaps';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glyphsUrl, spriteUrl, tileJsonUrl } from '../src/shared/config.js';

const style = {
  version: 8,
  glyphs: glyphsUrl,
  sprite: spriteUrl,
  sources: { protomaps: { type: 'vector', url: tileJsonUrl } },
  layers: layers('protomaps', namedFlavor('light'), { lang: 'en' }),
};
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'shared', 'style.json');
fs.writeFileSync(out, JSON.stringify(style));
console.log(`${out}: ${style.layers.length} layers`);
