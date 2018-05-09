import SubsectionController from '../../../workers/subsection-controller.component.vue';

export default {
  name: "personal-component",
  props: [ "offsetH", "offsetW", "subsection", "visible" ],
  components: {
    SubsectionController
  },
  mounted: function() {
    this.container = this.$el.getElementsByClassName('content-wrapper')[0];
    this.isReady();
  },
  data: function() {
    return {
      age: undefined,
      gender: undefined,
      social_status: undefined,
      container: undefined,
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
    },
    subsection( val ) {
      if ( this.container ) {
        this.container.style.marginLeft = (this.offsetW * val * -1) + 'px';
      }
      return val;
    },
    visible( val ) {
      if ( val ) {
        setTimeout(() => {
          this.container.style.display = "flex";
        }, 2000 );
      } else {
        this.container.style.display = "none";
      }
    }
  },
  methods: {
    isReady() {
      let ready = Object.keys(this.$data).reduce(( m, k ) => {
        m = m && this.$data[k] != undefined;
        return m;
      }, true );

      if ( ready ) {
        this.$emit("im-ready", "personal", JSON.parse(JSON.stringify({age: this.age, gender: this.gender, social_status: this.social_status })));
      }

      return ready; 
    },
    onGenderChange( e ) {
      this.gender = e.currentTarget.checked && e.currentTarget.value;
    },
    onSocialChange( e ) {
      this.social_status = e.currentTarget.checked && e.currentTarget.value;
    },
    onInputChange( e,i ) {
      // location.hash = 'map/personal/' + i;
      // this.container.style.marginLeft = (this.offsetW * i * -1) + 'px';
    }
  }
}