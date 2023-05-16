document.addEventListener('DOMContentLoaded', (event) => {
  /*
  Loop through each location, retrive latitude and longitude
  and build hyperlink to location on map
  */
  stateItems = document.getElementsByClassName('by-state-item')
  for(var i = 0; i < stateItems.length; i++){
    let latitude = stateItems[i].querySelector("#latitude").innerHTML
    let longitude = stateItems[i].querySelector("#longitude").innerHTML
    stateItems[i].addEventListener('click', function() {
      location.href = 'https://www.stacked.camp/#0,' + latitude + ',' + longitude
    }, false);
  }
})
