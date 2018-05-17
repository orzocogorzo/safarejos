var parceles_edat_sexe_layer;
function cadastreLayerGen( filterFn ) {
  var layer = new L.geoJson(parceles_edat_sexe /* cadastre_clip_camps */,{
    filter: filterFn,
    style: styleCadastre,
    onEachFeature: onEachFeature
  });
  parceles_edat_sexe_layer = layer;
  return layer;
}

// INTERACTION
var blurredDelay;
function highlightFeature(event){
  var layer = event.target;
  var npl = event.target.feature.properties.NPL_flotants+"<span class=label2>  PLANTES</span>";
  label.innerHTML = npl;//label es el class que he decidit posar al num que es va actualitzant
  layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 1
  });

  clearTimeout(blurredDelay);
  //info.update(layer.feature.properties);
}

function resetHighlight(e) {
    parceles_edat_sexe_layer.resetStyle(e.target);
    
    clearTimeout(blurredDelay);//si li passo una funcio amb delay la para i no sexecuta

    blurredDelay = setTimeout(function(){//setTimeout executa una funcio en un temps
      label.innerHTML = '';
    }, 500 );
    //info.update();
};

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
};

function onEachFeature(feature_A,layer_B){
  layer_B.bindPopup("<h1 class='popup-content'>Plantes Construides: <span class='popup-content2'>"+feature_A.properties.PL_reals+"</span></h1>"+ "<h1 class='popup-content'>Plantes per planejament: <span class=popup-content2>"+feature_A.properties.PL_Planej+"</span></h1>")
  layer_B.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
};

// STYLE
function fillColor(d) {
  return  d < 0 ?  'rgba(255,0,0,0.6)' : 
      d == 0 ?  '#00000055' : 
      d == 1 ?  '#80ff80' : 
      d == 2 ?  '#33ff33' : 
      d == 3 ?  '#00e600' : 
      d == 4 ?   '#00b300' : 
      d == 5 ?   '#009900' :
      d == 6 ?   '#008000' :
      d == 7 ?   '#006600' :
      d == 30 ?   '#004d00' : '#80ff80'; 
};

function color(d) {
  return  d == 0 ?  'white' : d > 0 ? '#009900': '#00000055'; 
};

function weight(d) {
  return  d >= 0 ?  2 : 1; 
};

function styleCadastre(feature) {
  return {
    fillColor: fillColor(feature.properties.NPL_flotants),
    color: color(feature.properties.NPL_flotants),
    weight: weight(feature.properties.NPL_flotants),
    opacity: 0.25,
    fillOpacity: 0.5,
    clickable: true
  };
}

var currentFilterCriteria = {
  home: true,
  dona: true,
  "0-15": true,
  "16-25": true,
  "26-40": true
};

parceles_edat_sexe_layer = cadastreLayerGen();
var currentLayer = parceles_edat_sexe_layer;
currentLayer.addTo(map);
map.fitBounds(currentLayer.getBounds());