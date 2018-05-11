import baseSubsection from '../base-subsection/base-subsection.component';

const component = {
  name: "barrier-component",
  data: function() {
    return {
      h_modes: [ "architecture", "acoustic", "luminic", "social" ],
      h_modelName: "barriers",
      selected: undefined
    }
  },
  watch: {
    visible( val ) {
      if ( val ) {
        this.$emit("clear-map-layers", { latlng: [ 41.43552791811532, 2.2124925255775456 ], zoom: 18 });
      }
    },
    subsection( val ) {
      this.isReady();
    }
  },
  methods: {
    onChangeSubsection( toSection ) {
      this.selected = toSection;
      location.hash = 'map/barriers/' + toSection;
    },
    isReady() {
      this.$emit("im-ready");
      return true;
    },
    onStoreData( e ) {
      this.$emit("store-map-layer", this.h_modelName, this.h_modes[this.subsection] );
      this.selected = undefined;
    }
  }
}

export default baseSubsection.extend( component );