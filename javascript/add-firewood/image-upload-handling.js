<!-- Create hidden file upload element -->
<input type="file" name="stack-image" class="w-input" id="stack-image" style="display: none;">
<!-- Create image modal -->
<div id="myModal" class="modal">
  <!-- The Close Button -->
  <span class="close">&times;</span>
</div>
<style>
.modal {
  position:relative;
}
</style>
<script>
  var canvasUrl
  var canvasFile
  var exifOrientation
  var exifHasCoordinates = false
  var mapZoom = 17
  // Prompt for file upload on button click
  $(document).ready(function() {
    $('#upload-button').click(function(){ $('#stack-image').trigger('click') })
  })

  // Do things when image is uploaded
  document.getElementById("stack-image").onchange = function(e) {
    // Change button text to Next
    document.getElementById('next-photo-upload').style.display = 'flex'
    var file = e.target.files[0]
    var exifData
    var orientedImg
    // Extract EXIF data
    if (file && file.name) {
      var reader = new FileReader()
      reader.onload = function(e) {
        try {
          exifData = ExifReader.load(e.target.result)
        }
        catch (error) {
          console.log("Failed to load EXIF data")
        }
        if (exifData) {
          if (exifData['Orientation']) {
            exifOrientation = exifData['Orientation'].value
          }
          if (exifData['GPSLatitude'], exifData['GPSLatitudeRef'], exifData['GPSLongitude'], exifData['GPSLongitudeRef']) {
            exifHasCoordinates = true
            function SetDDDirection(dd, direction) {
              if (direction == "S" || direction == "W") {
                  dd = dd * -1;
              } // Don't do anything for N or E
              return dd;
            }
            // Calculate latitude decimal
            var latdd = exifData['GPSLatitude'].description
            var latDirection = exifData['GPSLatitudeRef'].value
            var latFinal = SetDDDirection(latdd, latDirection)

            // Calculate longitude decimal
            var londd = exifData['GPSLongitude'].description
            var lonDirection = exifData['GPSLongitudeRef'].value
            var lonFinal = SetDDDirection(londd, lonDirection)

            if ((latFinal === 0) && (lonFinal === 0)) {
              // Check for exiting preview map and remove
              removePreviewMap()
            } else {
              // Check for exiting preview map and remove
              removePreviewMap()
              // Create google maps embed URL using coordinates
              //embedUrl = "https://www.google.com/maps/embed/v1/place?q=" + latFinal + "%2C" + lonFinal + "&key=AIzaSyA6XG39w2VOoI60mYZJx0yFUQpU6jnENJ8"
              // Create iframe
              //var iframe = document.createElement('iframe');
              // Set src to the google maps embed URL and set ID
              //iframe.src = embedUrl
              //imageMap = L.map('image-location-preview-map-div', {zoomControl: false})
              //imageMap.setView([latFinal, lonFinal], mapZoom)
              //L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9obmF2cDE5ODkiLCJhIjoiY2twcGdmaWowMDJ5ZjJ1bzNxOTJpZWdocSJ9.2qtEaSUb2KylL0EDdTIqFg', {
              //  maxZoom: 19,
              //  attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">MapBox </a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a><strong><a href="https://www.mapbox.com/map-feedback/#/-74.5/40/10" target="_blank"> Improve this map</a></strong>'
              //}).addTo(imageMap)
              //marker = L.marker([latFinal,lonFinal], {icon: stackLocationIcon}).addTo(imageMap)
              //iframe.id = "stack-image-preview-map"
              // Locate submit-photo-div
              // Append map to submit-photo-div
              //var imageLocationPreviewMap = document.getElementById("image-location-preview-map-div")
              //$(iframe).insertBefore($("#upload-next-div"))

              // Autofill coordinates for user
              document.getElementById('latitude').value = parseFloat(latFinal.toFixed(5))
              document.getElementById('longitude').value = parseFloat(lonFinal.toFixed(5))

            // Geocode coordinates
            var geocodeUrl = "https://" + apiHost + "/nominatim/reverse?&format=geojson&lat=" + latFinal +  "&lon=" + lonFinal
              function reverseGeocode() {
                return new Promise(function (resolve, reject) {
	              var Httpreq = new XMLHttpRequest()
                  Httpreq.open("GET",geocodeUrl,false)
                  Httpreq.onload = resolve
                  Httpreq.onerror = reject
                  Httpreq.send()
                })
              }
              reverseGeocode()
                .then(function (e) {
                   var geoResponse = JSON.parse(e.target.response)
                   // Populate address fields for user
                   var stackStreet = document.getElementById('stack-street')
                   var stackCity = document.getElementById('stack-city')
                   var stackState = document.getElementById('stack-state')
                   var stackZip = document.getElementById('stack-zip')
                   var addressStatus = document.getElementById('address-status')
                   var addressDiv = document.getElementById('address-div')
                   var address = geoResponse.features[0]['properties']['address']
                   var name = geoResponse.features[0]['properties']['name']
                   addressStatus.innerText = "We've populated some details for you based on GPS data in your image! Feel free to make corrections."
                   if ((typeof address.house_number == 'undefined') && (typeof address.road !== 'undefined')) {
                     stackStreet.value = address.road
                   } else if ((typeof address.house_number == 'undefined') && (typeof address.road == 'undefined')) {
                     stackStreet.value = name
                   } else {
                     stackStreet.value = address.house_number + ' ' + address.road
                   }
                   if (typeof address.city == 'undefined') {
                     stackCity.value = ""
                   } else {
                     stackCity.value = address.city
                   }
                   stackState.value = address.state
                   stackZip.value = address.postcode.split('-')[0]
                   createPreviewMap(latFinal, lonFinal)
                   addressStatus.style.display = 'flex'
                   addressDiv.style.display = 'flex'
                 }, function (e) {
                 // handle errors
                })
            }
          } else {
            console.log("No Coordinates found in EXIF data of image '" + file.name + "'.")
            exifHasCoordinates = false
            removePreviewMap()
          }
        } else {
          // No EXIF - Check for exiting preview map and remove
          removePreviewMap()
        }

        function removePreviewMap() {
          // Check for exiting preview map and remove
          if (document.contains(document.getElementById("stack-image-preview-map"))) {
            document.getElementById("stack-image-preview-map").remove()
          }
        }
        // Handle HEIC
        if (file.type == "image/heif" || file.type == "image/heic") {
          loadingGif = loadImage('https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/5fffa05e458df112efa72b44_giphy.gif')
          loadingGif.id = "stack-image-preview"
          genPreviewImg(loadingGif)
          // Only load bloated heic2any library if needed
          $.getScript("https://cdn.jsdelivr.net/gh/alexcorvi/heic2any/dist/heic2any.js", function() {
            jpeg = heic2any({
                      blob: file,
                      toType: "image/jpeg",
                    })
            jpeg.then(function(result) {
               // Add file properties, canvas requires a type
               let imgfile = new File([result], file.name, {type: 'image/jpeg'})
               img2canvas(imgfile)
            })
          })
        } else {
          img2canvas(file)
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }
</script>
