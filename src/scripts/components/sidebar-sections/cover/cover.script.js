export default {
  name: "cover-component",
  props: [ "offset", "layer" ],
  methods: {
    onStart( evt ) {
      location.hash = 'map/personal/safaretjos'
    },
    isReady() {
      this.$emit("im-ready");
      return true;
    }
  },
  mounted: function() {
    this.isReady();
  }
}