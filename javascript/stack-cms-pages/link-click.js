<script>
$(document).ready(function() {
  let stackLatitude =  document.getElementById("latitude")
  let stackLongitude = document.getElementById("longitude")
  let stackState = document.getElementById("state")
  let directionsURL = 'https://www.google.com/maps/dir/?api=1&destination=' + stackLatitude.innerHTML + '%2C' + stackLongitude.innerHTML

  // Add link to Get Directions text/icon
  let getDirectionsTextParent = document.getElementById("get-directions-icon").parentElement
  getDirectionsTextParent.href = directionsURL

  // Add link to Get Directions menu item
  let getDirectionsMenuTextParent = document.getElementById("get-directions-option-text").parentElement
  getDirectionsMenuTextParent.href = directionsURL

  // Populate Share This Stack text
  document.getElementById('share-this-stack-link').innerHTML = "Check out this firewood location in " + stackState.innerHTML + " on Stacked! " + window.location.href

  function restoreClickToCopyText(orignalText) {
    document.getElementById("click-to-copy-text").innerHTML = orignalText
  }

  // Copy stack URL text on click
  function copyStackURLText() {
    // Copy text to clipboard
    let textRange = document.createRange()
    let shareThisStackLink = document.getElementById("share-this-stack-link")
    textRange.selectNode(shareThisStackLink)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(textRange)
    // Check for navigator support otherwise fallback to execCommand
    if(navigator.clipboard) {
      navigator.clipboard.writeText(shareThisStackLink.innerHTML)
    } else {
      document.execCommand('copy')
    }
    window.getSelection().removeAllRanges()

    // Notify user of the copied text
    let originalText = document.getElementById("click-to-copy-text").innerHTML
    let confirmationText = "Copied to clipboard"
    document.getElementById("click-to-copy-text").innerHTML = confirmationText

    // Restore text
    if (confirmationText != originalText) {
    setTimeout(restoreClickToCopyText, 2000, originalText)
    }

  }

  document.getElementById("share-this-stack-link").addEventListener("click", copyStackURLText)
})
</script>
