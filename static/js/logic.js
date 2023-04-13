// Define map variable and starting view 
let myMap = L.map("map", {
    center: [41.3874, 2.1686],
    zoom: 3
  });
  
  // Add the map tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
// CHOOSE DATASET //
  // past day, all magnitudes 
     let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  // past hour, all magnitudes
    // let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
  // past week, only significant 
    // let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";
  
// Use function to size circle to Magnitude
function sizeCircle(magnitude) {
    return magnitude * 3;
};

// Use function to color the circle by depth
function colorCircle(depth) {
    if (depth >= 90) {
        color = "#660000";
    }
    else if (depth < 90 && depth >= 70) {
        color = " #990000";
    }
    else if (depth < 70 && depth >= 50) {
        color = "#cc0000";
    }
    else if (depth < 50 && depth >= 30) {
        color = "#ff1a1a";
    }
    else if (depth < 30 && depth >= 10) {
        color = "#ff6666";
    }
    else if (depth < 10 && depth >= -10) {
        color = "#ffb3b3";
    };

    return color;
};

// Access data from link
d3.json(url).then(data => {
    console.log(data);

    let features = data.features;
    let depth_array = [];

    // Loop through data
    for (let i = 0; i < features.length; i++) {
        // Define variables from earthquake data
        let coordinates = features[i].geometry.coordinates;
        let latitude = coordinates[1];
        let longitude = coordinates[0];

        // Define depth and create depth array
        let depth = coordinates[2];
        depth_array.push(depth);

        // Define properties, place, magnitude, and type
        let properties = features[i].properties;
        let place = properties.place;
        let magnitude = properties.mag;
        let type = properties.type;

        // Create markers
        circles = L.circleMarker([latitude, longitude], {
            color: "black",
            weight: 1,
            fillColor: colorCircle(depth),
            opactiy: 1,
            fillOpacity: 1,
            radius: sizeCircle(magnitude)
        }).bindPopup(`<h3>${place}</h3>Type: ${type}<br/>Magnitude:${magnitude}<br/>Depth: ${depth}`).addTo(myMap);
    };
})

// Create legend
let legend = L.control({position: "topright"});

  // Add legend details
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");

    // Define legend elements
    let legendDepth = [-10, 10, 30, 50, 70, 90];
    let legendColors = [
      "#ffb3b3",
      "#ff6666",
      "#ff1a1a",
      "#cc0000",
      "#990000",
      "#660000"
    ];

    // Loop through the intervals to create individual labels
    for (let i = 0; i < legendDepth.length; i++) {
      div.innerHTML += "<i style='background: " + legendColors[i] + "'></i> "
      + legendDepth[i] + (legendDepth[i + 1] ? "&ndash;" + legendDepth[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Add legend on to map
  legend.addTo(myMap);
