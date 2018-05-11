import baseSubsection from '../base-subsection/base-subsection.component';

const component = {
  name: "end-component",
  methods: {
    generateData( e ) {
      this.$emit("generate-data", e );
    }
  }
};

export default baseSubsection.extend( component );