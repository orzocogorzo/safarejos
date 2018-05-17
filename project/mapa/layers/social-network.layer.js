var social_relationships_layer;

function socialNetworkLayerGen( filterFn ) {
  var layer = new L.geoJson(social_relationships, {
    filter: filterFn,
    style: styleSocial,
    onEachFeature: onEachFeatureSocial
  });
  social_relationships_layer = layer;
  return layer;
}

function styleSocial(feature) {
  return {
    
    color: 'white',
    weight: 0.25,
    opacity: 1,
    fillOpacity: 0,
    clickable: true

  };
}

function onEachFeatureSocial( feature, layer ) {

  layer.on({
      mouseover: highlightNetwork,
      mouseout: resetHighlightNetwork
  });
}

function highlightNetwork( event ) {
  var layer = event.target;
  currentLayer._layers.map(function( _layer ){
    if ( _layer.feature.properties.x_start == layer.properties.x_end || _layer.feature.properties.y_start == layer.properties.y_end ) {
      
    }
  });
}

function resetHighlightNetwork( event ) {
  var layer = event.target;
}

social_relationships_layer = socialNetworkLayerGen();