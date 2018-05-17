var layer_identitat_points_heat;

function geoJson2heat(geojson, weight) {
  return geojson.features.map(function(feature) {
    return [
      feature.geometry.coordinates[1],
      feature.geometry.coordinates[0],
      feature.properties[weight]
    ];
  });
}

function identityLayerGen( filterFn ) {

  var data = punts_per_identitats2;
  if ( filterFn ) {
    var filteredFeatures = [];
    for (let feature of punts_per_identitats2.features ) {
      if ( filterFn( feature )){
        filteredFeatures.push( feature );
      }
    }
    data.features = filteredFeatures;
  }

  var punts_per_identitat_heat = geoJson2heat( data, 'neighborhood_identity' );

  var layer = new L.heatLayer(punts_per_identitat_heat, {
    radius: 25,
    max: 10,
    minOpacity: 0.8,
    gradient: {
      0: '#d7191c',
      0.60: '#fdae61',
      0.80:'#ffffbf',
      0.85: '#BE788D',
      1: '#F90527'
    }
  });
  layer_identitat_points_heat = layer;
  return layer;
}

layer_identitat_points_heat = identityLayerGen();