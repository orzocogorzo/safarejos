import baseSubsection from '../base-subsection/base-subsection.component';

var debouncedEmitter;
const component = {
  name: "social-component",
  data: function() {
    return {
      selection: null,
      h_rawData: undefined,
      h_modelName: "social-network"
    }
  },
  // mounted(){
  //   this.h_rawData = parceles;
  // },
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

    onResetMapSelection( e ) {
      this.selection = null;
      this.$emit("reset-map-selection");
    },

    onFeatureClick( e ) {
      const feature = e.target.toGeoJSON();
      this.selection = this.selection || [];

      // console.log( e.sourceTarget.feature.properties );
      // clearTimeout( debouncedEmitter );
      // this.$emit("open-popup", L.popup()
      //   .setLatLng( e.sourceTarget.getCenter() )
      //   .setContent( e.sourceTarget.feature.properties.NOM_EQUIP )
      // );
      
      let index;
      this.selection.map(( d, i ) => {
        if ( d.id === feature.properties.OBJECTID ) {
          index = i;
        }
      });

      if ( index != undefined ) {
        this.selection.splice(index,1);
        e.target.setStyle({
          fillColor: "#3388ff"
        });
      } else {
        this.selection.push( { id: feature.properties.OBJECTID, lng: feature.properties.Longitud_X, lat: feature.properties.Latitud_Y } );
        e.target.setStyle({
          fillColor: "#f53"
        });
      }

      // this.$emit( "im-ready", "social", JSON.parse(JSON.stringify( this.getData() )));
    },

    onMouseOut( e ) {
      const layer = e.target;
      layer.setStyle({
        fillOpacity: 0.25
      });

      // clearTimeout( debouncedEmitter );
      // this.$emit("close-popup");
    },

    onMouseOver( e ) {
      const layer = e.target;
      layer.setStyle({
        fillOpacity: 0.75
      });

      // clearTimeout( debouncedEmitter );
      // debouncedEmitter = setTimeout(() => {
      //   this.$emit("open-popup", L.popup()
      //     .setLatLng( e.sourceTarget.getCenter() )
      //     .setContent( e.sourceTarget.feature.properties.NOM_EQUIP )
      //   );
      // }, 500 );
    },

    requestData() {
      if ( this.h_rawData ) {
        this.$emit("add-map-data", this.h_rawData, {
          onEachFeature: this.onEachFeature
        }, { latlng: [ 41.43552791811532, 2.2124925255775456 ], zoom: 18 });
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
          }, { latlng: [ 41.43552791811532, 2.2124925255775456 ], zoom: 18 });
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