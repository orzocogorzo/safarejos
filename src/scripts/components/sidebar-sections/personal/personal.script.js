import SubsectionController from '../../../workers/subsection-controller.component.vue';
import baseSubsection from '../base-subsection/base-subsection.component';

const component = {
  name: "personal-component",
  components: {
    SubsectionController
  },
  mounted: function() {
    this.h_container = this.$el.getElementsByClassName('content-wrapper')[0];
    this.$watch( "$data", () => {
      this.isReady();
    },{
      deep: true
    });
  },
  data: function() {
    return {
      age: null,
      gender: null,
      social_status: null,
      h_container: null,
      h_modelName: "personal"
    }
  },
  methods: {
    onGenderChange( e ) {
      this.gender = e.currentTarget.checked && e.currentTarget.value;
    },
    onSocialChange( e ) {
      this.social_status = e.currentTarget.checked && e.currentTarget.value;
    }
  }
}

export default baseSubsection.extend( component );