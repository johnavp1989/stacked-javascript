// Convert image to canvas to allow for proper orientation
function img2canvas(imgfile) {
  var loadingImage = loadImage(
    imgfile,
    function(img) {
      // Orient photo using EXIF data
      orientedImg = window.loadImage.scale(img, {canvas: true})

      // Locate submit-photo-div
      var submitPhotoDiv = document.getElementById("submit-photo-div")

      // Give canvas an ID
      orientedImg.id = "stack-image-preview"

      // Get the modal
      var modal = document.getElementById("myModal")

      // Here we make a copy of the canvas and insert it into our modal
      // We need a copy so we can apply different CSS styling
      var modalImg = document.getElementById("img01")
      orientedImg.onclick = function(){
        modal.style.display = "block"
        var myModal = document.getElementById("myModal")

        //create a new canvas
        var modalImg = document.createElement('canvas')
        var context = modalImg.getContext('2d')

        //set dimensions
        modalImg.width = orientedImg.width
        modalImg.height = orientedImg.height

        //apply the old canvas to the new one
        context.drawImage(orientedImg, 0, 0)

        // Assign id to the modal image
        modalImg.id = 'modal-img'

        // Check for modal image (canvas) and remove
        if (document.contains(document.getElementById("modal-img"))) {
          document.getElementById("modal-img").remove()
        }
        // Insert new canvas onto the modal
        myModal.appendChild(modalImg)
      }

      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("modal")[0];

      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
        modal.style.display = "none"
      }

      // Check for exiting image (canvas) and remove
      if (document.contains(document.getElementById("stack-image-preview"))) {
        document.getElementById("stack-image-preview").remove()
      }
      // If there's a map make sure the image is inserted before it
      if (document.contains(document.getElementById("stack-image-preview-map"))) {
        var previewMap = document.getElementById("stack-image-preview")
        var photoUploadEmbed = document.getElementById("photo-upload-handling")
        submitPhotoDiv.insertBefore(orientedImg, photoUploadEmbed.nextSibling)
        var context = orientedImg.getContext('2d')
        canvasUrl = context.canvas.toDataURL('image/jpeg', 0.5)
        canvasFile = dataURItoBlob(canvasUrl)
      // If there's no map we can just append it
      } else {
        // Append image (canvas) to submit-photo-div
        submitPhotoDiv.appendChild(orientedImg)
        var context = orientedImg.getContext('2d')
        canvasUrl = context.canvas.toDataURL('image/jpeg', 0.5)
        canvasFile = dataURItoBlob(canvasUrl)
      }
    }
  )
  if (!loadingImage) {
    // Alternative code
  }
}
function genPreviewImg(previewImg) {
  // Check for exiting image (canvas) and remove
  if (document.contains(document.getElementById("stack-image-preview"))) {
    document.getElementById("stack-image-preview").remove()
  }
  // Locate submit-photo-div
  var submitPhotoDiv = document.getElementById("submit-photo-div")
  // If there's a map make sure the image is inserted before it
  if (document.contains(document.getElementById("stack-image-preview-map"))) {
    var previewMap = document.getElementById("stack-image-preview")
    var photoUploadEmbed = document.getElementById("photo-upload-handling")
    submitPhotoDiv.insertBefore(previewImg, photoUploadEmbed.nextSibling)
  // If there's no map we can just append it
  } else {
    // Append image (canvas) to submit-photo-div
    submitPhotoDiv.appendChild(previewImg)
  }
}
