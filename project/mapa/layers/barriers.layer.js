var barriers_layer;

function barriersLayerGen() {
  var layer = new L.geoJson(barriers,{
    style:styleBarriers,
    onEachFeature:onEachFeatureBarriers
  });

  barriers_layer = layer;
  return layer;
}

function styleBarriers(feature) {
  return {
    color: 'white',
    weight: 1,
    opacity: 1,
    fillOpacity: 0,
    clickable: true
  };
}

function highlightFeatureBarriers(event){
  var layer = event.target;
  layer.setStyle({
      weight: 3,
      color: '#04FFFF',
      fillOpacity: 1,
      opacity: 1,
  });
  //info.update(layer.feature.properties);
}

function resetHighlightBarriers(e) {
    barriers_layer.resetStyle(e.target);
    //info.update();
};

function onEachFeatureBarriers(feature_A,layer_B){
  layer_B.bindPopup(feature_A.properties.Barrier)
  layer_B.on({
      mouseover: highlightFeatureBarriers,
      mouseout: resetHighlightBarriers,
      click: zoomToFeature
  });
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}