var map
var userLoc
var hashParameterStackId
const initialZoomMobile = 3
const initialZoomSmallTablet = 4
const initialZoomTablet = 4
const initialZoomDesktop = 5
const initialZoomLargeDesktop = 5
const maxZoom = 19
const zoomLoadThreshold = 0 // The zoom level at which markers will be populated
const flyToZoom = 13
const dragDistanceThreshold = 300 // In meters
var userLocationMarker
const isMobile = window.matchMedia("only screen and (max-width: 480px)").matches
const isSmallTablet = window.matchMedia("only screen and (min-width: 481px) and (max-width: 767px)").matches
const isTablet = window.matchMedia("only screen and (min-width: 768px) and (max-width: 1024px)").matches
const isDesktop = window.matchMedia("only screen and (min-width: 1025px) and (max-width: 1280px)").matches
const isLargeDesktop = window.matchMedia("only screen and (min-width: 1281px)").matches

if (isMobile) {
  initialZoom = initialZoomMobile
} else if (isSmallTablet) {
  initialZoom = initialSmallTablet
} else if (isTablet) {
  initialZoom = initialZoomTablet
} else if (isDesktop) {
  initialZoom = initialZoomDesktop
} else if (isLargeDesktop) {
  initialZoom = initialZoomLargeDesktop
} else {
  initialZoom = initialZoomDesktop
}

// Define user locationIcon
var userLocationIcon = L.icon({
  iconUrl: 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/6187ed619f8c8d474e7c99b6_MyLocD%404x.png',
  iconSize:     [30, 30], // size of the icon
  iconAnchor:   [15, 30], // point of the icon which will correspond to marker's location
})

function getMarkers(marker) {
  return marker.stack_id == hashParameterStackId
}

// Attempt to click on the marker associated with the stack ID provided in the URL hash parameter
// If the marker can't be found wait and try again, it most likely hasn't loaded yet
function clickOnMarker(){
  if (typeof markers != "undefined") {
    let foundMarker = markers.find(getMarkers)
    if (typeof foundMarker != "undefined") {
      foundMarker.fire('click')
    } else {
      setTimeout(clickOnMarker, 250)
    }
  } else {
    setTimeout(clickOnMarker, 250)
  }
}

function getUrlHashParameter() {
  if(window.location.hash) {
    hashParameterValues = window.location.hash.substring(1).split(",")
    hashParameterStackId = hashParameterValues[0]
    hashParameterCoordinates = { latitude: hashParameterValues[1],
                                 longitude: hashParameterValues[2]
    }
    moveMap(hashParameterCoordinates)
    setTimeout(clickOnMarker, 250)

  } else {
    console.log("No hash parameter found")
  }
}

// Disable default zoom controls
map = L.map('map', {zoomControl: false})

// On map load check for URL hash parameter with selected stack details
map.on('load', getUrlHashParameter)
map.setView([37.751, -97.822], initialZoom)
window.onhashchange = function() {
  getUrlHashParameter()
}

function initialize() {
  let accessToken = 'pk.eyJ1Ijoiam9obmF2cDE5ODkiLCJhIjoiY2twcGdmaWowMDJ5ZjJ1bzNxOTJpZWdocSJ9.2qtEaSUb2KylL0EDdTIqFg'
  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9obmF2cDE5ODkiLCJhIjoiY2twcGdmaWowMDJ5ZjJ1bzNxOTJpZWdocSJ9.2qtEaSUb2KylL0EDdTIqFg', {
    maxZoom: maxZoom,
    tileSize: 512,
    zoomOffset: -1,
    attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">MapBox </a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a><strong><a href="https://www.mapbox.com/map-feedback/#/-74.5/40/10" target="_blank"> Improve this map</a></strong>'
  }).addTo(map);
  let distanceFromCenter = getDistanceFromCenter()
  let center = map.getCenter()
  let url = "https://" + apiHost + "/stacks?latitude="+ center.lat + "&longitude=" + center.lng + "&distance=" + distanceFromCenter
  codeAddresses(url)
}

function getDistanceFromCenter() {
  let bounds = map.getBounds()
  let viewableMeters = map.distance(bounds._northEast, bounds._southWest)
  let viewableMiles = (viewableMeters *  0.000621)
  let maxDistanceFromCenter = viewableMiles/2
  return maxDistanceFromCenter
}

map.on('zoomend', function(e) {
  // If zoom level is > zoomLoadThreshold populate markers
  let zoomLevel = map.getZoom()
  if (zoomLevel > zoomLoadThreshold) {
    let distanceFromCenter = getDistanceFromCenter()
    let center = map.getCenter()
    let url = "https://" + apiHost + "/stacks?latitude="+ center.lat + "&longitude=" + center.lng + "&distance=" + distanceFromCenter
    codeAddresses(url)
  } else {
    return
  }
})

function codeOnDistance() {
    let distanceFromCenter = getDistanceFromCenter()
    let center = map.getCenter()
    let url = "https://" + apiHost + "/stacks?latitude="+ center.lat + "&longitude=" + center.lng + "&distance=" + distanceFromCenter
    codeAddresses(url)
}

map.on('dragend', function(event) {
  let dragDistance = event.distance
  let zoomLevel = map.getZoom()
  if (dragDistance >= dragDistanceThreshold && zoomLevel > zoomLoadThreshold) {
    codeOnDistance()
  } else {
    return
  }
})

var locOptions = {
    enableHighAccuracy: false,
    timeout: 3000,
    maximumAge: 0
}

function getLocation() {
  // Remove userLocationMarker if it's already present
  if (userLocationMarker) {
    map.removeLayer(userLocationMarker)
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(locSuccess, locError, locOptions)
  } else {
    console.log("Geolocation is not supported by this browser. Using default.")
    userLoc = { latitude: 39.9526,
                longitude: -75.1652
    }
  }
}

function locSuccess(position) {
  userLoc = { latitude: position.coords.latitude,
              longitude: position.coords.longitude
  }
  lookupLocationReverse(userLoc)
  moveMap(userLoc)
  createLocationMarker(userLoc)
}

function locError(position) {
  console.log("Error getting location. Using default.")
  userLoc = { latitude: 39.9526,
              longitude: -75.1652
  }
}

function createLocationMarker(location) {
  userLocationMarker = L.marker([location.latitude, location.longitude], {icon: userLocationIcon}).addTo(map)
}

function moveMap(location) {
  if (location !== undefined) {
    let lat = location.latitude
    let lng = location.longitude
    let currentZoom = map.getZoom()
    if (currentZoom > flyToZoom) {
      map.flyTo([lat, lng], currentZoom)
    } else {
      map.flyTo([lat, lng], flyToZoom)
    }
  }
}

// zoom in function
$('#zoom-in').click(function(){
  map.setZoom(map.getZoom() + 1)
})

// zoom out function
$('#zoom-out').click(function(){
  map.setZoom(map.getZoom() - 1)
})

document.getElementById('my-location').onclick = function () {
    getLocation()
}
