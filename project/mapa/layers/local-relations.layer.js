var local_relationships_layer;

function localRelationsLayerGen( filterFn ) {
  var layer = new L.geoJson(local_relationships, {
    filter: filterFn
  });
  local_relationships_layer = layer;
  return layer;
}

local_relationships_layer = localRelationsLayerGen();