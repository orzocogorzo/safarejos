//Create map
var map=L.map("map_cris");
var column = document.getElementsByClassName('column')[0];//Use Js to get an HTML object
var label = document.getElementsByClassName('label')[0]; //Use Js to get an HTML object
var layers = column.getElementsByClassName('layers')[0];//Use Js to get an HTML object
var graphicContainer = column.getElementsByClassName('q-container')[0];//Use Js to get an HTML object
var filtersContainer = column.getElementsByClassName('filters')[0];

map.setView([41.435435, 2.212861],18);

var myTileLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
    maxZoom: 19,
    id: 'orzoc.181b5b9d'  
  }).addTo(map);

L.control.scale({
  metric:true,
  imperial: true,
  maxWidth: 200
}).addTo(map);

function styleMunicipis(feature) {
  return {
    color: 'white',
    weight: 2,
    opacity: 1,
    fillOpacity: 0,
    clickable: true
  };
};

// var municipis_layer = new L.geoJson(municipis,{
//   style:styleMunicipis
// }).addTo(map);