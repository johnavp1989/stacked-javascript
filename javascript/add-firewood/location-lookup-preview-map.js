<style>
#stack-image-preview2-map {
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
    height: 100%;
    width: 100%;
    display: block;
    margin-left: 10px;
    margin-right: auto;
</style>
<script>
var map
var mapZoom = 17
var marker
var stackLocationIcon = L.icon({
  iconUrl: 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/6146263c4fdf0b0feaf61866_Pin.svg',
  iconSize:     [30, 30], // size of the icon
  iconAnchor:   [15, 30], // point of the icon which will correspond to marker's location
})
var moveendEvent = false

function createPreviewMap(lat, lon) {
  // Create map if it's not already there, otherwise just update it
  if (typeof map == 'undefined') {
    map = L.map('preview-map', {zoomControl: false})
    map.setView([lat, lon], mapZoom)
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9obmF2cDE5ODkiLCJhIjoiY2twcGdmaWowMDJ5ZjJ1bzNxOTJpZWdocSJ9.2qtEaSUb2KylL0EDdTIqFg', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">MapBox </a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a><strong><a href="https://www.mapbox.com/map-feedback/#/-74.5/40/10" target="_blank"> Improve this map</a></strong>'
    }).addTo(map)
    marker = L.marker([lat,lon], {icon: stackLocationIcon}).addTo(map)

    // Keep marker centered on map move
    map.on("move", function () {
      marker.setLatLng(map.getCenter())
    })
    // Update latitude and logitude fields when user stops moving map
    map.on("moveend", function () {
      markerLocation = marker.getLatLng()
      var stackLat = document.getElementById('latitude')
      var stackLon = document.getElementById('longitude')
      stackLat.value = parseFloat(markerLocation.lat.toFixed(5))
      stackLon.value = parseFloat(markerLocation.lng.toFixed(5))
      // Set flag so we don't update map and marker position
      moveendEvent = true
      lookupLocation('lookup_coordinates')
    })
  } else {
     // Don't update map or marker position on moveend events
    if (!moveendEvent) {
      marker.setLatLng([lat, lon])
      map.setView([lat, lon])
    } else {
      moveendEvent = false
    }
  }
}
</script>
