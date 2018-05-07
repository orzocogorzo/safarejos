import BaseController from './base-controller';
import * as _ from 'lodash';

const PolygonController = (function(){

  // private code block

  function pushCoordinate() {
    if ( _state.draw ) {
      currentFeature.geometry.coordinates[coordIndex].push([ this.mapCoords.lng, this.mapCoords.lat ]);
    } else {
      currentFeature = this.genFeature( 'Polygon' );
      this.collection.features.push( currentFeature );
      collIndex++
      currentFeature.geometry.coordinates.push([[ this.mapCoords.lng, this.mapCoords.lat ]]);
      currentFeature.geometry.coordinates[0].push([ this.mapCoords.lng, this.mapCoords.lat ]);
      _state.draw = true;
      coordIndex = 0
    }
  }

  function onMouseMove() {
    if ( _state.draw ) {
      let last = this.collection.features[collIndex];
      last.geometry.coordinates[coordIndex].pop();
      last.geometry.coordinates[coordIndex].push([ this.mapCoords.lng, this.mapCoords.lat ]);
      this.layer.clearLayers();
      this.layer.addData( this.collection );
    }
  }
  
  function onClick() {
    if ( !this.collection ) {
      this.genCollection();
      this.genLayer();
    }

    pushCoordinate.call( this );
    this.layer.clearLayers();
    this.layer.addData( this.collection );
  }

  function onDoubleClick( lastCoord ) {
    currentFeature.geometry.coordinates[coordIndex].splice(currentFeature.geometry.coordinates[coordIndex].length-1, 1);
    currentFeature.geometry.coordinates[coordIndex].concat( lastCoord );
    _state.draw = false;
    waitter = undefined;
    this.layer.clearLayers();
    this.layer.addData( this.collection );
  }

  function clickHandler( evt ) {
    if ( waitter ) {
      clearTimeout( throttler );
    }

    let lastCoord = currentFeature && currentFeature.geometry.coordinates[coordIndex] && JSON.parse(JSON.stringify(currentFeature.geometry.coordinates[coordIndex][currentFeature.geometry.coordinates[coordIndex].length-1])) || [];
    waitter = setTimeout( () => onDoubleClick.call( this, lastCoord), 400 )
    throttler = setTimeout(() => {
      clearTimeout( waitter );
    }, 350 );

    onClick.call( this );
  }

  const _state = {
    draw: false
  }

  let currentFeature;
  let waitter;
  let throttler;
  let coordIndex = -1;
  let collIndex = -1;

  class PolygonController extends BaseController {

    constructor( options ) {
      super( options || {} );

      this.eventsCallbacks = options.eventsCallbacks || {
        "mousemove": _.throttle(( e ) => onMouseMove.bind( this )( e ), 130 ),
        "click": clickHandler.bind( this )
      };

      this.layerStyle = {
        "lineJoin": true,
        "weight": 4,
        "dashArray": '8, 8',
        "dashOffset": "10",
        "color": this.color
      };

      return this;
    }

    unbind( ) {
      super.unbind( );
      setTimeout(() => this.collection = undefined, 0);
      coordIndex = -1;
      collIndex = -1;
      _state.draw = false;
      return this.collection;
    }

    static id() {
      return "line-controller";
    }
    
  };

  return PolygonController;

})();

export default PolygonController;