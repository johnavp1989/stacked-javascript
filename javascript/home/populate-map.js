var markers = []
var markerIconSize =  [35, 35] // size of the icon
var markerIconAnchor =  [15, 30] // point of the icon which will correspond to marker's location
var markerIconUrl = "https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/62a905154a38e153aeee8c22_Stacked-Icons_Pin-V2-Inactive.svg"

// Define marker icon
var markerIcon = L.icon({
  iconUrl: markerIconUrl,
  iconSize:     markerIconSize,
  iconAnchor:   markerIconAnchor,
})

var collectionObj
function codeAddresses(url, offset=0, currentCount=0) {
  fetch(url).then(function(response) {
    return response.json()
  }).then(function(data) {
    currentCount += data.count
    if (currentCount < data.total) {
      collectionObj = data
      for (i = 0; i < collectionObj.count; i++) {
        makeMap(i)
      }
      offset += 100
      // Reconstruct URL, stripping existing offset (urlParams[3]) if present
      let urlParts = url.split('?')
      let urlParams = urlParts[1].split('&')
      let newUrl = urlParts[0] + "?" + urlParams[0] + "&" +  urlParams[1] + "&" + urlParams[2] + "&offset=" + offset
      codeAddresses(newUrl, offset, currentCount)
    } else {
      collectionObj = data

      for (i = 0; i < collectionObj.count; i++) {
        makeMap(i)
      }

    }
  }).catch((error) => {
    console.log("Error retrieving stacks. API call failed.")
    console.error(error)
  })

}

/*
Generate marker pop-up HTML and disable pop-up on click
The pop-up will store stack details that we'll reference
and display elsewhere
*/
function makeMap(i){
  // Check for data in response and set variables
  if (collectionObj.items[i]['mainImage']) {
    stackImageUrl = collectionObj.items[i]['mainImage']
  } else {
    stackImageUrl = "https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/617dd5304c16324d0c1c7b04_no-image-placeholders_Photo-small.jpg"
  }
  if (!collectionObj.items[i]['stackID']) {
      stackID = ''
  } else {
      stackID = collectionObj.items[i]['stackID']
  }
  if (!collectionObj.items[i]['slug']) {
      stackSlug = ''
  } else {
      stackSlug = collectionObj.items[i]['slug']
  }
  if (!collectionObj.items[i]['latitude']) {
      stackLatitude = ''
  } else {
      stackLatitude = collectionObj.items[i]['latitude']
  }
  if (!collectionObj.items[i]['longitude']) {
      stackLongitude = ''
  } else {
      stackLongitude = collectionObj.items[i]['longitude']
  }
  if (!collectionObj.items[i]['arrangement']) {
      stackArrangement = "I Don't Know"
  } else {
      stackArrangement = collectionObj.items[i]['arrangement']
  }
  if (!collectionObj.items[i]['establishmentType']) {
      stackEstablishmentType = "Other"
  } else {
      stackEstablishmentType = collectionObj.items[i]['establishmentType']
  }
  if (!collectionObj.items[i]['kindling']) {
      stackKindling = 'Unknown'
  } else {
      stackKindling = collectionObj.items[i]['kindling']
  }
  if (!collectionObj.items[i]['storage']) {
      stackStorage = 'Unknown'
  } else {
       stackStorage = collectionObj.items[i]['storage']
  }
  if (!collectionObj.items[i]['street']) {
      stackStreet = ''
  } else {
      stackStreet = collectionObj.items[i]['street']
  }
  if (!collectionObj.items[i]['city']) {
      stackCity = ''
  } else {
      stackCity = collectionObj.items[i]['city']
  }
  if (!collectionObj.items[i]['state']) {
      stackState = ''
  } else {
      stackState = collectionObj.items[i]['state']
  }
  if (!collectionObj.items[i]['zip']) {
      stackZip = ''
  } else {
      stackZip = collectionObj.items[i]['zip']
  }
  if (!collectionObj.items[i]['userGivenName']) {
      stackUserGivenName = ''
  } else {
      stackUserGivenName = collectionObj.items[i]['userGivenName']
  }
  if (!collectionObj.items[i]['description']) {
      stackDescription = 'Be the first to add a description by verifying this location.'
  } else {
      stackDescription = collectionObj.items[i]['description']
  }
  if (!collectionObj.items[i]['verified']) {
      stackVerified = 'Unknown'
  } else {
      stackVerified = collectionObj.items[i]['verified']
  }
  if (!collectionObj.items[i]['verifiedOn']) {
      stackVerifiedOn = 'Unknown'
  } else {
      stackVerifiedOn = collectionObj.items[i]['verifiedOn']
  }
  if (!collectionObj.items[i]['username']) {
      stackUsername = 'Unknown'
  } else {
      stackUsername = collectionObj.items[i]['username']
  }

  var popUpHtml = '<p id="stackID">' + stackID + '</p>' +
  '<p id="stackSlug">' + stackSlug + '</p>' +
  '<p id="stackLatitude">' + stackLatitude + '</p>' +
  '<p id="stackLongitude">' + stackLongitude + '</p>' +
  '<p id="stackArrangement">' + stackArrangement + '</p>' +
  '<p id="stackEstablishmentType">' + stackEstablishmentType + '</p>' +
  '<p id="stackKindling">' + stackKindling + '</p>' +
  '<p id="stackStorage">' + stackStorage + '</p>' +
  '<p id="stackStreet">' + stackStreet + '</p>' +
  '<p id="stackCity">' + stackCity + '</p>' +
  '<p id="stackState">' + stackState + '</p>' +
  '<p id="stackZip">' + stackZip + '</p>' +
  '<p id="stackImageUrl">' + stackImageUrl + '</p>' +
  '<p id="stackUserGivenName">' + stackUserGivenName + '</p>' +
  '<p id="stackDescription">' + stackDescription + '</p>' +
  '<p id="stackVerified">' + stackVerified + '</p>' +
  '<p id="stackVerifiedOn">' + stackVerifiedOn + '</p>' +
  '<p id="stackUsername">' + stackUsername + '</p>'

  function findMarker(marker) {
    return marker.stack_id == stackID
  }

  if (typeof markers != "undefined") {
    let foundMarker = markers.find(findMarker)
    if (typeof foundMarker == "undefined") {
      var marker = L.marker([stackLatitude, stackLongitude], {icon: markerIcon}).addTo(map)
      // Generate marker popup
      marker.bindPopup(popUpHtml)
      // Disable popup on click
      marker.off('click')
      // On marker click display details in map details div
      marker.on('click', onMarkerClick)
      // Give marker an ID
      marker.stack_id = stackID
      // Add marker to array
      markers.push(marker)
    }
  }
}
