// The stack details card is built in Webflow (#map-details-animation-wrapper);
// this fills it in. Text that comes from the API is set with textContent, never
// as HTML.

const noImageUrl = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/617dd5304c16324d0c1c7b04_no-image-placeholders_Photo-small.jpg';
const noDescription = 'Be the first to add a description by verifying this location.';

const byId = (id) => document.getElementById(id);
const cardWrapper = () => byId('map-details-animation-wrapper');

export function showCard() {
  cardWrapper().style.visibility = 'visible';
}

export function hideCard() {
  cardWrapper().style.visibility = 'hidden';
}

/** Hidden until a stack is picked; the card is laid out visible in Webflow. */
export function hideCardOnLoad() {
  hideCard();
  cardWrapper().style.opacity = '1';
}

/** What a hash naming [stack] looks like: `#<id>,<latitude>,<longitude>`. */
export function stackHash(stack) {
  return `${stack.stackID},${stack.latitude},${stack.longitude}`;
}

const establishmentIcons = {
  'Mom & Pop': ['establishment-mom-pop'],
  'Gas Station/Convenience': ['establishment-gas-station-convenience'],
  'Big Box Store': ['establishment-big-box-store'],
  'Park Office': ['establishment-park-office'],
  'Hardware Store': ['establishment-hardware'],
  'Grocery Store': ['establishment-grocery-store'],
  'Camp Host': ['establishment-camp-host'],
  Other: ['establishment-other'],
};
const arrangementIcons = { Loose: ['arrangement-loose'], Packaged: ['arrangement-bundled'] };
const storageIcons = { Indoors: ['storage-indoors'], Outdoors: ['storage-outdoors'], Covered: ['storage-covered'] };
const kindlingIcons = {
  Kindling: ['kindling'],
  'Fire Starters': ['fire-starters'],
  'Kindling & Fire Starters': ['fire-starters', 'kindling'],
};

function setLink(childId, href) {
  const link = byId(childId)?.parentElement;
  if (link) link.href = href;
}

/** Fills the card with [stack] and shows it. */
export function fillCard(stack) {
  const name = stack.userGivenName || '';
  const city = stack.city || '';
  const state = stack.state || '';
  const zip = stack.zip || '';

  for (const icon of document.getElementsByClassName('stack-detail-icon-groups')) {
    icon.style.display = 'none';
  }

  byId('stack-name').textContent = name;
  byId('stack-description').textContent = stack.description || noDescription;

  for (const id of ['stack-id-verify', 'stack-id-report-issue']) {
    byId(id).value = stack.stackID;
    byId(id).readOnly = true;
  }

  const shareUrl = `${window.location.origin}${window.location.pathname}#${stackHash(stack)}`;
  byId('share-this-stack-link').textContent = `Check out this firewood location in ${state} on Stacked! ${shareUrl}`;

  byId('stack-image').style.backgroundImage = `url(${JSON.stringify(stack.mainImage || noImageUrl)})`;

  const address = byId('stack-address');
  address.replaceChildren(
    stack.street || `${stack.latitude}, ${stack.longitude}`,
    document.createElement('br'),
    `${city} ${state} ${zip}`,
  );
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${stack.latitude}%2C${stack.longitude}`;
  setLink('stack-address-icon', directionsUrl);
  setLink('get-directions-icon', directionsUrl);
  setLink('get-directions-option-text', directionsUrl);
  setLink('stack-details-option-text', `https://www.stacked.camp/stack/${stack.slug || ''}`);

  showFireBanTag(state);

  const verifiedTag = byId('verified-tag');
  const verifiedText = byId('verified-text');
  verifiedTag.style.display = 'none';
  verifiedText.style.display = 'none';
  if (String(stack.verified) === '1' || stack.verified === true) {
    const date = new Date(stack.verifiedOn).toLocaleDateString('en-us', {
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
    });
    verifiedText.textContent = `Last Verified on ${date}`;
    verifiedTag.style.display = 'flex';
    verifiedText.style.display = 'flex';
  }

  const icons = [
    ...(arrangementIcons[stack.arrangement] || []),
    ...(storageIcons[stack.storage] || []),
    ...(kindlingIcons[stack.kindling] || []),
    ...(establishmentIcons[stack.establishmentType || 'Other'] || []),
  ];
  for (const id of icons) {
    const icon = byId(id);
    if (icon) icon.style.display = 'flex';
  }

  showCard();
}

/**
 * The state-level fire ban tag and the fire info link, from the Webflow CMS
 * state items on the page (.v2-statefireitem).
 */
function showFireBanTag(state) {
  const tag = byId('active-fire-ban-tag');
  if (tag) tag.style.display = 'none';
  for (const item of document.getElementsByClassName('v2-statefireitem')) {
    const field = (className) => [...item.children].find((child) => child.className === className);
    if (field('v2-statefirestatename')?.innerHTML !== state) continue;
    const infoPage = field('v2-statefireinfopage')?.innerHTML;
    if (infoPage) setLink('fire-restriction-info-option-text', infoPage);
    if (field('v2-statefirewarninglevel')?.innerHTML === 'Restricted') {
      if (tag) tag.style.display = 'flex';
      if (infoPage) setLink('fire-ban-tag-text', infoPage);
    }
  }
}

/** Copies the share link, then says so for two seconds. */
export function copyShareLink() {
  const link = byId('share-this-stack-link');
  const range = document.createRange();
  range.selectNode(link);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link.textContent);
  } else {
    document.execCommand('copy');
  }
  window.getSelection().removeAllRanges();

  const label = byId('click-to-copy-text');
  const original = label.innerHTML;
  const confirmation = 'Copied to clipboard';
  label.textContent = confirmation;
  if (original !== confirmation) setTimeout(() => { label.innerHTML = original; }, 2000);
}
