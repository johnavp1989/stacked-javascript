import { apiBaseUrl } from './config.js';

const pageSize = 100;
// A safety cap in case the API's total is ever wrong.
const maxPages = 50;
const parallelPages = 3;

async function fetchPage(offset) {
  const response = await fetch(`${apiBaseUrl}/stacks?limit=${pageSize}&offset=${offset}`);
  if (!response.ok) throw new Error(`GET /stacks returned ${response.status}`);
  return response.json();
}

/**
 * Every stack, fetched a page at a time (the first page says how many there
 * are), with coordinates parsed: the API sends latitude and longitude as
 * strings. Stacks without coordinates are left out.
 */
export async function loadAllStacks() {
  const first = await fetchPage(0);
  const pages = Math.min(Math.ceil(first.total / pageSize), maxPages);
  const offsets = [];
  for (let page = 1; page < pages; page++) offsets.push(page * pageSize);

  const items = [...first.items];
  for (let i = 0; i < offsets.length; i += parallelPages) {
    const batch = await Promise.all(offsets.slice(i, i + parallelPages).map(fetchPage));
    for (const page of batch) items.push(...page.items);
  }

  const stacks = [];
  for (const item of items) {
    const latitude = parseFloat(item.latitude);
    const longitude = parseFloat(item.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;
    stacks.push({ ...item, latitude, longitude });
  }
  return stacks;
}

export function stacksGeoJson(stacks) {
  return {
    type: 'FeatureCollection',
    features: stacks.map((stack) => pointFeature(stack)),
  };
}

export function pointFeature(stack) {
  return {
    type: 'Feature',
    properties: { id: String(stack.stackID) },
    geometry: { type: 'Point', coordinates: [stack.longitude, stack.latitude] },
  };
}
