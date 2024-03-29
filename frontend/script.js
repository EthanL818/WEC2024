let markers = [];

// Fetch JSON data from the backend
fetch("/", { method: "POST" })
  .then((response) => {
    return response.text();
  })
  .then((text) => {
    // Try to parse the text as JSON
    const data = JSON.parse(text);

    data.forEach((element) => {
      let marker = L.marker([element.lat, element.long])
        .addTo(map)
        .bindPopup(
          `Name: <strong>${element.Name}</strong> <br> Date: ${element.date} <br> Type: ${element.type} <br> Intensity: ${element.intensity} <br> Location (long, lat): ${element.long}, ${element.lat}`
        );

      markers.push({
        Information: element,
        Marker: marker,
      });
    });
  })
  .catch((error) => console.error("Error:", error));

//initialize the map, use a default position
var map = L.map("map").setView([20, 30], 2);

//use free OpenStreetMap map tiles. This application is not for commercial use.
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// selects all the checkbox items
document.getElementsByName("options").forEach(function (chk) {
  // adds an event listener to each checkbox
  chk.addEventListener("click", function () {
    // if checkbox is unchecked,
    if (this.checked == false) {
      // check if the markers' types are the same as the checkbox value
      for (let i = 0; i < markers.length; i++) {
        // if they are, remove them from the map
        if (markers[i].Information.type == this.value) {
          map.removeLayer(markers[i].Marker);
        }
      }
      // else, if they are checked,
    } else if (this.checked == true) {
      // check if the markers' types are the same as the checkbox value
      for (let i = 0; i < markers.length; i++) {
        // if they are, add them back to the map
        if (markers[i].Information.type == this.value) {
          map.addLayer(markers[i].Marker);
        }
      }
    }
  });
});

// You can add JavaScript code here for slider functionality or filtering logic if needed
const slider = document.getElementById("sliderValue");
const sliderValueLabel = document.getElementById("sliderValueLabel");

// add an event listener to the slider
slider.addEventListener("input", function () {
  // loop through each disaster and find their intensity level
  for (let i = 0; i < markers.length; i++) {
    // if the markers' disaster level is less than or equal to the value on the slider, display it
    if (markers[i].Information.intensity <= parseInt(this.value)) {
      map.addLayer(markers[i].Marker);
      console.log(markers[i].Information.intensity);
    }

    // if the markers' disaster level is greater than the value on the slider, remove it
    if (markers[i].Information.intensity > parseInt(this.value)) {
      map.removeLayer(markers[i].Marker);
      console.log(markers[i].Information.intensity);
    }
  }
});
