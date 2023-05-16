$( document ).ready(function() {
  document.getElementById('my-location').onclick = function () {
    getLocation()
  }
  document.getElementById('my-location-2').onclick = function () {
    getLocation()
  }
  document.getElementById('stack-street').onchange = function () {
    lookupLocation('modify_address')
  }
  document.getElementById('address-query').onchange = function () {
    if (document.getElementById('zip-query').value.length != 0) {
      lookupLocation('submit_address')
    }
  }
  document.getElementById('city-query').onchange = function () {
    if (document.getElementById('address-query').value.length != 0 && document.getElementById('address-query').length != 0) {
      lookupLocation('submit_address')
    }
  }
  document.getElementById('zip-query').onchange = function () {
    if (document.getElementById('address-query').value.length != 0) {
      lookupLocation('submit_address')
    }
  }
  document.getElementById('stack-zip').onchange = function () {
    lookupLocation('modify_address')
  }
  document.getElementById('latitude').onchange = function () {
    lookupLocation('lookup_coordinates')
  }
  document.getElementById('longitude').onchange = function () {
    lookupLocation('lookup_coordinates')
  }
})
