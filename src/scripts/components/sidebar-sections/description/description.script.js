import baseSubsection from '../base-subsection/base-subsection.component';

const component = {
  name: "description-component",
  mounted: function() {
    this.$watch( "$data", () => {
      this.isReady();
    },{
      deep: true
    });
  },
  data: function() {
    return {
      description: null,
      h_modelName: "description"
    }
  },
  // watch: {
  //   description( val ) {
  //     console.log( val );
  //   }
  // }
}

export default baseSubsection.extend( component );