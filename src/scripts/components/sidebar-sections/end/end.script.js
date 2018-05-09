export default {
  name: "end-component",
  props: [ "offsetH", "offsetW", "map", "visible" ],
  methods: {
    generateData( e ) {
      this.$emit("generate-data", e );
    }
  }
}