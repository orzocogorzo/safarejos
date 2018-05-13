var FeatureID = -1;

const BaseController = (function(){

//   // private code block

  function _log( evt ) {
    console.log( evt );
  }

  const FeatureCollection = (function() {
    return {
      "type" : "FeatureCollection",
      "features" : []
    };
  });

  const Feature = (function( type, subsection ) {
    FeatureID++;
    return {
      "type": "Feature",
      "geometry": {
        "type": type,
        "coordinates": []
      },
      "properties": {
        "_id": FeatureID,
        "_type": subsection
      }
    };
  });
    
  class BaseController {

    constructor( options ) {
      // public attributes
      // this.map = options.map;
      // this.color = options.color;
      // this.canvas = options.canvas;
      Object.keys( options ).map(( k ) => {
        this[k] = options[k];
      });

      this.mapCoords = undefined;
      this.active = null;

      this.events = options.events || {
        "touchstart": true,
        "touchmove": true,
        "touchend": true,
        "touchmove": true,
        "mousemove": true,
        "mousedown": true,
        "mouseup": true,
        "click": true
      };

      this.eventsCallbacks = options.eventsCallbacks || {
        "touchstart": _log,
        "touchmove": _log,
        "touchend": _log,
        "touchmove": _log,
        "mousemove": _log,
        "mousedown": _log,
        "mouseup": _log,
        "click": _log
      };

      this.layerStyle = {
        "lineJoin": true,
        "weight": 10,
        "color": this.color
      };

      this.map.on('storedata', ( function(e) {
        if ( this.active ) {
          this.map.__data__.features = this.collection && this.map.__data__.features.concat(this.collection.features) 
            || this.map.__data__.features;
          this.genCollection()
          this.genLayer();
        }
      }).bind(this));

    }

    // public methods
    captureInteraction( ) {
      Object.keys( this.events ).map(k => {
        this.events[k] && this.canvas.addEventListener(k, this.eventsCallbacks[k] );
      });

      this.map.on('touchmove', ( evt ) => {
        this.mapCoords = evt.latlng;
      });

      this.map.on('mousemove', ( evt ) => {
        this.mapCoords = evt.latlng;
      });

    }

    unbind( ) {
      Object.keys( this.events ).map(k => {
        this.events[k] && this.canvas.removeEventListener( k, this.eventsCallbacks[k] );
      });

      this.map.off('touchmove', ( evt ) => {
        this.mapCoords = evt.latlng;
      });
      
      this.map.off('mousemove', ( evt ) => {
        this.mapCoords = evt.latlng;
      });

      setTimeout(() => {
        this.genCollection()
        this.genLayer()
      }, 0);

      return this.collection;

    }

    genCollection(){
      this.collection = new FeatureCollection();
    }

    genFeature( type ) {
      return new Feature( type, this.type );
    }

    clearData() {
      if ( this.collection ) {
        this.map.eachLayer( layer => {
          layer.options.isOverlay && this.map.removeLayer( layer );
        });
        delete this.collection;
      }
    }

    genLayer() {
      this.layer = L.geoJSON( this.collection, {
        style: this.layerStyle,
        pointToLayer: this.pointToLayer,
        isOverlay: true
      });
      this.layer.addTo( this.map );
    }

    setColor( color ) {
      this.color = color;
      this.layerStyle.color = this.color;
      this.layer && this.layer.setStyle(this.layerStyle);
    }

    setSubsection( type ) {
      this.type = type;
    }

    static id() {
      return "base-controller";
    }
  };

  return BaseController;

})();

export default BaseController;