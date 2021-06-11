const mbUri = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${API_KEY}`;
const mAttrib = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

function createMap(eqdata) {
    var lightMap = L.tileLayer(mbUri, {
       maxZoom: 5,
       attribution: mAttrib,
       id: 'mapbox/light-v9',
       tileSize: 512,
       zoomOffset: -1
   });
   var satmap = L.tileLayer(mbUri, {
    maxZoom: 5,
    attribution: mAttrib,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1
});

var baseLayers = {
    "Light": lightMap,
    "Satellite": satmap
};
//.addTo(myMap)
// 
 var myMap = L.map("mapid", {
   center: [33.8904, -84.4679],
   zoom: 10,
   layers:[lightMap, eqdata]
 });
 // Setup the legend for the magnitude of the earthquakes
 var legend = L.control({ position: "bottomright"});
 legend.onAdd = () => {
     var div = L.DomUtil.create('div', 'info legend'),
     magnitude = [0,1,2,3,4,5,6,7],
     labels = [];
     for (var i = 0; i < magnitude.length; i++)  {
        div.innerHTML +=
        `<i style="background:${fillColor(magnitude[i] + 1)}" >      </i> ` +  magnitude[i] + (magnitude[i + 1] ? "-->" + magnitude[i + 1] + '<br>': '+');
     }
     console.log(div.innerHTML);
     return div;
};
// adding legend to the map ${magnitude[i]} 
legend.addTo(myMap);
L.control.layers(baseLayers).addTo(myMap);
}
 function createCircles(response) {
   // Pull the "stations" property off of response.data
   var data = response.features ; 
   var eqarray = [];
   for (i = 0 ; i< data.length ; i ++ ){
     // Capture data into local variables 
        const mag = data[i].properties.mag;
        const pl = data[i].properties.place;
        const lat = data[i].geometry.coordinates[1] ;
        const lon = data[i].geometry.coordinates[0] ;
        const depth = data[i].geometry.coordinates[2] ;
     // Create a circle and pass in some initial options
       const eqcircle = L.circle([lat,lon], {
           color: fillColor(mag),
           fillColor: fillColor(mag),
           fillOpacity: 0.50,
           radius: radiusMag(depth)
       }).bindPopup("<h3>" + pl + "<h3><h3>depth: " + depth + "</h3>" + "<h3> magnitude:" + mag + "</h3>")
       ;
       eqarray.push(eqcircle);
   }
   //console.log(eqarray);
   createMap(L.layerGroup(eqarray));
 }
 function radiusMag(depth){
   return depth*1500 ;
 }
 function fillColor(mag){
     //Conditionals for countries points
     var ccolor = "";
     //console.log(mag);
     switch (true) {
       case mag >= 7:
         return 'red';
         break;
     case mag >= 6:
       return 'orangered';
       break;
     case mag >= 5:
       return 'darkorange';
       break;
     case mag >= 4:
       return 'orange';
       break;
     case mag >= 3:
       return 'gold';
       break;
     case mag >= 2:
       return 'yellow';
       break;
     default:
       return 'greenyellow';
     };
 }
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", createCircles);