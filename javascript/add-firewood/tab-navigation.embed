<script>
// On page ready
var Webflow = Webflow || [];
Webflow.push(function() {
  // Disable next button
  //document.getElementById('tab-next-coordinates').disabled = true

  // For any tab-prev and tab-next clicks
  $('.tab-wrapper').on('click', '.tab-previous, .tab-next', function() {

    // Get direction
    var direction = $(this).hasClass('tab-previous') ? -1 : 1;

    // Get the tab links
    var tablinks = $('.w-tab-menu');

    // Get index of current tab link, add direction
    var index = tablinks.find('.w--current').index() + direction;

    // If array out of bounds, click on the first
    index = index >= tablinks.children().length ? 0 : index;

    // Update tabs by triggering a "tap" event on the corresponding slide
    // Skip address entry tab if EXIF data had coordinates
    if (exifHasCoordinates === true && index === 1 && direction === 1 ) {
      tablinks.find('.w-tab-link').eq(index +1).trigger('click')
      // Hack to refresh map to window size on tab change
      setTimeout(function() {
        map.invalidateSize()
      }, 1000) // Delay in miliseconds
    } else if (exifHasCoordinates === true && index === 1 && direction === -1 ) {
      tablinks.find('.w-tab-link').eq(index -1).trigger('click')
    } else if (index == 2) {
      // Hack to refresh map to window size on tab change
      setTimeout(function() {
        map.invalidateSize()
      }, 1000) // Delay in miliseconds
      tablinks.find('.w-tab-link').eq(index).trigger('click')
    } else if (index == 3) {
      let latValue = document.getElementById('latitude').value
      let lonValue = document.getElementById('longitude').value
      if (latValue == 0 || lonValue == 0) {
        alert('You must provide coordinates!')
      } else {
        tablinks.find('.w-tab-link').eq(index).trigger('click')
      }
    } else {
      tablinks.find('.w-tab-link').eq(index).trigger('click')
    }
    $('html,body').scrollTop(0)
  }); // End click handler

}); // End ready function
</script>
