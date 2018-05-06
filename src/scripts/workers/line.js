import BaseController from './base-controller';
import * as _ from 'lodash';

const LineController = (function(){

  // private code block

  function pushCoordinate() {
    if ( _state.draw ) {
      currentFeature.geometry.coordinates.push([ this.mapCoords.lng, this.mapCoords.lat ]);
    } else {
      currentFeature = this.genFeature( 'LineString' );
      this.collection.features.push( currentFeature );
      currentFeature.geometry.coordinates.push([ this.mapCoords.lng, this.mapCoords.lat ]);
      currentFeature.geometry.coordinates.push([ this.mapCoords.lng, this.mapCoords.lat ]);
      _state.draw = true;
    }
  }

  function onMouseMove() {
    if ( _state.draw ) {
      let last = this.collection.features[this.collection.features.length-1]
      last.geometry.coordinates.pop();
      last.geometry.coordinates.push([ this.mapCoords.lng, this.mapCoords.lat ]);
      // this.collection.features.push( last );
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
    currentFeature.geometry.coordinates.splice(currentFeature.geometry.coordinates.length-2, 2);
    currentFeature.geometry.coordinates.push( lastCoord );
    _state.draw = false;
    waitter = undefined;
    this.layer.clearLayers();
    this.layer.addData( this.collection );
  }

  function clickHandler( evt ) {
    if ( waitter ) {
      clearTimeout( throttler );
    }

    let lastCoord = currentFeature && JSON.parse(JSON.stringify(currentFeature.geometry.coordinates[currentFeature.geometry.coordinates.length-1])) || [];
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
  // let collection;
  // let layer;
  let waitter;
  let throttler;

  class LineController extends BaseController {

    constructor( options ) {
      super( options || {} );

      this.eventsCallbacks = options.eventsCallbacks || {
        "mousemove": _.throttle(( e ) => onMouseMove.bind( this )( e ), 130 ),
        "click": clickHandler.bind( this )
      };

      return this;
    }

    unbind( ) {
      super.unbind( );
      setTimeout(() => this.collection = undefined, 0);
      return this.collection;
    }
  }

  return LineController;

})();

export default LineController;