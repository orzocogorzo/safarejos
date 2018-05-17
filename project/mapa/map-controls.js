var myLayers = [
  {
    name: "Sostre potencial",
    layer: parceles_edat_sexe_layer,
    // graphic: "graphic_1",
    url: "http://www.quadrigram.com/hosting/taller_tematic/identitats/",
    filters: ["dona","home","0-15","16-25","26-40"],
    filterCriteria: {
      home: true,
      dona: true,
      "0-15": true,
      "16-25": true,
      "26-40": true

    },
    // data: parceles_edat_sexe,//data
    // onEachFeature: onEachFeature,
    // style: styleCadastre,
    layerGen: cadastreLayerGen
  },
  {
    name: "Identitats",
    layer: layer_identitat_points_heat,
    // graphic: "graphic_2",
    url: "http://www.quadrigram.com/hosting/taller_tematic/sostre_potencial/",
    filters: ["dona","home", "15-25", "26-35"],
    filterCriteria: {
      home: true,
      dona: true,
      "0-15": true,
      "16-25": true,
      "26-40": true
    },
    // data: punts_per_identitats2,
    layerGen: identityLayerGen
  },
  {
    name:"Percepció de fronteres",
    layer: barriers_layer,
    // graphic: "graphic_3",
    url: "http://www.quadrigram.com/hosting/taller_tematic/fronteres/",
    filters: ["Male","Female",'+ than 45 years old', '0-15 years old', '16-25 years old', '26-45 years old'],
    filterCriteria: {
      home: true,
      dona: true,
      "0-15": true,
      "16-25": true,
      "26-40": true
    },
    // data: punts_per_identitats2,
    layerGen: barriersLayerGen
  },
  {
    name: "Xarxes socials",
    layer: social_relationships_layer,
    // graphic: "graphic_4",
    url: "http://www.quadrigram.com/hosting/taller_tematic/xarxes_socials/",
    filters: ["dona","home", "15-25", "26-35"],
    filterCriteria: {
      home: true,
      dona: true,
      "0-15": true,
      "16-25": true,
      "26-40": true
    },
    // data: social_relationships,
    // onEachFeature: onEachFeature,
    // style: null,
    layerGen: socialNetworkLayerGen    
  },
  {
    name: "Recorreguts",
    layer: paths_layer,
    // graphic: "graphic_5",
    url: "http://www.quadrigram.com/hosting/taller_tematic/relcions_locals/",
    filters: ["dona","home", "15-25", "26-35"],
    filterCriteria: {
      home: true,
      dona: true,
      "0-15": true,
      "16-25": true,
      "26-40": true
    },
    // data: paths,
    // onEachFeature: onEachFeaturePaths,
    // style: stylePaths,
    layerGen: pathsLayerGen
  },
  {
    name: "Relacions locals",
    layer: local_relationships_layer,
    // graphic: "graphic_6",
    url: "http://www.quadrigram.com/hosting/taller_tematic/recorreguts/",
    filters: ["dona","home", "15-25", "26-35"],
    filterCriteria: {
      home: true,
      dona: true,
      "0-15": true,
      "16-25": true,
      "26-40": true
    },
    // data: local_relationships,
    // onEachFeature: onEachFeature,
    layerGen: localRelationsLayerGen
  },
  {
    name: "Relacions metropolitanes",
    layer: exampleFlowmapLayer,
    // graphic: "graphic_7" ,
    url: "http://www.quadrigram.com/hosting/taller_tematic/relacions_metropolitanes/",
    filters: ["dona","home", "15-25", "26-35"],
    filterCriteria: {
      home: true,
      dona: true,
      "0-15": true,
      "16-25": true,
      "26-40": true
    },
    layerGen: metroRelationsGen
  }
];

//control layers
for (let enterLayer of myLayers){
  var htmlEl = document.createElement('div');
  htmlEl.setAttribute('class','layers-list-item');
  htmlEl.innerText = enterLayer.name;

  layers.appendChild(htmlEl);

  // binding events
  
  htmlEl.addEventListener('click', function(){
    // for (let exitLayer of myLayers){
    //   map.removeLayer(exitLayer.layer);
    // }
    if ( currentLayer ) {
      map.removeLayer( currentLayer );
    }

    //update map
    //map.addLayer(enterLayer.layer);
    enterLayer.layer = enterLayer.layerGen();
    if ( enterLayer.name != "Relacions metropolitanes" ) {
      enterLayer.layer.addTo(map);
    }

    currentLayer = enterLayer.layer;
    currentFilterCriteria = enterLayer.filterCriteria;

    map.fitBounds(currentLayer.getBounds());

    // quadrigram graphs update
    graphicContainer.getElementsByTagName('iframe')[0].setAttribute('src', enterLayer.url);

    // filters update
    var filtersHTMLString = '';
    for (let filter of enterLayer.filters ) {
      filtersHTMLString += '<div class="option-wrapper"><div class="option-btn" >'+ filter + '</div></div>';
    }

    filtersContainer.innerHTML = filtersHTMLString;

    var buttons = filtersContainer.getElementsByClassName('option-btn');

    for (let index in buttons){
      btn = buttons[index];
      if ( btn.addEventListener ) {
        btn.addEventListener('click', function(e) {
          onFilterButtonClick( e, enterLayer.filters[index], enterLayer );
        });
      }
    }
  });
}

function onFilterButtonClick( e, filterValue, enterLayer ) {
  var button = e.currentTarget;
  button.classList.toggle('selected');// toggle removes the class "selected" if it has it or adds it if i doesn't have it
  currentFilterCriteria[filterValue] = !currentFilterCriteria[filterValue]; //per passar de true a false
  showLayer( enterLayer );
}

function showLayer( enterLayer ){

  if ( currentLayer  ) {
    map.removeLayer( currentLayer );
  }

  enterLayer.layer  = enterLayer.layerGen( filterFn );
  currentLayer = enterLayer.layer;

  if ( enterLayer.name != "Relacions metropolitanes" ) {
    currentLayer.addTo(map);
  }
  map.fitBounds(currentLayer.getBounds());
}

var buttons = filtersContainer.getElementsByClassName('option-btn');
  for (let index in buttons) {
    btn = buttons[index];
    if ( btn.addEventListener ) {
      btn.addEventListener('click', function(e) {
        onFilterButtonClick( e, myLayers[0].filters[index], myLayers[0] );
      });
  }
}

function filterFn( feature ){
  var isValid = true;
  Object.keys(feature.properties).map( function( k ) {
    if (currentFilterCriteria[feature.properties[k]]!=undefined){
      isValid = isValid && Boolean(currentFilterCriteria[feature.properties[k]]);
    }
  });
  return isValid;
}