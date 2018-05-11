import baseSubsection from '../base-subsection/base-subsection.component';

const component = {
  name: "cover-component",
  modelName: "cover",
  methods: {
    onStart( evt ) {
      location.hash = 'map/home/0'
    }
  }
}

export default baseSubsection.extend( component );