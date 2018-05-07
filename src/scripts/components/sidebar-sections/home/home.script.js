import { read } from "gray-matter";

export default {
  name: "home-component",
  props: [ "offset", "map" ],
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
        this.$emit("im-ready", "home", this.selection );
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

      this.$emit( "im-ready", "home", JSON.parse(JSON.stringify(this.selection)));
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
    }
  },
  mounted: function() {
    this.isReady();
    const self = this;
    const req = new XMLHttpRequest();
    req.open( "get", "http://localhost:8000/data/json/parceles.json", true );
    req.onreadystatechange = function( ev ) {
      if ( this.status === 200 && this.readyState === 4 ) {
        self.rawData = JSON.parse( this.responseText);
        self.$emit("add-map-data", self.rawData, {
          onEachFeature: self.onEachFeature
        });
      }
    }
    req.send();
  },
  watch: {
    selection( val ) {
      this.isReady();
      return val;
    }
  }
}