Window.onload = hideCardOnLoad()

function hideCardOnLoad() {
  document.getElementById("map-details-animation-wrapper").style.visibility = "hidden"
  document.getElementById("map-details-animation-wrapper").style.opacity = "1"
}

function onMarkerClick(e) {
    // Check for previously selected marker and reset icon
    if (lastSelectedMarker) {
        lastSelectedMarker.setIcon(markerIcon)
    }
    // Change marker of selected icon
    e.target.setIcon(selectedMarkerIcon)
    lastSelectedMarker = e.target

    // Close details card on marker click (if human)
    closeDetailsCardOnMarkerClick(e)

    // Stack details are stored in the HTML of the hidden pop-up so we need to retrieve them
    var popup = e.target.getPopup()
    var content = popup.getContent()

    // Create an HTML element and store popup content there
    var contentDocument = document.createElement('html')
    contentDocument.innerHTML = content

    // Retrieve stack details from HTML element
    let stackID = contentDocument.querySelector('#stackID')
    let stackSlug = contentDocument.querySelector('#stackSlug')
    let stackLatitude = contentDocument.querySelector('#stackLatitude')
    let stackLongitude = contentDocument.querySelector('#stackLongitude')
    let stackArrangement = contentDocument.querySelector('#stackArrangement')
    let stackEstablishmentType = contentDocument.querySelector('#stackEstablishmentType')
    let stackKindling = contentDocument.querySelector('#stackKindling')
    let stackStorage = contentDocument.querySelector('#stackStorage')
    let stackStreet = contentDocument.querySelector('#stackStreet')
    let stackCity = contentDocument.querySelector('#stackCity')
    let stackState = contentDocument.querySelector('#stackState')
    let stackZip = contentDocument.querySelector('#stackZip')
    let stackImageUrl = contentDocument.querySelector('#stackImageUrl')
    let stackUserGivenName = contentDocument.querySelector('#stackUserGivenName')
    let stackDescription = contentDocument.querySelector('#stackDescription')
    let stackDetailIcons = document.getElementsByClassName("stack-detail-icon-groups")
    let stackVerified = contentDocument.querySelector('#stackVerified')
    let stackVerifiedOn = contentDocument.querySelector('#stackVerifiedOn')
    let stackUsername = contentDocument.querySelector('#stackUsername').innerHTML

    // Hide all details on card
    for (let stackDetailIcon of stackDetailIcons) {
      stackDetailIcon.style.display='none'
    }

    // Populate name
    document.getElementById('stack-name').innerHTML = stackUserGivenName.innerHTML

    // Populate description
    document.getElementById('stack-description').innerHTML = stackDescription.innerHTML

    // Populate stack ID on verify and report issue pop-ups
    document.getElementById('stack-id-verify').value = stackID.innerHTML
    document.getElementById('stack-id-verify').readOnly = true
    document.getElementById('stack-id-report-issue').value = stackID.innerHTML
    document.getElementById('stack-id-report-issue').readOnly = true

    // Populate Share This Stack text
    document.getElementById('share-this-stack-link').innerHTML = "Check out this firewood location in " + stackState.innerHTML + " on Stacked! " + window.location.href

    // Populate image
    document.getElementById('stack-image').style.backgroundImage = 'url("'+ stackImageUrl.innerHTML + '")'

    // Populate username
    document.getElementById('username-text').innerHTML = ''
    document.getElementById('username-text').style.display = 'none'
    if (stackUsername != 'Unknown') {
      if (stackUsername == 'constablefont' || stackUsername == 'phillyguy' ) {
        document.getElementById('username-text').innerHTML = 'Added by a Founder'
      } else {
        document.getElementById('username-text').innerHTML = 'Added by ' + stackUsername
      }
      document.getElementById('username-text').style.display = 'block'
    }

    // Populate address
    stackAddressTextBox = document.getElementById("stack-address")
    let directionsURL = 'https://www.google.com/maps/dir/?api=1&destination=' + stackLatitude.innerHTML + '%2C' + stackLongitude.innerHTML
    if (stackStreet.innerHTML) {
      var directionsText = stackStreet.innerHTML + '<br>' + stackCity.innerHTML + ' ' + stackState.innerHTML + ' ' + stackZip.innerHTML
    } else {
      var directionsText = stackLatitude.innerHTML + ', ' + stackLongitude.innerHTML + '<br>' + stackCity.innerHTML + ' ' + stackState.innerHTML + ' ' + stackZip.innerHTML
    }
    stackAddressTextBox.innerHTML = directionsText

    // Add link to address icon/text
    let stackAddressIconParent = document.getElementById("stack-address-icon").parentElement
    stackAddressIconParent.href = directionsURL

    // Add link to Get Directions text/icon
    let getDirectionsTextParent = document.getElementById("get-directions-icon").parentElement
    getDirectionsTextParent.href = directionsURL

    // Add link to Get Directions menu item
    let getDirectionsMenuTextParent = document.getElementById("get-directions-option-text").parentElement
    getDirectionsMenuTextParent.href = directionsURL

    // Add link to Stack Details Page menu item
    let getStackDetailsMenuTextParent = document.getElementById("stack-details-option-text").parentElement
    getStackDetailsMenuTextParent.href = "https://www.stacked.camp/stack/" + stackSlug.innerHTML

    // Add Active Fire Ban tag if ban is present
    let stateFireItems = document.getElementsByClassName("v2-statefireitem")

    // Make sure Fire Ban tag is hidden
    fireBanTag = document.getElementById("active-fire-ban-tag")
    if (fireBanTag !== null) {
      fireBanTag.style.display = "none"
    }
    // Iterate through State CMS HTML until we find state where stack is located
    for (let i = 0; i < stateFireItems.length; i++) {
      for (let c = 0; c < stateFireItems[i].children.length; c++) {
        let stateDetail = stateFireItems[i].children[c]
        if (stateDetail.className == "v2-statefirestatename") {
          if (stateDetail.innerHTML == stackState.innerHTML) {
            for (let c = 0; c < stateFireItems[i].children.length; c++) {
              let stateDetail = stateFireItems[i].children[c]
              // When we come across the URL to the state fire info page, update hyperlink in menu
              if (stateDetail.className == "v2-statefireinfopage") {
                let fireRestrictionInfoOptionTextParent = document.getElementById("fire-restriction-info-option-text").parentElement
                fireRestrictionInfoOptionTextParent.href = stateDetail.innerHTML
              }
              /*
              Check if there's a fire restriction in the state, if so unhide the Fire Restriction tag
              and update the hyperlink on the tag to link to the state fire info page
              */
              if (stateDetail.className == "v2-statefirewarninglevel") {
                if (stateDetail.innerHTML == "Restricted") {
	          if (fireBanTag !== null) {
                    fireBanTag.style.display = "flex"
	          }
                  for (let c = 0; c < stateFireItems[i].children.length; c++) {
                    let stateDetail = stateFireItems[i].children[c]
                    if (stateDetail.className == "v2-statefireinfopage") {
                      let fireBanTagTextParent = document.getElementById("fire-ban-tag-text").parentElement
                      fireBanTagTextParent.href = stateDetail.innerHTML
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    let displayStyle = 'flex'

    // Make sure Verified tag and text is hidden
    verifiedTag = document.getElementById("verified-tag")
    verifiedText = document.getElementById("verified-text")
    verifiedTag.style.display = "none"
    verifiedText.style.display = "none"

    // Display Verified tag and text if verified
    if (stackVerified.innerHTML == 1) {
      verifiedTag.style.display = displayStyle
      let verifiedDate = new Date(stackVerifiedOn.innerHTML).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
      verifiedText.innerHTML = "Last Verified on " + verifiedDate
      verifiedText.style.display = displayStyle
    }

    // Reveal extra details icon and texts
    if (stackArrangement.innerHTML == 'Loose') {
      document.getElementById('arrangement-loose').style.display = displayStyle
    } else if (stackArrangement.innerHTML == 'Packaged') {
     document.getElementById('arrangement-bundled').style.display = displayStyle
    }
    if (stackStorage.innerHTML == 'Indoors') {
      document.getElementById('storage-indoors').style.display = displayStyle
    } else if (stackStorage.innerHTML == 'Outdoors') {
      document.getElementById('storage-outdoors').style.display = displayStyle
    } else if (stackStorage.innerHTML == 'Covered') {
      document.getElementById('storage-covered').style.display = displayStyle
    }
    if (stackKindling.innerHTML == 'Kindling') {
      document.getElementById('kindling').style.display = displayStyle
    } else if (stackKindling.innerHTML == 'Fire Starters') {
      document.getElementById('fire-starters').style.display = displayStyle
    } else if (stackKindling.innerHTML == 'Kindling &amp; Fire Starters') {
      document.getElementById('fire-starters').style.display = displayStyle
      document.getElementById('kindling').style.display = displayStyle
    }
    if (stackEstablishmentType.innerHTML == 'Mom &amp; Pop') {
      document.getElementById('establishment-mom-pop').style.display = displayStyle
    } else if (stackEstablishmentType.innerHTML == 'Gas Station/Convenience') {
      document.getElementById('establishment-gas-station-convenience').style.display = displayStyle
    } else if (stackEstablishmentType.innerHTML == 'Big Box Store') {
      document.getElementById('establishment-big-box-store').style.display = displayStyle
    } else if (stackEstablishmentType.innerHTML == 'Park Office') {
      document.getElementById('establishment-park-office').style.display = displayStyle
    } else if (stackEstablishmentType.innerHTML == 'Hardware Store') {
      document.getElementById('establishment-hardware').style.display = displayStyle
    } else if (stackEstablishmentType.innerHTML == 'Grocery Store') {
      document.getElementById('establishment-grocery-store').style.display = displayStyle
    } else if (stackEstablishmentType.innerHTML == 'Camp Host') {
      document.getElementById('establishment-camp-host').style.display = displayStyle
    } else if (stackEstablishmentType.innerHTML == 'Other') {
      document.getElementById('establishment-other').style.display = displayStyle
    }
    // Update URL hash parameter
    window.location.hash = stackID.innerHTML + "," + stackLatitude.innerHTML + "," + stackLongitude.innerHTML
}
