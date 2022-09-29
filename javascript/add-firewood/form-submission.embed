<script>
var postUrl = 'https://" + apiHost "/collections/619b9db62516ba6ebe4db869/items'

function createItem() {
    // Display loading overlay
    submitLoader = document.getElementById('submit-loader')
    submitLoader.style.display = 'flex'
    // Clear error message if it's there from a previous submission failure
    document.getElementsByClassName("w-form-fail")[0].style.display = 'none'
    var lat = document.getElementById('latitude').value
    var lon = document.getElementById('longitude').value
    var street = document.getElementById('stack-street').value
    var city = document.getElementById('stack-city').value
    var state = document.getElementById('stack-state').value
    var zip = document.getElementById('stack-zip').value
    var submitterName = document.getElementById('submitter-name').value
    var submitterEmailEntry = document.getElementById('submitter-email').value
    var userGivenName = document.getElementById('user-given-name').value
    var description = document.getElementById('description').value
    var establishmentTypeButtons = document.getElementsByName('establishment')
    var storageTypeButtons = document.getElementsByName('storage')
    var priceRangeButtons = document.getElementsByName('price')
    var piecesCountButtons = document.getElementsByName('pieces')
    var arrangementButtons = document.getElementsByName('arrangement')
    var seasonButtons = document.getElementsByName('season')
    var splitButtons = document.getElementsByName('split')
    var wetButtons = document.getElementsByName('wet')
    var treatedButtons = document.getElementsByName('treated')
    var kindlingButtons = document.getElementsByName('kindling')
    for (i = 0; i < establishmentTypeButtons.length; i++) {
      if (establishmentTypeButtons[i].checked) {
        var establishmentType = establishmentTypeButtons[i].value
      }
    }
    for (i = 0; i < storageTypeButtons.length; i++) {
      if (storageTypeButtons[i].checked) {
        var storageType = storageTypeButtons[i].value
      }
    }
    for (i = 0; i < priceRangeButtons.length; i++) {
      if (priceRangeButtons[i].checked) {
        var priceRange = priceRangeButtons[i].value
      }
    }
    for (i = 0; i < piecesCountButtons.length; i++) {
      if (piecesCountButtons[i].checked) {
        var piecesCount = piecesCountButtons[i].value
      }
    }
    for (i = 0; i < arrangementButtons.length; i++) {
      if (arrangementButtons[i].checked) {
        var arrangement = arrangementButtons[i].value
      }
    }
    for (i = 0; i < seasonButtons.length; i++) {
      if (seasonButtons[i].checked) {
        var season = seasonButtons[i].value
      }
    }
    for (i = 0; i < splitButtons.length; i++) {
      if (splitButtons[i].checked) {
        var split = splitButtons[i].value
      }
    }
    for (i = 0; i < wetButtons.length; i++) {
      if (wetButtons[i].checked) {
        var wet = wetButtons[i].value
      }
    }
    for (i = 0; i < treatedButtons.length; i++) {
      if (treatedButtons[i].checked) {
        var treated = treatedButtons[i].value
      }
    }
    var kindlingSelection = []
    var unknown = false
    for (i = 0; i < kindlingButtons.length; i++) {
      if (kindlingButtons[i].checked) {
        kindlingSelection.push(kindlingButtons[i].labels[0].innerText)
      }
    }
    if (kindlingSelection.length > 1) {
      var kindling = "Kindling & Fire Starters"
    } else if (kindlingSelection.length == 1) {
      var kindling = kindlingSelection[0].trim()
    } else {
      var kinding = "I Don't Know"
    }

    // If user doesn't provide an email fill in a bogus one so we pass validation
    if (submitterEmailEntry === "") {
      var submitterEmail = "none@stacked.camp"
    } else {
      var submitterEmail = submitterEmailEntry
    }

    var data = JSON.stringify({
        "fields": {
            "name": lat + "_" + lon,
            "_draft": true,
            "_archived": false,
            "latitude": lat,
            "longitude": lon,
            "street": street,
            "city-2": city,
            "state-2": state,
            "state-cms": STATE_COLLECTION_STATE_IDS[state],
            "szip": zip,
            "establishment-type": establishmentType,
            "storage": storageType,
            "price-range": priceRange,
            "number-of-pieces": piecesCount,
            "arrangement": arrangement,
            "season": season,
            "split": split,
            "wet": wet,
            "kindling-2": kindling,
            "submitter-name": submitterName,
            "submitter-email": submitterEmailEntry,
            "user-given-name": userGivenName,
            "description": description,
            "stack-image": canvasUrl
        }
    })

    fetch(postUrl, {
      method: 'post',
      headers: {Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
      body: data
    }).then(response => {
         submitLoader.style.display = 'none'
         if (!response.ok) {
           throw new Error('Network response was not 200 OK')
           console.log('API response: ' + text)
         }
         response.text().then(text => {
           if (text == 'Validation Failure') {
             console.log('API response: ' + text)
             throw new Error('Submission validation error')
           } else if (text == 'Slug missing') {
             console.log('API response: ' + text)
             throw new Error('Slug missing error')
           }
         addFirewoodForm = document.getElementById("logAStackForm")
         addFirewoodForm.addEventListener('submit', (e) => {
           $('html,body').scrollTop(0)
         })
         // Submit forrm on API call success
         addFirewoodForm.requestSubmit()
         }).catch( () => {
           submitLoader.style.display = 'none'
           document.getElementsByClassName("w-form-fail")[0].style.display = 'inherit'
         })
    }).catch( () => {
        submitLoader.style.display = 'none'
        document.getElementsByClassName("w-form-fail")[0].style.display = 'inherit'
    })
}

function countDescription(event) {
  let max = 600
  let length = description.value.length
  descriptionWordCounter.innerHTML = length + "/" + max
  if (length >= 550) {
    descriptionWordCounter.className = "form-desc-word-count-orange"
  }
  if (length >= 585) {
    descriptionWordCounter.className = "form-desc-word-count-red"
  }
  if (length < 550) {
    descriptionWordCounter.className = "form-desc-word-count-green"
  }
  // Android allows the user to enter more characters than the maxlength
  // and then deletes the extra characters after they leave the text box
  // This prevents the user from typing beyond the maxlength
  if (length >= max ) {
    description.value = description.value.substring(0, max -1)
    descriptionWordCounter.innerHTML = max + "/" + max
  }
}

var descriptionWordCounter
var description
$(document).ready(function(){
  let submitButton = document.getElementById("submit-form")
  submitButton.addEventListener("click", createItem)
  description = document.getElementById("description")
  descriptionWordCounter = document.getElementById("description_word_counter")
  description.addEventListener("keydown", countDescription)
  description.addEventListener("keyup", countDescription)
  description.addEventListener("paste", countDescription)
})
</script>
