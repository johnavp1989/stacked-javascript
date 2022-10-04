// Geocode address in search bar on enter key press
document.getElementById("location-search-bar")
    .addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        //Don't submit form on enter key
        event.preventDefault()
        lookupLocation()
    }
})

// Geocode address in search bar on Find Firewood button press
document.getElementById("find-firewood-button")
    .addEventListener("click", function() {
        lookupLocation()
    }
)

function lookupLocation() {
  function geocode() {
    return new Promise(function (resolve, reject) {
      var Httpreq = new XMLHttpRequest()
      Httpreq.open("GET",geocodeUrl,false)
      Httpreq.onload = resolve
      Httpreq.onerror = reject
      Httpreq.send()
  })}

  var locationSearchBar = document.getElementById('location-search-bar')
  var locationSearchBarValue = document.getElementById('location-search-bar').value
  if (locationSearchBarValue.length !== 0) {
    var geocodeUrl = "https://" + apiHost + "/nominatim/search?q=" + locationSearchBarValue + "&format=geojson"
 } else {
    return
  }

  geocode()
    .then(function (e) {
       var geoResponse = JSON.parse(e.target.response)
       var lon = geoResponse.features[0].geometry.coordinates[0]
       var lat = geoResponse.features[0].geometry.coordinates[1]
       map.flyTo([lat, lon], 15)
     }).catch(function (e) {
       alert("I'm sorry, unfortunately we were unable to find " + locationSearchBarValue)
     })
}

function lookupLocation() {
  function geocode() {
    return new Promise(function (resolve, reject) {
      var Httpreq = new XMLHttpRequest()
      Httpreq.open("GET",geocodeUrl,true)
      Httpreq.onload = resolve
      Httpreq.onerror = reject
      Httpreq.send()
  })}

  var locationSearchBar = document.getElementById('location-search-bar')
  var locationSearchBarValue = document.getElementById('location-search-bar').value
  if (locationSearchBarValue.length !== 0) {
    var geocodeUrl = "https://" + apiHost + "/nominatim/search?q=" + locationSearchBarValue + "&format=geojson"
 } else {
    return
  }

  geocode()
    .then(function (e) {
       var geoResponse = JSON.parse(e.target.response)
       var lon = geoResponse.features[0].geometry.coordinates[0]
       var lat = geoResponse.features[0].geometry.coordinates[1]
       map.flyTo([lat, lon], 15)
     }).catch(function (e) {
       alert("I'm sorry, unfortunately we were unable to find " + locationSearchBarValue)
     })
}

function lookupLocationReverse(location) {
  function reverseGeocode() {
    return new Promise(function (resolve, reject) {
      var Httpreq = new XMLHttpRequest()
      Httpreq.open("GET",geocodeUrl,true)
      Httpreq.onload = resolve
      Httpreq.onerror = reject
      Httpreq.send()
  })}
  let geocodeUrl = "https://" + apiHost + "/nominatim/reverse?&format=geojson&lat=" + location.latitude +  "&lon=" + location.longitude
  reverseGeocode()
    .then(function (e) {
      let geoResponse = JSON.parse(e.target.response)
      let address = geoResponse.features[0]['properties']['address']
      let name = geoResponse.features[0]['properties']['name']
      // Populate search field with address
      if ((typeof address.house_number == 'undefined') && (typeof address.road !== 'undefined')) {
        var streetAddress = address.road
      } else if ((typeof address.house_number == 'undefined') && (typeof address.road == 'undefined')) {
        var streetAddress = name
      } else {
        var streetAddress = address.house_number + ' ' + address.road
      }
      locationSearchBar = document.getElementById('location-search-bar')
      locationSearchBar.value = streetAddress + ' ' + address.city + ' ' + address.state + ' ' + address.postcode
    }, function (e) {
    // handle errors
    })
}
