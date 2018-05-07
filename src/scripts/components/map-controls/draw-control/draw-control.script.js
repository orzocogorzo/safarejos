import BrushController from '../../../workers/brush.controller';
import LineController from '../../../workers/line.controller';
import PolygonController from '../../../workers/polygon.controller';
import PointController from '../../../workers/point-controller';

export default {
  name: "draw-control",
  props: [ "map" ],
  data() {
    return {
      options: [
        {
          name: "drag",
          active: true,
          controller: "l-pan-controller"
        },
        {
          name: "brush",
          active: false,
          controller: "brush-controller"
        },
        {
          name: "point",
          active: false,
          controller: "point-controller"
        },
        {
          name: "line",
          active: false,
          controller: "line-controller"
        },
        {
          name: "polygon",
          active: false,
          controller: "polygon-controller"
        },
        {
          name: "eraser",
          active: false,
          controller: "eraser"
        }
      ],
      hidden: true,
      controllers: {
        "brush-controller": null,
        "line-controller": null,
        "point-controller": null,
        "polygon-controller": null
      },
      controller: null,
      features: {
        "type": "FeaturesCollection",
        "features": []
      },
      color: '#900C3F' //'#C70039'
    }
  },
  
  methods: {
    toggleVisibility() {
      this.hidden = !this.hidden;
    },
    onOptionClicked( evt, option ) {
      this.options.map(d => d.active = false);
      option.active = !option.active;
      this.selectMode( option.controller );
    },

    storeMapData() {
      let result = this.controller && this.controller.unbind() || { features: [] };
      this.features.features = this.features.features.concat( result.features );
    },

    clearMapData() {
      this.controller && this.controller.clearData() || this.map.eachLayer(layer => {
        layer.options.isOverlay && this.map.removeLayer( layer );
      });
      this.features.features = [];
    },

    selectMode( controller ) {
      if (controller === "eraser" ) {
        this.clearMapData();
      } else if ( controller != "l-pan-controller" ) {
        this.$emit("mode-change", { drag: false });
        this.storeMapData();
        this.controller = this.controllers[ controller ];
        this.controller.captureInteraction();
      } else {
        this.$emit("mode-change", { drag: true });
        this.storeMapData();
      }
    },

    setupControllers() {
      const mapEl = document.getElementById('map');
      this.controllers["brush-controller"] = new BrushController({
        map: this.map,
        color: this.color,
        canvas: mapEl
      });

      this.controllers["line-controller"] = new LineController({
        map: this.map,
        color: this.color,
        canvas: mapEl
      });

      this.controllers["polygon-controller"] = new PolygonController({
        map: this.map,
        color: this.color,
        canvas: mapEl
      });

      this.controllers["point-controller"] = new PointController({
        map: this.map,
        color: this.color,
        canvas: mapEl
      })
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