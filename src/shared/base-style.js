import style from './style.json';

const attribution = '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a>';

/** The base map style, with [sources] and [layers] of a map's own added on top. */
export function baseStyle({ sources = {}, layers = [] } = {}) {
  return {
    ...style,
    sources: {
      ...style.sources,
      protomaps: { ...style.sources.protomaps, attribution },
      ...sources,
    },
    layers: [...style.layers, ...layers],
  };
}
