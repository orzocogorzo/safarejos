import BaseController from './base-controller';
import * as _ from 'lodash';

import Icon from '../../assets/images/marker-icon.svg';
import ShadowIcon from '../../assets/images/marker-icon-shadow.svg'

const PointController = (function(){

  // private code block
  
  const icon = L.icon({
    iconUrl: Icon,
    iconSize: [23, 35],
    iconAnchor: [ 12, 38 ],
    popupAnchor: [-3, -76],
    shadowUrl: ShadowIcon,
    shadowSize: [35, 25],
    shadowAnchor: [4, 27]
  });

  function onClick() {
    if ( !this.collection ) {
      this.genCollection();
      this.genLayer();
    }

    let newPoint = this.genFeature( 'Point' );
    newPoint.geometry.coordinates = [ this.mapCoords.lng, this.mapCoords.lat ];

    this.collection.features.push( newPoint )
    this.layer.clearLayers();
    this.layer.addData( this.collection );
  }

  function pointToLayer( point, latlng ) {
    return L.marker( latlng, { icon: icon } ); 
  }
  class PointController extends BaseController {

    constructor( options ) {
      super( options || {} );

      this.pointToLayer = pointToLayer;

      this.eventsCallbacks = options.eventsCallbacks || {
        "click": onClick.bind( this )
      };

      return this;
    }

    unbind( ) {
      super.unbind( );
      setTimeout(() => this.collection = undefined, 0);
      return this.collection;
    }

    static id() {
      return "line-controller";
    }
    
  };

  return PointController;

})();

export default PointController;