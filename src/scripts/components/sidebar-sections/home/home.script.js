import { read } from "gray-matter";

export default {
  name: "home-component",
  props: [ "offsetH", "offsetW", "map", "visible" ],
  data: function() {
    return {
      selection: false,
      rawData: undefined
    }
  },
  methods: {
    isReady() {
      let ready = this.selection;

      if ( ready ) {
        this.$emit("im-ready", "home", JSON.parse(JSON.stringify({ lng: this.selection.properties.Longitud_X, lat: this.selection.properties.Latitud_Y })));
      }

      return ready;
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

      this.$emit( "im-ready", "home", JSON.parse(JSON.stringify({ lng: this.selection.properties.Longitud_X, lat: this.selection.properties.Latitud_Y })));
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
      this.isReady();

      if ( this.rawData ) {
        this.$emit("add-map-data", this.rawData, {
          onEachFeature: this.onEachFeature
        });
      }

      const self = this;
      const req = new XMLHttpRequest();
      req.open( "get", "http://localhost:8000/data/json/parceles.json", true );
      req.onreadystatechange = function( ev ) {
        if ( this.status === 200 && this.readyState === 4 ) {
          self.rawData = JSON.parse( this.responseText);
          self.$emit("add-map-data", self.rawData, {
            onEachFeature: self.onEachFeature
          }, { latlng: [ 41.43552791811532, 2.2124925255775456 ], zoom: 18 });
        }
      }
      req.send();
    }
  },
  // mounted: function() {

  // },
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