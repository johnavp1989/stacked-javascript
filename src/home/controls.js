import { apiBaseUrl } from './config.js';

const myLocationIconUrl = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/6187ed619f8c8d474e7c99b6_MyLocD%404x.png';
const searchZoom = 14;
const locationOptions = { enableHighAccuracy: false, timeout: 3000, maximumAge: 0 };

const byId = (id) => document.getElementById(id);

async function nominatim(path) {
  const response = await fetch(`${apiBaseUrl}/nominatim/${path}`);
  if (!response.ok) throw new Error(`Nominatim returned ${response.status}`);
  return response.json();
}

/** Flies to what the search bar names, or says it was not found. */
async function search(stackMap) {
  const query = byId('location-search-bar').value;
  if (query.length === 0) return;
  try {
    const result = await nominatim(`search?q=${encodeURIComponent(query)}&format=geojson`);
    const [longitude, latitude] = result.features[0].geometry.coordinates;
    stackMap.flyTo(latitude, longitude, searchZoom);
  } catch (error) {
    alert(`I'm sorry, unfortunately we were unable to find ${query}`);
  }
}

/** Puts the street address of [latitude, longitude] in the search bar. */
async function fillSearchWithAddress(latitude, longitude) {
  try {
    const result = await nominatim(`reverse?format=geojson&lat=${latitude}&lon=${longitude}`);
    const { address, name } = result.features[0].properties;
    let street;
    if (address.house_number === undefined) {
      street = address.road !== undefined ? address.road : name;
    } else {
      street = `${address.house_number} ${address.road}`;
    }
    byId('location-search-bar').value = [street, address.city, address.state, address.postcode]
      .filter((part) => part !== undefined)
      .join(' ');
  } catch (error) {
    // The address is a convenience; the map has already moved.
  }
}

/** Wires the Webflow map buttons and search bar to [stackMap]. */
export function wireControls(stackMap, maplibregl) {
  const { map } = stackMap;
  byId('zoom-in').addEventListener('click', () => map.zoomIn());
  byId('zoom-out').addEventListener('click', () => map.zoomOut());

  let locationMarker = null;
  byId('my-location').addEventListener('click', () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!locationMarker) {
          const icon = document.createElement('img');
          icon.src = myLocationIconUrl;
          icon.alt = 'Your location';
          icon.width = 30;
          icon.height = 30;
          locationMarker = new maplibregl.Marker({ element: icon, anchor: 'bottom' });
        }
        locationMarker.setLngLat([longitude, latitude]).addTo(map);
        stackMap.flyTo(latitude, longitude);
        fillSearchWithAddress(latitude, longitude);
      },
      () => console.log('Error getting location.'),
      locationOptions,
    );
  });

  byId('location-search-bar').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      search(stackMap);
    }
  });
  byId('find-firewood-button').addEventListener('click', () => search(stackMap));
}
