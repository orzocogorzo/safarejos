export default {
  name: "cover-component",
  props: [ "offsetH", "offsetW", "layer", "visible" ],
  methods: {
    onStart( evt ) {
      location.hash = 'map/home/0'
    },
    isReady() {
      this.$emit("im-ready");
      return true;
    }
  },
  mounted: function() {
    this.isReady();
  },
  watch: {
    // visible( val ) {
    //   console.log( 'cover', val );
    //   setTimeout(() => {
    //     this.$el.style.width = !val && '0px';
    //   }, 1000 )
    // }
  }
}