import baseSubsection from '../base-subsection/base-subsection.component';

const component = {
  name: "equipments-component",
  data: function() {
    return {
      selection: null,
      h_rawData: undefined,
      h_modelName: "equipments"
    }
  },
  methods: {
    getData: function() {
      return this.selection;
    },

    onEachFeature( feature, layer ) {
      layer.on({
        click: this.onFeatureClick,
        mouseover: this.onMouseOver,
        mouseout: this.onMouseOut
      });
    },

    onFeatureClick( e ) {
      const feature = e.target.toGeoJSON();
      this.selection = this.selection || [];
      this.selection.push( { lng: feature.properties.Longitud_X, lat: feature.properties.Latitud_Y } );

      e.target.setStyle({
        fillColor: "#f00"
      });
    },

    onResetMapSelection( e ) {
      this.selection = null;
      this.$emit("reset-map-selection");
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
        });
      }

      const self = this;
      const req = new XMLHttpRequest();
      const url = location.protocol + '//' + location.host +'/' + environment.apiURL + "/equipaments.json";
      req.open( "get", url, true );
      req.onreadystatechange = function( ev ) {
        if ( this.status === 200 && this.readyState === 4 ) {
          self.h_rawData = JSON.parse( this.responseText);
          self.$emit("add-map-data", self.h_rawData, {
            onEachFeature: self.onEachFeature
          }, { latlng: [ 41.43625986499152, 2.2115993499755864 ], zoom: 15 });
        }
      }
      req.send();
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
}

export default baseSubsection.extend( component );