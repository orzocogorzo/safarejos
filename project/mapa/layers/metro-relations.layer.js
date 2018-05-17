var exampleFlowmapLayer;
var canvasRenderer;

function style_flows(geoJsonFeature) {
  // use leaflet's path styling options

  // since the GeoJSON feature properties are modified by the layer,
  // developers can rely on the "isOrigin" property to set different
  // symbols for origin vs destination CircleMarker stylings

  if (geoJsonFeature.properties.isOrigin) {
    return {
      renderer: canvasRenderer, // recommended to use your own L.canvas()
      radius: 5,
      weight: 1,
      color: 'rgb(187, 223, 0)',
      fillColor: 'rgba(0, 0, 0, 1)',
      fillOpacity: 1
    };
  } else {
    return {
      renderer: canvasRenderer,
      radius: 7.5,
      weight: 1,
      color: 'rgb(255, 255, 255)',
      fillColor: 'rgb(255, 255, 255)',
      fillOpacity: 0.7
    };
  }
}


function metroRelationsGen( filterFn ) {

  canvasRenderer = L.canvas();

  var data = points_flows_easy;
  if ( filterFn ) {
    var filteredFeatures = [];
    for (let feature of points_flows_easy.features) {
      if ( filterFn( feature )) {
        filteredFeatures.push( feature );
      }
    }
    data.features = filteredFeatures;
  }
  var layer = new L.canvasFlowmapLayer(data, {
    style:style_flows,
    // required property for this custom layer,
    // which relies on the property names of your own data
    originAndDestinationFieldIds: {
      originUniqueIdField: 'id_start',
      originGeometry: {
        x: 'x_start',
        y: 'y_start'
      },
      destinationUniqueIdField: 'id_end',
      destinationGeometry: {
        x: 'x_end',
        y: 'y_end'
      },
    },
  
    // some custom options
    pathDisplayMode: 'all',
    animationStarted: true,
    animationEasingFamily: 'Cubic',
    animationEasingType: 'In',
    animationDuration: 2000
  }).addTo(map);

  var popUp= L.popup();

  var selection = {};
  layer.on('click', function(e) {
    if ( selection.lng === e.latlng.lng && selection.lat === e.latlng.lat ) {
      layer.clearAllPathSelections();
      selection = {};
      return;
    } else {
      selection = e.latlng;
    }

    if (e.sharedOriginFeatures.length) {
      layer.selectFeaturesForPathDisplay(e.sharedOriginFeatures, 'SELECTION_NEW');
      map.fitBounds(e.target.getBounds());
    }
    if (e.sharedDestinationFeatures.length) {
      layer.selectFeaturesForPathDisplay(e.sharedDestinationFeatures, 'SELECTION_NEW');
      map.fitBounds(e.target.getBounds());
    }
    if (!e.isOriginFeature){
      popUp.setLatLng(e.latlng);
      popUp.setContent(e.layer.feature.properties.Facility);
      popUp.openOn(map);
    }
  });
  exampleFlowmapLayer = layer;
  return layer;

}

// exampleFlowmapLayer = metroRelationsGen();
// exampleFlowmapLayer.addTo(map);