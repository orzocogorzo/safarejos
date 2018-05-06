import MapSection from '../sections/map-section/map-section.vue';
import Vue from 'vue';

const Controller = (function() {

  // private code block

  var _app;

  function _extendComponentAttributes( component, key, obj ) {
    
    if ( typeof component[key] === "function" ) {
      if ( typeof obj != "function" ) {
        console.error("error: Invalid type assignation");
        return;
      }

      component[key] = function() {
        return Object.assign( component[key](), obj() );
      };

    } else if ( Array.isArray( component[key] )) {
      
      if ( !Array.isArray( obj ) ) {
        console.error("error: Invalid type assignation");
        return;
      }

      component[key] = component[key].reduce(( m,d ) => {
        if ( obj.indexOf( d ) === -1 ) {
          m.push( d );
        }
        return m;
      }, []).concat( obj );

    } else if ( component[key] ) {
      if ( typeof obj != "object" && obj.constructor != Object ) {
        console.error("error: Invalid type assignation");
        return;
      }
      Object.assign( component[key] || {}, obj );
    } else {
      component[key] = obj;
    }

    return component;
  }

  function _instantiateComponent( component, config, overwrite ) {
    if ( !overwrite ) {
      if ( config.data ) {
        _extendComponentAttributes( component, "data", config.data );
      }
      if ( config.props ) {
        _extendComponentAttributes( component, "props", config.props );
      }

      const VueComponent = Vue.extend( component );
      return new VueComponent({ propsData: config.propsData });
    } else {  
      const VueComponent = Vue.extend( component );
      return new VueComponent( config );
    }

  }

  function _appendView( Component, config ) {
    const view = _instantiateComponent( Component, config );
    // view.$mount();
    _app.router_component.attachCurrentComponent( view );
    
    // console.log( view, view.$emit, "emitted" );
    view.$emit( 'view-attached', view );
  }
  
  return class Controller {
    
    constructor( appInstance ) {
      // class public properties
      this.routes = {
        '': this.redirectToDefault,
        'map': this.renderMap,  
        'map/:section/:scroll': this.scrollToSection,
      };

      _app = appInstance;
    };

    // class public methods
    redirectToDefault() {
      location.hash = 'map'
    };
  
    renderMap() {
      _appendView.call( this, MapSection, {
        // data: function() { 
        //   return { "title": "MAP SECTION", "message": "Welcome to the map section" }
        // }
        // props: [ "message" ]
        // propsData: [{
        //   "message": "Welcome to the map section"
        // }]
      });
      // console.log('render map');
    };
  
    scrollToSection() {
      console.log('scroll hash');
    };
  };

})();

export default Controller;