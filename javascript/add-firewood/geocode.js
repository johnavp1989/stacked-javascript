function lookupLocation(task) {
  function geocode() {
    return new Promise(function (resolve, reject) {
      var Httpreq = new XMLHttpRequest()
      Httpreq.open("GET",geocodeUrl,false)
      Httpreq.onload = resolve
      Httpreq.onerror = reject
      Httpreq.send()
  })}

  var addressQuery = document.getElementById('address-query')
  var addressQueryValue = document.getElementById('address-query').value
  var cityQueryValue = document.getElementById('city-query').value
  var zipQueryValue = document.getElementById('zip-query').value
  var stackStreetValue = document.getElementById('stack-street').value
  var stackZipValue = document.getElementById('stack-zip').value
  var latValue = document.getElementById('latitude').value
  var lonValue = document.getElementById('longitude').value
  if (task == 'modify_address') {
    var geocodeUrl = "https://" + apiHost + "/nominatim/search?street=" + stackStreetValue + "&postalcode=" + stackZipValue + "&format=geojson"
    var type = 'query'
  } else if (task == 'submit_address') {
    var geocodeUrl = "https://" + apiHost + "/nominatim/search?street=" + addressQueryValue + "&city=" + cityQueryValue + "&postalcode=" + zipQueryValue + "&format=geojson"
    var type = 'query'
  } else if (task == 'submit_address_no_city') {
    var geocodeUrl = "https://" + apiHost + "/nominatim/search?street=" + addressQueryValue + "&postalcode=" + zipQueryValue + "&format=geojson"
    var type = 'query'
  } else if (task == 'lookup_coordinates') {
    if ((latValue.length !== 0) && (lonValue.length !== 0)) {
      var geocodeUrl = "https://" + apiHost + "/nominatim/reverse?&format=geojson&lat=" + latValue +  "&lon=" + lonValue
      var type = 'coordinates'
    }
  }

  geocode()
    .then(function (e) {
       var geoResponse = JSON.parse(e.target.response)
       // Check if response contains a result
       if (typeof geoResponse.features[0] === 'undefined') {
         // If our lookup failed try a simpler lookup without the city
         if (task == 'submit_address') {
           lookupLocation('submit_address_no_city')
           return
         }
       }
       var lon = geoResponse.features[0].geometry.coordinates[0]
       var lat = geoResponse.features[0].geometry.coordinates[1]
       if (type === 'query') {
         geocodeUrl = "https://" + apiHost + "/nominatim/reverse?&format=geojson&lat=" + lat +  "&lon=" + lon
         geocode()
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
              var zipQuery = document.getElementById('zip-query')
              var name = geoResponse.features[0]['properties']['name']
              addressStatus.innerText = "We've populated some details based on the search query you provided. Feel free to make corrections."
              if ((typeof address.house_number == 'undefined') && (typeof address.road !== 'undefined')) {
                stackStreet.value = address.road
              } else if ((typeof address.house_number == 'undefined') && (typeof address.road == 'undefined')) {
                stackStreet.value = name
              } else {
                stackStreet.value = address.house_number + ' ' + address.road
              }
              createPreviewMap(lat, lon)
              // Limit coordinates to 5 decimal places
              stackLat.value = parseFloat(lat.toFixed(5))
              stackLon.value = parseFloat(lon.toFixed(5))
              stackCity.value = address.city
              stackState.value = address.state
              // Nominatim may return zip+4, strip the +4 to avoid API validaiton failures
              stackZip.value = address.postcode.split('-')[0]
              addressStatus.style.display = 'flex'
              addressDiv.style.display = 'flex'
            }, function (e) {
            // handle errors
            })
       } else {
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
         var zipQuery = document.getElementById('zip-query')
         var name = geoResponse.features[0]['properties']['name']
         //addressStatus.innerText = "We've populated some details based on coordinates you provided! Feel free to make corrections."
         if ((typeof address.house_number == 'undefined') && (typeof address.road !== 'undefined')) {
           stackStreet.value = address.road
         } else if ((typeof address.house_number == 'undefined') && (typeof address.road == 'undefined')) {
           stackStreet.value = name
         } else {
           stackStreet.value = address.house_number + ' ' + address.road
         }
         createPreviewMap(lat, lon)
         /*
         Ideally Nominatim would return a city for every address but this is not always the case
         If city is not defined we will fall back to alternatives in a somewhat arbitary order
         */
         if (typeof address.city != 'undefined') {
           stackCity.value = address.city
         } else if (typeof address.town != 'undefined') {
           stackCity.value = address.town
         } else if (typeof address.village != 'undefined') {
           stackCity.value = address.village
         } else if (typeof address.borough != 'undefined') {
           stackCity.value = address.borough
         } else if (typeof address.suburb != 'undefined') {
           stackCity.value = address.suburb
         } else if (typeof address.hamlet != 'undefined') {
           stackCity.value = address.hamlet
         } else if (typeof address.county != 'undefined') {
           stackCity.value = address.county
         }
         stackState.value = address.state
         // Nominatim may return zip+4, strip the +4 to avoid API validaiton failures
         stackZip.value = address.postcode.split('-')[0]
         addressStatus.style.display = 'flex'
         addressDiv.style.display = 'flex'
       }
    }, function (e) {
     // handle errors
    })
}
