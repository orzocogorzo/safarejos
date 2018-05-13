import BaseController from './base-controller';
import L from 'leaflet/dist/leaflet';

const FormController = (function(){

  // private code block

  function buildPopupTemplate( properties ) {
    let stringHTMLtemplate = '';

    for ( let prop of this.properties ) {
      stringHTMLtemplate += ( '<div class="form-input-wrapper"><label class="popup-form-label">' +
        prop +
      '</label><input name="' +
        prop + 
      '" type="text" ' + 
        ( properties[prop] && ( 'value="' + properties[prop] + '"' ) || '' ) +
      ' class="popup-form-input"/></div>' )
    }

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class','popup-form-wrapper');
    wrapper.innerHTML = stringHTMLtemplate;

    const inputs = wrapper.getElementsByTagName('input');
    for ( let input of inputs ) {
      input.addEventListener('change', (e) => {

        let index;
        this.map.__data__.features.map(( f, i ) => {
          if ( f.properties._id == properties._id ) index = i
        });

        properties[e.currentTarget.name] = e.currentTarget.value;
        this.map.__data__.features[index].properties[e.currentTarget.name] = e.currentTarget.value;
      });
    }
    return wrapper;
  }
  
  function onLayerClick( e ) {
    const popUp = L.popup()
    .setLatLng( e.latlng )
    .setContent( buildPopupTemplate.call( this, e.sourceTarget.feature.properties ))
    .openOn( this.map );
  }

  class FormController extends BaseController {

    constructor( options ) {
      super( options || {} );
    }

    unbind( ) {
      this.map.eachLayer((layer) => {
        layer.off('click');
      });
      super.unbind( );
    }

    captureInteraction( ) {
      this.map.eachLayer((layer) => {
        if ( layer.options.isOverlay ) {
          layer.on('click', onLayerClick.bind(this));
        }
      });
    }

  };

  return FormController;

})();

export default FormController;