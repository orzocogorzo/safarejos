import baseSubsection from '../base-subsection/base-subsection.component';
import SubsectionController from '../../../workers/subsection-controller.component.vue';

const component = {
  name: "identity-component",
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
      communication: null,
      implication: null,
      esteem: null,
      leisure: null,
      experience: null,
      family: null,
      reasons: null,
      h_container: null,
      h_modelName: "identity"
    }
  },
  components: {
    SubsectionController
  },
  methods: {
    onResponseClick( event, key, item ) {
      this[key] = item;
    },
    onReasonsChange( e ) {
      this.reasons = e.currentTarget.checked && e.currentTarget.value;
    }
  }
}

export default baseSubsection.extend( component );