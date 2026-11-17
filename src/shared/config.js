// Where the website maps' data comes from. Keep in step with the app's
// lib/ui/core/constants/map_config.dart (MapTileConfig).

export const apiBaseUrl = 'https://private.api.stacked.camp';

// The tile build the map is drawn from. Moving to a newer one is this line plus
// `npm run style`, once the API nodes serve it.
const tileArchive = 'na-20261009';
export const tileJsonUrl = `${apiBaseUrl}/tiles/xyz/${tileArchive}.json`;

// What the tile build covers (its TileJSON's bounds), as [[west, south],
// [east, north]]. The map is kept inside it: past it there is only background.
export const tileBounds = [[-170, 14], [-50, 84]];

// Label fonts and icon sheets; the number is bumped whenever they change.
const assetsUrl = `${apiBaseUrl}/tiles/assets-1`;
export const glyphsUrl = `${assetsUrl}/fonts/{fontstack}/{range}.pbf`;
export const spriteUrl = `${assetsUrl}/sprites/light`;

// MapLibre GL JS is loaded from the CDN, pinned to an exact version.
export const maplibreVersion = '6.14.0';
export const maplibreBaseUrl = `https://cdn.jsdelivr.net/npm/maplibre-gl@${maplibreVersion}/dist`;
