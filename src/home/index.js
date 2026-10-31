// The stacked.camp home map. Webflow loads this file as /home/map.js; the other
// scripts its page still requests (populate-map.js, marker-click.js, ...) are
// empty, since everything they did is here.
import { copyShareLink, fillCard, hideCard, hideCardOnLoad, stackHash } from './card.js';
import { wireControls } from './controls.js';
import { loadMaplibre } from './load-maplibre.js';
import { StackMap } from './map.js';
import { loadAllStacks } from './stacks.js';

/** The stack id and position a `#<id>,<latitude>,<longitude>` hash names. */
function hashTarget() {
  const [id, latitude, longitude] = window.location.hash.substring(1).split(',');
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  if (!id || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { id, latitude: lat, longitude: lng };
}

function hideCardAndScrollUp() {
  hideCard();
  window.scrollTo(0, 0);
}

function showMapUnavailable() {
  const note = document.createElement('p');
  note.textContent = "Your browser can't show the map. Try another browser, or turn on hardware acceleration.";
  note.style.cssText = 'padding:24px;text-align:center;';
  document.getElementById('map').replaceChildren(note);
}

async function start() {
  hideCardOnLoad();
  document.getElementById('location-search-bar').addEventListener('click', hideCardAndScrollUp);
  document.getElementById('share-this-stack-link').addEventListener('click', copyShareLink);

  // Both downloads start at once: the stacks do not need the map to arrive.
  const stacks = loadAllStacks();
  stacks.catch(() => {}); // Reported below, once the map is up.
  let maplibregl;
  let stackMap;
  try {
    maplibregl = await loadMaplibre();
    stackMap = new StackMap(maplibregl, {
      onSelect: (stack) => {
        fillCard(stack);
        const hash = stackHash(stack);
        if (window.location.hash.substring(1) !== hash) window.location.hash = hash;
      },
      onBackgroundTap: hideCardAndScrollUp,
    });
  } catch (error) {
    console.error('The map could not start', error);
    showMapUnavailable();
    return;
  }
  wireControls(stackMap, maplibregl);

  const stacksShown = stacks
    .then((list) => stackMap.setStacks(list))
    .catch((error) => console.error('Error retrieving stacks.', error));

  // A hash names a stack (from its card's share link, or a stack's own page):
  // fly there, and open it once the stacks are in.
  const followHash = async () => {
    const target = hashTarget();
    if (!target) return;
    stackMap.flyTo(target.latitude, target.longitude);
    await stacksShown;
    const stack = stackMap.stack(target.id);
    if (stack && stackMap.selectedId !== String(stack.stackID)) stackMap.select(stack);
  };
  window.addEventListener('hashchange', followHash);
  followHash();
}

start();
