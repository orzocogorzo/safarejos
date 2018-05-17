import baseSubsection from '../base-subsection/base-subsection.component';
import municipis from '../../../data/municipis';

var debouncedEmitter;

const component = {
  name: "work-component",
  data() {
    return {
      selection: undefined,
      h_rawData: null,
      h_modelName: "work"
    }
  },
  // mounted(){
  //   this.h_rawData = municipis;
  // },
  methods: {
    getData() {
      return this.selection != "no-response" && { lng: this.$data.selection.properties.Longitud_X, lat: this.$data.selection.properties.Latitud_Y } || "no-response";
    },

    onEachFeature( feature, layer ) {
      layer.on({
        click: this.onFeatureClick,
        mouseover: this.onMouseOver,
        mouseout: this.onMouseOut
      });
    },

    onFeatureClick( e ) {
      this.selection = e.target.toGeoJSON();

      e.target._map.eachLayer(layer => {
        if ( layer.options.isAuxiliar ) {
          layer.setStyle({
            fillColor: "#3388ff"
          });
        }
      });

      e.target.setStyle({
        fillColor: "#f53"
      });

      clearTimeout( debouncedEmitter );
      this.$emit("open-popup", L.popup()
        .setLatLng( e.sourceTarget.getCenter() )
        .setContent( e.sourceTarget.feature.properties.Municipi )
      );
    },

    onMouseOut( e ) {
      e.target.setStyle({
        fillOpacity: 0.25
      });

      clearTimeout( debouncedEmitter );
      this.$emit("close-popup");
    },

    onMouseOver( e ) {
      e.target.setStyle({
        fillOpacity: 0.75
      });

      clearTimeout( debouncedEmitter );
      debouncedEmitter = setTimeout(() => {
        this.$emit("open-popup", L.popup()
          .setLatLng( e.sourceTarget.getCenter() )
          .setContent( e.sourceTarget.feature.properties.Municipi )
        );
      }, 500 );
    },

    requestData( ) {      
      if ( this.h_rawData ) {
        this.$emit("add-map-data", this.h_rawData, {
          onEachFeature: this.onEachFeature
        }, { latlng: [ 41.39844522006508, 2.059593200683594 ], zoom: 11 });
        return;
      }
      
      const self = this;
      const req = new XMLHttpRequest();
      const url = location.protocol + '//' + location.host +'/' + environment.apiURL + "/municipis.json";
      req.open( "get", url, true );
      req.onreadystatechange = function( ev ) {
        if ( this.status === 200 && this.readyState === 4 ) {
          self.rawData = JSON.parse( this.responseText );
          self.$emit("add-map-data", self.rawData, {
            onEachFeature: self.onEachFeature
          }, { latlng: [ 41.39844522006508, 2.059593200683594 ], zoom: 11 });
        }
      }
      req.send();
    },

    onContinue(){
      this.selection = "no-response",
      this.$emit( "im-ready", "work", null );
    }
  },
  watch: {
    selection( val ) {
      this.isReady();
    },
    visible( val ) {
      if ( val ) {
        this.requestData();
      }
    }
  }
};

export default baseSubsection.extend( component );