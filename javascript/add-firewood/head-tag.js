
<!-- Include jquery -->
<script
src="https://code.jquery.com/jquery-3.4.1.min.js"
integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
crossorigin="anonymous"></script>
<!-- Include blueimp-load-image  for image orientation based on EXIF data-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-load-image/2.12.2/load-image.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-load-image/2.12.2/load-image-scale.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-load-image/2.12.2/load-image-orientation.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/exifreader@3.13.0/dist/exif-reader.min.js"></script>
<!--Import Leaflet CSS-->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
  integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
  crossorigin=""/>
<!--Import Leaflet Javascript-->
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
  integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
  crossorigin=""></script>
<style>
/* Style the Image Used to Trigger the Modal */
#stack-image-preview {
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  max-height: 150px;
  width: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 15px;
}

#stack-image-preview-map {
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  max-height: 150px;
  width: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#modal-img {
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: auto;
  max-width: 85%;
  max-height: 200%;
  margin-top: 100px;
}

#stack-image-preview:hover {opacity: 0.7;}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  /* padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
}

/* Modal Content (Image) */
.modal-content {
  margin: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 85%;
  height: auto;
  /* max-width: 700px; */
}

/* Add Animation - Zoom in the Modal */
.modal-content {
  animation-name: zoom;
  animation-duration: 0.6s;
}

@keyframes zoom {
  from {transform:scale(0)}
  to {transform:scale(1)}
}

/* The Close Button */
.close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

/* 100% Image Width on Smaller Screens */
@media only screen and (max-width: 700px){
  .modal-content, #modal-img {
    width: 100%;
  }
}

</style>
