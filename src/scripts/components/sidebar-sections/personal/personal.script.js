import ScrollController from '../../../workers/scroll-controller.component.vue';

export default {
  name: "personal-component",
  props: [ "offset" ],
  components: {
    ScrollController
  },
  mounted: function() {
    this.isReady();
  },
  data: function() {
    return {
      age: undefined,
      gender: undefined,
      social_status: undefined
    }
  },
  watch: {
    age( val ) {
      this.isReady();
      return val;
    },
    social_status( val ) {
      this.isReady();
      return val;
    },
    gender( val ) {
      this.isReady();
      return val;
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
    onGenderChange( e ) {
      this.gender = e.currentTarget.checked && e.currentTarget.value;
    },
    onSocialChange( e ) {
      this.social_status = e.currentTarget.checked && e.currentTarget.value;
    }
  }
}