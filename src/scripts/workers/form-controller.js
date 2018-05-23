import BaseController from './base-controller';
import L from 'leaflet/dist/leaflet';
import lang from '../lng/cat';

const FormController = (function(){

  // private code block

  function buildSelectTemplate( prop, featurePropsVal ) {
    let contentStr = '';
    for ( let opt of prop.options ) {
      contentStr += `<option value="${opt}"  ${ opt == featurePropsVal && 'selected' || '' }>${lang[opt]}</option>`;
    }
    return contentStr;
  }
  
  function buildPopupInput( prop, featurePropsVal ) {
    let contentStr;
    switch( prop.type ) {
      case "text":
        contentStr = `<input type="${prop.type}" name="${prop.name}" value="${ featurePropsVal || '' }" class="popup-form-input"></input>`;
        break;
      case "select":
        contentStr = `<select  name="${prop.name}" class="popup-form-input">${ buildSelectTemplate( prop, featurePropsVal ) }</select>`;
        break;
      default: 
        contentStr = `<input type="${prop.type}" name="${prop}" value="${ featurePropsVal || '' }" class="popup-form-input" ></input>`;
        break;
    }

    return contentStr;
  }

  function buildPopupTemplate( featureProps ) {
    let stringHTMLtemplate = '';

    for ( let prop of this.properties ) {
      stringHTMLtemplate += (
        '<div class="form-input-wrapper"><label class="popup-form-label">'
        + lang[prop.name]
        + '</label>'
        + buildPopupInput( prop, featureProps[prop.name] )
        + '</div>'
      )
    }

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class','popup-form-wrapper');
    wrapper.innerHTML = stringHTMLtemplate;

    const inputs = wrapper.getElementsByClassName('popup-form-input');
    for ( let input of inputs ) {
      input.addEventListener('change', ( e ) => {

        let index;
        this.map.__data__.features.map(( f, i ) => {
          if ( f.properties._id == featureProps._id ) index = i
        });

        featureProps[e.currentTarget.name] = e.currentTarget.value;
        this.map.__data__.features[index].properties[e.currentTarget.name] = e.currentTarget.value;
      });
    }
    return wrapper;
  }
  
  function onLayerClick( e ) {
    L.popup()
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