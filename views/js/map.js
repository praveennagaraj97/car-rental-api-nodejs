//  TO get Users Currect Location

//Using InBuilt JS
// function geoFindMe() {
//   function success(position) {
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;

//     document.querySelector("#latitude").innerText = latitude;
//     document.querySelector("#longitude").innerText = longitude;
//   }

//   function error() {
//     status.textContent = "Unable to retrieve your location";
//   }

//   if (!navigator.geolocation) {
//     status.textContent = "Geolocation is not supported by your browser";
//   } else {
//     status.textContent = "Locating…";
//     navigator.geolocation.getCurrentPosition(success, error);
//   }
// }

// geoFindMe();

// Bing Maps
let map, directionsManager;
function GetMap() {
  map = new Microsoft.Maps.Map("#myMap", {
    center: new Microsoft.Maps.Location(12.971599, 77.594566),
    zoom: 10,
    //Type: [load, aerial,canvasDark,canvasLight,birdseye,grayscale,streetside]
    mapTypeId: Microsoft.Maps.MapTypeId.load,
  });
  //Load the directions module.
  Microsoft.Maps.loadModule("Microsoft.Maps.Directions", function () {
    //Create an instance of the directions manager.
    directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

    //Specify where to display the route instructions.
    directionsManager.setRenderOptions({
      itineraryContainer: "#directionsItinerary",
    });

    //Specify the where to display the input panel
    directionsManager.showInputPanel("directionsPanel");
  });
}
