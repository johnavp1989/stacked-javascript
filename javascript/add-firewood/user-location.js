var locOptions = {
    enableHighAccuracy: false,
    timeout: 3000,
    maximumAge: 0
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locSuccess, locError, locOptions)
    } else {
        console.log("Geolocation is not supported by this browser. Using default.")
        userLoc = { locLat: 39.9526,
                    locLong: -75.1652
        }
    }
}

function locError(position) {
    alert("Unable to retrieve location. You may need to enable location services in your systems settings.")
}

function locSuccess(position) {
    userLoc = { locLat: position.coords.latitude,
                locLong: position.coords.longitude
    }
    function reverseGeocode() {
      return new Promise(function (resolve, reject) {
        var Httpreq = new XMLHttpRequest()
        Httpreq.open("GET",geocodeUrl,false)
        Httpreq.onload = resolve
        Httpreq.onerror = reject
        Httpreq.send()
    })}
    var geocodeUrl = "https://" + apiHost + "/nominatim/reverse?&format=geojson&lat=" + userLoc.locLat +  "&lon=" + userLoc.locLong
    reverseGeocode()
      .then(function (e) {
         var geoResponse = JSON.parse(e.target.response)
         // Populate address fields for user
         var stackLat = document.getElementById('latitude')
         var stackLon = document.getElementById('longitude')
         var stackStreet = document.getElementById('stack-street')
         var stackCity = document.getElementById('stack-city')
         var stackState = document.getElementById('stack-state')
         var stackZip = document.getElementById('stack-zip')
         var addressStatus = document.getElementById('address-status')
         var addressDiv = document.getElementById('address-div')
         var address = geoResponse.features[0]['properties']['address']
         var addressQuery = document.getElementById('address-query')
         var cityQuery = document.getElementById('city-query')
         var zipQuery = document.getElementById('zip-query')
         var name = geoResponse.features[0]['properties']['name']
         addressStatus.innerText = "We've populated some details based on location data you provided. Feel free to make corrections."
         if ((typeof address.house_number == 'undefined') && (typeof address.road !== 'undefined')) {
           stackStreet.value = address.road
           addressQuery.value = address.road
         } else if ((typeof address.house_number == 'undefined') && (typeof address.road == 'undefined')) {
           stackStreet.value = name
           addressQuery.value = name
         } else {
           stackStreet.value = address.house_number + ' ' + address.road
           addressQuery.value = address.house_number + ' ' + address.road
         }
         createPreviewMap(userLoc.locLat, userLoc.locLong)
         // Limit Coordinates to 5 decimal places
         stackLat.value = parseFloat(userLoc.locLat.toFixed(5))
         stackLon.value = parseFloat(userLoc.locLong.toFixed(5))
         stackCity.value = address.city
         stackState.value = address.state
         // Nominatim may return zip+4, strip the +4 to avoid API validaiton failures
         stackZip.value = address.postcode.split('-')[0]
         cityQuery.value = address.city
         if (typeof address.city != 'undefined') {
           cityQuery.value = address.city
         } else if (typeof address.town != 'undefined') {
           cityQuery.value = address.town
         } else if (typeof address.village != 'undefined') {
           cityQuery.value = address.village
         } else if (typeof address.borough != 'undefined') {
           cityQuery.value = address.borough
         } else if (typeof address.suburb != 'undefined') {
           cityQuery.value = address.suburb
         } else if (typeof address.hamlet != 'undefined') {
           cityQuery.value = address.hamlet
         } else if (typeof address.county != 'undefined') {
           cityQuery.value = address.county
         }
         zipQuery.value = address.postcode
         addressStatus.style.display = 'flex'
         addressDiv.style.display = 'flex'
       }, function (e) {
       // handle errors
       })
}
