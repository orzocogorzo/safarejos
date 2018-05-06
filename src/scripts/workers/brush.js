import BaseController from './base-controller';
import * as _ from 'lodash';

const BrushController = (function(){

  // private code block

  function onMouseDown( evt ) {
    _state.down = true;
    _state.up = false;

    if ( this.collection ) {
      currentFeature = this.genFeature( 'LineString' );
      index++;
    } else {
      this.genCollection();
      this.genLayer();
      currentFeature = this.genFeature( 'LineString' );
      index++;
    }
  }

  function onMouseMove( evt ) {
    if ( _state.down ) {
      // console.log( evt, this.mapCoords );
      currentFeature.geometry.coordinates.push([ this.mapCoords.lng, this.mapCoords.lat ]);
      
      if ( index != len ) {
        this.collection.features.push( currentFeature );
        len++;
      }

      this.layer.clearLayers();
      this.layer.addData( this.collection );

    }
  }

  function onMouseUp( evt ) {
    _state.down = false;
    _state.up = true;
    currentFeature = undefined;
  }

  const _state = {
    down: false,
    up: true
  }

  let currentFeature;
  let index = 0;
  let len = 0;

  class BrushController extends BaseController {

    constructor( options ) {
      super( options || {} );

      this.eventsCallbacks = options.eventsCallbacks || {
        "mousemove": _.throttle(( e ) => onMouseMove.bind( this )( e ), 50 ),
        "mousedown": onMouseDown.bind( this ),
        "mouseup": onMouseUp.bind( this )
      };

      return this;
    }

    unbind( ) {
      super.unbind( );
      setTimeout(() => this.collection = undefined, 0);
      return this.collection;
    }

  }

  return BrushController;

})();

export default BrushController;