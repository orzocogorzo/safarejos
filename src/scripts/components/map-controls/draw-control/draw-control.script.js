import BrushController from '../../../workers/brush';
import LineController from '../../../workers/line';

export default {
  name: "draw-control",
  props: [ "map" ],
  data() {
    return {
      options: [
        {
          name: "drag",
          active: true
        },
        {
          name: "brush",
          active: false
        },
        {
          name: "point",
          active: false
        },
        {
          name: "line",
          active: false
        },
        {
          name: "polygon",
          active: false
        },
        {
          name: "eraser",
          active: false
        }
      ],
      hidden: true,
      controllers: {
        brush: null
      },
      controller: null,
      features: {
        "type": "FeaturesCollection",
        "features": []
      }
    }
  },
  methods: {
    toggleVisibility() {
      this.hidden = !this.hidden;
    },
    onOptionClicked( evt, option ) {
      this.options.map(d => d.active = false);
      option.active = !option.active;
      this.selectMode( option.name );
    },

    selectMode( name ) {
      if (name === "eraser" ) {
        this.features.features = [];
        this.controller.clearData();
      } else if ( name != "drag" ) {
        this.$emit("mode-change", { drag: false });
        // delete this.controller;
        this.controller = this.controllers[ name ];
        this.controller.captureInteraction();
      } else {
        this.$emit("mode-change", { drag: true });
        let result = this.controller.unbind();
        this.features.features = this.features.features.concat( result && result.features || [] );
        // console.log( this.features.features );
        // this.controller = null;
      }
    },

    setupControllers() {
      this.controllers.brush = new BrushController({
        map: this.map,
        color: '#7d7',
        canvas: document.getElementById('map')
      });

      this.controllers.line = new LineController({
        map: this.map,
        color: '#7d7',
        canvas: document.getElementById('map')
      });
    }
  },
  watch: {
    map: function( val ) {
      if ( val ) {
        this.setupControllers();
      }
      return val;
    }
  }
}