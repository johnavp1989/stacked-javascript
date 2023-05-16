<style>
.map-details-animation-wrapper-slide {
  height: auto;
  opacity: 100%;
}
</style>

<script>
var lastSelectedMarker
var selectedMarkerIconSize =  [35, 35] // size of the icon
var selectedMarkerIconAnchor =  [15, 30] // point of the icon which will correspond to marker's location
var selectedMarkerIconUrl = "https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/62a7debe33ce1b542fd5a6eb_Stacked-Icons_Pin-V2-Active-3.svg"

// Define selected marker icon
var selectedMarkerIcon = L.icon({
  iconUrl: selectedMarkerIconUrl,
  iconSize: selectedMarkerIconSize,
  iconAnchor: selectedMarkerIconAnchor,
})

function closeDetailsCardOnMarkerClick(e) {
  // Close details card on marker click (if human)
  let hasClass = document.getElementById("map-details-animation-wrapper").classList.contains('map-details-animation-wrapper-slide');
  if (hasClass === true)
  {
    // Check if click is human
    if (e.originalEvent?.isTrusted) {
      document.getElementById("map-details-animation-wrapper").classList.remove("map-details-animation-wrapper-slide")
    }
  } else {
    document.getElementById("map-details-animation-wrapper").classList.add("map-details-animation-wrapper-slide")
  }
}
</script>
