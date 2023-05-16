<script>
// On map click hide stack details card and jump to top of page
map.on('click', hideStackDetailsCard)
function hideStackDetailsCard() {
    document.getElementById("map-details-animation-wrapper").classList.remove("map-details-animation-wrapper-slide")
    window.scrollTo(0,0)
}

// On location-search-bar click hide stack details card and jump to top of page
document.getElementById("location-search-bar").addEventListener("click", hideStackDetailsCard)

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
</script>
