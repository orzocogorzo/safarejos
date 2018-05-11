import baseSubsection from '../base-subsection/base-subsection.component';

const component = {
  name: "work-component",
  data() {
    return {
      selection: undefined,
      rawData: undefined,
      h_modelName: "work"
    }
  },
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
        fillColor: "#f00"
      });
    },

    onMouseOut( e ) {
      e.target.setStyle({
        fillOpacity: 0.25
      });
    },

    onMouseOver( e ) {
      e.target.setStyle({
        fillOpacity: 0.75
      });
    },

    requestData( ) {      
      if ( this.rawData ) {
        this.$emit("add-map-data", this.rawData, {
          onEachFeature: this.onEachFeature
        });
        return;
      }
      
      const self = this;
      const req = new XMLHttpRequest();
      req.open( "get", location.protocol + '//' + location.host +'/' + environment.apiURL + "/municipis.json", true );
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