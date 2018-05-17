import baseSubsection from '../base-subsection/base-subsection.component';

const component = {
  name: "path-component",
  data: function() {
    return {
      h_modelName: "paths",
      saved: null
    }
  },
  watch: {
    visible( val ) {
      if ( val ) {
        this.$emit("clear-map-layers", { latlng: [ 41.43552791811532, 2.2124925255775456 ], zoom: 18 });
        location.hash = 'map/paths/1';
      }
    },
    subsection( val ) {
      if ( this.visible ) {
        this.isReady();
      }
    },
    saved( val ) {
      if ( val ) {
        this.isReady();
      }
    }
  },
  methods: {
    isReady() {
      if ( this.saved ) {
        this.$emit("im-ready");
        return true;
      } else {
        return false
      }
    },
    onStoreData( e ) {
      this.$emit("store-map-layer", this.h_modelName, "paths" );
      this.saved = true
    }
  }
}

export default baseSubsection.extend( component );