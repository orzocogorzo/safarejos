import baseSubsection from '../base-subsection/base-subsection.component';

const component = {
  name: "home-component",
  data: function() {
    return {
      selection: undefined,
      h_rawData: null,
      h_modelName: "home"
    }
  },
  // mounted() {
  //   this.h_rawData = parceles;
  // },
  methods: {
    getData: function() {
      return { lng: this.selection.properties.Longitud_X, lat: this.selection.properties.Latitud_Y }
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

      this.$emit( "im-ready", "home", JSON.parse(JSON.stringify( this.getData() )));
    },

    onMouseOut( e ) {
      const layer = e.target;
      layer.setStyle({
        fillOpacity: 0.25
      });
    },

    onMouseOver( e ) {
      const layer = e.target;
      layer.setStyle({
        fillOpacity: 0.75
      });
    },

    requestData() {
      if ( this.h_rawData ) {
        this.$emit("add-map-data", this.h_rawData, {
          onEachFeature: this.onEachFeature
        }, { latlng: [ 41.43552791811532, 2.2124925255775456 ], zoom: 17 });
        return
      }

      const self = this;
      const req = new XMLHttpRequest();
      const url = location.protocol + '//' + location.host +'/' + environment.apiURL + "/parceles.json";
      req.open( "get", url, true );
      req.onreadystatechange = function( ev ) {
        if ( this.status === 200 && this.readyState === 4 ) {
          self.h_rawData = JSON.parse( this.responseText);
          self.$emit("add-map-data", self.h_rawData, {
            onEachFeature: self.onEachFeature
          }, { latlng: [ 41.43552791811532, 2.2124925255775456 ], zoom: 17 });
        }
      }
      req.send();
    }
  },
  watch: {
    selection( val ) {
      this.isReady();
      return val;
    },
    visible( val ) {
      if ( val ) {
        this.requestData();
      }
    }
  }
}

export default baseSubsection.extend( component );