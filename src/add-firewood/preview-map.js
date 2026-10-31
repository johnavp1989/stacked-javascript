// The add-firewood page's location preview: a map centred on the stack's spot
// with a pin that stays in the middle, so dragging the map moves the spot.
// Webflow loads this file as /add-firewood/location-lookup-preview-map.js.
//
// The page's other scripts know it by two globals, kept from the Leaflet
// version: they call createPreviewMap(lat, lon) when a location is found
// (geocode.js, user-location.js, image-upload-handling.js), and
// tab-navigation.js calls map.invalidateSize() after showing the tab.
import { baseStyle } from '../shared/base-style.js';
import { tileBounds } from '../shared/config.js';
import { loadMaplibre } from '../shared/load-maplibre.js';

const pinUrl = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/6146263c4fdf0b0feaf61866_Pin.svg';
// MapLibre's zooms (512 px tiles): one less than the same view in Leaflet.
const zoom = 16;
const maxZoom = 18;

let maplibre = null;
let map = null;
let marker = null;
// The position asked for while MapLibre was still loading.
let pending = null;
// Set when a drag ends: the lookup that follows calls createPreviewMap with
// the spot the user dragged to, which must not move the map again.
let moveendEvent = false;

function setCoordinateFields(lngLat) {
  document.getElementById('latitude').value = parseFloat(lngLat.lat.toFixed(5));
  document.getElementById('longitude').value = parseFloat(lngLat.lng.toFixed(5));
}

function create(maplibregl, lat, lon) {
  map = new maplibregl.Map({
    container: 'preview-map',
    style: baseStyle(),
    center: [lon, lat],
    zoom,
    maxZoom,
    maxBounds: tileBounds,
    attributionControl: false,
  });
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
  // Showing the tab used to need Leaflet told about the new size; MapLibre
  // follows its container, but resizing on request does no harm.
  map.invalidateSize = () => map.resize();
  window.map = map;

  const icon = document.createElement('img');
  icon.src = pinUrl;
  icon.alt = '';
  icon.width = 30;
  icon.height = 30;
  marker = new maplibregl.Marker({ element: icon, anchor: 'bottom' }).setLngLat([lon, lat]).addTo(map);

  map.on('move', () => marker.setLngLat(map.getCenter()));
  // Only the user's own drags and zooms: MapLibre also ends a "move" when the
  // map is resized or moved by code, and the lookup that follows rewrites the
  // address fields, which may hold the user's corrections.
  map.on('moveend', (event) => {
    if (!event.originalEvent) return;
    setCoordinateFields(map.getCenter());
    moveendEvent = true;
    window.lookupLocation('lookup_coordinates');
  });
}

/** Shows [lat, lon] on the preview map, creating it the first time. */
function createPreviewMap(lat, lon) {
  if (map) {
    if (moveendEvent) {
      moveendEvent = false;
    } else {
      marker.setLngLat([lon, lat]);
      map.jumpTo({ center: [lon, lat] });
    }
    return;
  }
  // MapLibre is only downloaded once a location needs showing.
  const first = pending === null;
  pending = [lat, lon];
  if (!first) return;
  (maplibre || (maplibre = loadMaplibre()))
    .then((maplibregl) => create(maplibregl, ...pending))
    .catch((error) => console.error('The preview map could not start', error));
}

window.createPreviewMap = createPreviewMap;
