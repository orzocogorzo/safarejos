import BaseController from './base-controller';
import * as _ from 'lodash';

const FormController = (function(){

  function filterMapData( id ){
    let index;
    this.map.__data__.features.map(( f,i ) => {
      if ( f.properties._id == id ) {
        index = i;
      }
    });
    index != undefined && this.map.__data__.features.splice(index,1);
  }

  class FormController extends BaseController {

    constructor( options ) {
      super( options || {} );
    }

    unbind( ) {
      this.map.eachLayer((layer) => {
        layer.off('click', ( e ) => {
          filterMapData.call( this, e.sourceTarget.feature.properties._id );
          this.map.removeLayer(e.sourceTarget);
        });
      });
      super.unbind( );
    }

    captureInteraction( ) {
      this.map.eachLayer((layer) => {
        if ( layer.options.isOverlay ) {
          layer.on('click', ( e ) => {
            filterMapData.call( this, e.sourceTarget.feature.properties._id );
            this.map.removeLayer(e.sourceTarget);
          });
        }
      });
    }


  };

  return FormController;

})();

export default FormController;