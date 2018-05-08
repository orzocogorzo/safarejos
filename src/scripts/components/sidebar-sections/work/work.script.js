export default {
  name: "work-component",
  props: [ "offsetH", "offsetW", "subsection", "visible" ],
  data() {
    return {
      selection: undefined,
      rawData: undefined
    }
  },
  methods: {
    isReady() {
      let ready = Object.keys(this.$data).reduce(( m, k ) => {
        m = m && this.$data[k] != undefined;
        return m;
      }, true );

      if ( ready ) {
        this.$emit("im-ready", "personal", JSON.parse(JSON.stringify(this.$data)));
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
    },

    requestData( ) {
      this.isReady();
      
      if ( this.rawData ) {
        this.$emit("add-map-data", this.rawData, {
          onEachFeature: this.onEachFeature
        });
        return;
      }
      
      const self = this;
      const req = new XMLHttpRequest();
      req.open( "get", "http://localhost:8000/data/json/municipis.json", true );
      req.onreadystatechange = function( ev ) {
        if ( this.status === 200 && this.readyState === 4 ) {
          self.rawData = JSON.parse( this.responseText );
          self.$emit("add-map-data", self.rawData, {
            onEachFeature: self.onEachFeature
          }, { latlng: [ 41.39844522006508, 2.059593200683594 ], zoom: 11 });
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
};