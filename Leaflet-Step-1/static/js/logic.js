// API endpoint in url
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// GET request to URL
d3.json(url, function (data) {
    createFeatures(data.features);
    console.log(data)
});

function createFeatures(earthquakeData) {

    console.log('earthquakeData ***', earthquakeData)

    // Define a function to run once for each feature in the array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    function pointToLayer(feature, latlng) {

        var mymag = feature.properties.mag;

        var mycolor = "";
        if (mymag > 5) {
            mycolor = "#bd0026";
        }
        else if (mymag > 4) {
            mycolor = "#f03b20";
        }
        else if (mymag > 3) {
            mycolor = "#fd8d3c";
        }
        else if (mymag > 2) {
            mycolor = "#feb24c";
        }
        else if (mymag > 1) {
            mycolor = "#fed976";
        }
        else {
            mycolor = "#ffffb2";
        }

        var geojsonMarkerOptions = {
            radius: 5 * mymag,
            fillColor: mycolor,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

    // Sending our earthquakes layer to the createMap function
    console.log(earthquakes)
    createMap(earthquakes);
}

function createMap(earthquakes) {

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        // id: "mapbox.streets-basic",
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    
    // L.control.layers(overlayMaps, {
    //     collapsed: false
    // }).addTo(myMap);

    function getColor(d) {
        return d > 5 ? '#bd0026' :
            d > 4 ? '#f03b20' :
                d > 3 ? '#fd8d3c' :
                    d > 2 ? '#feb24c' :
                        d > 1 ? '#fed976' :
                            '#ffffb2';
    }

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
}


