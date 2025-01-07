// Store our API endpoint as queryUrl.
let earthquake_json_Url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
 //Create base layers.
 let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


// Create a baseMap object.
let baseMap = {
  "Street Map": street,
  "Topographic Map": topo
};
let myMap = L.map("map", {
  center: [
    39.17, -119.0181
  ],
  zoom: 5,
 // layers:[street,states,cities]
  //layers: [street, earthquakes]

});

street.addTo(myMap)
//Perform a GET request to the earthquake_json_Url/
d3.json(earthquake_json_Url).then(function(data) {
//GET a response, send the data.features object to the createFeatures function.
createFeatures(data.features);
});
let tectonicPlates= new L.LayerGroup();
let earthquakes= new L.LayerGroup();
//function createFeatures(earthquakeData) {
function onEachFeature(feature,layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
}
// Create overlay object 
let overlayMaps = {
  Earthquakes:earthquakes,
  "Tectonic Plates": tectonicPlates


};
L.control.layers(baseMap,overlayMaps).addTo(myMap)

// createImageBitmap(earthquakes);
// }
// let earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature
// });
function createFeatures(earthquakeData){
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circle(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: onEachFeature
  });
  
  // Add the earthquake data to the earthquakes layer group
  earthquakes.addTo(myMap);
}

// Add a function to determine color based on magnitude
function getColor(magnitude) {
  if (magnitude > 5) return "#FF0000";
  else if (magnitude > 4) return "#FF6900";
  else if (magnitude > 3) return "#FFA500";
  else if (magnitude > 2) return "#FFD700";
  else if (magnitude > 1) return "#FFFF00";
  else return "#90EE90";
}

function markerSize(magnitude) {
  return magnitude * 20000;
}

function createImageBitmap(earthquakes) {

}




  // Create our map, giving it the streetmap and earthquakes layers to display on load.
 

  //Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMap, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Define arrays to hold the created city and state markers.
let cityMarkers = [];
let stateMarkers = [];

// Loop through locations, and create the city and state markers.
for (let i = 0; i < locations.length; i++) {
  // Setting the marker radius for the state by passing population into the markerSize function
  stateMarkers.push(
    L.circle(locations[i].coordinates, {
      stroke: false,
      fillOpacity: 0.75,
      color: "purple",
      fillColor: "purple",
      radius: markerSize(locations[i].state.population)
    })
  );
}


