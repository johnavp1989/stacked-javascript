import baseStyle from './style.json';
import pinSvg from './icons/pin.svg';
import pinSelectedSvg from './icons/pin-selected.svg';
import { tileBounds } from './config.js';
import { pointFeature, stacksGeoJson } from './stacks.js';

const stacksSource = 'stacks';
const selectedSource = 'selected-stack';
const clusterLayer = 'stack-clusters';
const clusterCountLayer = 'stack-cluster-count';
const pinLayer = 'stack-pins';
const selectedPinLayer = 'stack-selected-pin';
const pinImage = 'pin';
const selectedPinImage = 'pin-selected';

// Colours of the app's clusters (AppColors.forestGreen, cream).
const forestGreen = '#2e4b2f';
const cream = '#faf6ee';

// The pin artwork is 39 x 50; it is shown 36 px tall, as before.
const pinWidth = 28;
const pinHeight = 36;

// Zooms are MapLibre's (512 px tiles): one less than the same view in Leaflet.
const maxZoom = 18;
export const flyToZoom = 12;
const center = [-97.822, 37.751];

// How far from a tap a pin still counts as tapped, in pixels.
const tapSlop = 6;

function initialZoom() {
  const width = (query) => window.matchMedia(`only screen and ${query}`).matches;
  if (width('(max-width: 480px)')) return 2;
  if (width('(min-width: 481px) and (max-width: 1024px)')) return 3;
  return 4;
}

const emptyGeoJson = { type: 'FeatureCollection', features: [] };

function style() {
  return {
    ...baseStyle,
    sources: {
      ...baseStyle.sources,
      protomaps: { ...baseStyle.sources.protomaps, attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a>' },
      [stacksSource]: {
        type: 'geojson',
        data: emptyGeoJson,
        cluster: true,
        clusterRadius: 60,
        clusterMaxZoom: 16,
      },
      [selectedSource]: { type: 'geojson', data: emptyGeoJson },
    },
    layers: [
      ...baseStyle.layers,
      {
        id: clusterLayer,
        type: 'circle',
        source: stacksSource,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': forestGreen,
          'circle-radius': 22,
          'circle-stroke-color': cream,
          'circle-stroke-width': 2,
        },
      },
      {
        id: clusterCountLayer,
        type: 'symbol',
        source: stacksSource,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['Noto Sans Medium'],
          'text-size': 15,
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: { 'text-color': cream },
      },
      pinLayerSpec(pinLayer, stacksSource, pinImage, ['!', ['has', 'point_count']]),
      pinLayerSpec(selectedPinLayer, selectedSource, selectedPinImage),
    ],
  };
}

function pinLayerSpec(id, source, image, filter) {
  return {
    id,
    type: 'symbol',
    source,
    ...(filter ? { filter } : {}),
    layout: {
      'icon-image': image,
      'icon-anchor': 'bottom',
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
    },
  };
}

/** An SVG drawn at the screen's pixel density, ready for map.addImage. */
function rasterize(svg, ratio) {
  return new Promise((resolve, reject) => {
    const image = new Image(Math.round(pinWidth * ratio), Math.round(pinHeight * ratio));
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

/**
 * The home map: every stack as a pin, clustered until zoomed in. [onSelect] is
 * called with the stack a pin tap (or [select]) picks, [onBackgroundTap] when
 * the map is tapped away from any pin.
 */
export class StackMap {
  constructor(maplibregl, { onSelect, onBackgroundTap }) {
    this.maplibregl = maplibregl;
    this.onSelect = onSelect;
    this.onBackgroundTap = onBackgroundTap;
    this.stacksById = new Map();
    this.selectedId = null;

    this.map = new maplibregl.Map({
      container: 'map',
      style: style(),
      center,
      zoom: initialZoom(),
      maxZoom,
      maxBounds: tileBounds,
      // Bottom right is under Webflow's Add Firewood box.
      attributionControl: false,
    });
    this.map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    this.loaded = new Promise((resolve) => this.map.once('load', resolve));
    this.map.on('error', (event) => console.error('Map error', event.error));
    this.map.on('click', (event) => this.onClick(event));
    for (const layer of [pinLayer, selectedPinLayer, clusterLayer]) {
      this.map.on('mouseenter', layer, () => { this.map.getCanvas().style.cursor = 'pointer'; });
      this.map.on('mouseleave', layer, () => { this.map.getCanvas().style.cursor = ''; });
    }
    this.imagesAdded = this.addPinImages();
  }

  async addPinImages() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const [pin, selected] = await Promise.all([rasterize(pinSvg, ratio), rasterize(pinSelectedSvg, ratio)]);
    await this.loaded;
    this.map.addImage(pinImage, pin, { pixelRatio: ratio });
    this.map.addImage(selectedPinImage, selected, { pixelRatio: ratio });
  }

  async setStacks(stacks) {
    this.stacksById = new Map(stacks.map((stack) => [String(stack.stackID), stack]));
    await this.loaded;
    this.map.getSource(stacksSource).setData(stacksGeoJson(stacks));
  }

  stack(id) {
    return this.stacksById.get(String(id));
  }

  /** Shows [stack] as the selected pin and tells [onSelect]. */
  async select(stack) {
    this.selectedId = String(stack.stackID);
    await this.loaded;
    this.map.getSource(selectedSource).setData({ type: 'FeatureCollection', features: [pointFeature(stack)] });
    this.onSelect(stack);
  }

  async clearSelection() {
    this.selectedId = null;
    await this.loaded;
    this.map.getSource(selectedSource).setData(emptyGeoJson);
  }

  /** Flies to [latitude, longitude], zooming in to [flyToZoom] unless already closer. */
  flyTo(latitude, longitude, zoom = Math.max(this.map.getZoom(), flyToZoom)) {
    this.map.flyTo({ center: [longitude, latitude], zoom });
  }

  onClick(event) {
    const { x, y } = event.point;
    const box = [[x - tapSlop, y - tapSlop], [x + tapSlop, y + tapSlop]];
    const pins = this.map.queryRenderedFeatures(box, { layers: [selectedPinLayer, pinLayer] });
    if (pins.length > 0) {
      const stack = this.stack(pins[0].properties.id);
      if (stack) this.select(stack);
      return;
    }
    const clusters = this.map.queryRenderedFeatures(event.point, { layers: [clusterLayer] });
    if (clusters.length > 0) {
      const cluster = clusters[0];
      this.map
        .getSource(stacksSource)
        .getClusterExpansionZoom(cluster.properties.cluster_id)
        .then((zoom) => this.map.easeTo({ center: cluster.geometry.coordinates, zoom }));
      return;
    }
    this.clearSelection();
    this.onBackgroundTap();
  }
}
