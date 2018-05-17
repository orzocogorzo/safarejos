var paths_layer;

function pathsLayerGen( filterFn ) {
  var layer =  new L.geoJson(paths,{
    filter: filterFn,
    style: stylePaths,
    onEachFeature: onEachFeaturePaths
  });
  paths_layer = layer;
  return layer;
}

function highlightFeaturePaths( event ) {
  var layer = event.target;
  layer.setStyle({
      weight: 10,
      color: '#04FFFF',
      fillOpacity: 1,
      opacity: 1,
  });
  //info.update(layer.feature.properties);
};

function resetHighlightPaths( e ) {
  paths_layer.resetStyle( e.target );
    //info.update();
};

function zoomToFeature( e ) {
  map.fitBounds(e.target.getBounds());
};

function onEachFeaturePaths( feature_A, layer_B ) {
  layer_B.bindPopup(feature_A.properties.Name+"<span><br /></span>" + feature_A.properties.Reason)
  layer_B.on({
      mouseover: highlightFeaturePaths,
      mouseout: resetHighlightPaths,
      click: zoomToFeature
  });
};

function stylePaths(feature) {
  return {
    
    color: 'white',
    weight: 10,
    opacity: 0.25,
    fillOpacity: 0.5,
    clickable: true
  };
}

var paths_layer = pathsLayerGen();