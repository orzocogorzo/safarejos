import BrushController from '../../../workers/brush.controller';
import LineController from '../../../workers/line.controller';
import PolygonController from '../../../workers/polygon.controller';
import PointController from '../../../workers/point-controller';
import FormController from '../../../workers/form-controller';
import EraseController from '../../../workers/erase-controller';

import drawProperties from '../../../config-maps/draw-properties.map';

export default {
  name: "draw-control",
  props: [ "map", "currentTools", "color", "properties", "section", "subsection" ],
  data() {
    return {
      options: [
        {
          name: "drag",
          active: true,
          controller: "l-drag-controller"
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
          name: "form",
          active: false,
          controller: "form-controller"
        },
        {
          name: "eraser",
          active: false,
          controller: "erase-controller"
        },
      ],
      hidden: true,
      controllers: {
        "brush-controller": null,
        "line-controller": null,
        "point-controller": null,
        "polygon-controller": null,
        "form-controller": null,
        "erase-controller": null
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
      this.selectMode( option.controller );
    },

    storeMapData() {
      let result = this.controller && this.controller.unbind() || { features: [] };
      this.features.features = this.features.features.concat( result.features );
      this.map.__data__ = this.features;
    },

    clearMapData() {
      // this.controller && this.controller.clearData() || this.map.eachLayer(layer => {
      //   layer.options.isOverlay && this.map.removeLayer( layer );
      // });
      this.features.features = [];
      this.map.__data__ = null;
    },

    selectMode( controller ) {
      
      Object.keys( this.controllers ).map((k) => {
        this.controllers[k].active = false;
      });

      this.controller && this.controller.unbind();

      if (controller === "erase-controller" ) {
        this.$emit("mode-change", { drag: true });
        this.storeMapData();
        this.controller = this.controllers[ controller ];
        this.controller.captureInteraction();
        this.controller.active = true;
      } else if ( controller != "l-drag-controller" ) {
        this.$emit("mode-change", { drag: false });
        this.storeMapData();
        this.controller = this.controllers[ controller ];
        this.controller.captureInteraction();
        this.controller.active = true;
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
      });

      this.controllers["form-controller"] = new FormController({
        map: this.map,
        color: this.color,
        canvas: mapEl,
        properties: this.properties
      });

      this.controllers["erase-controller"] = new EraseController({
        map: this.map,
        color: this.color,
        canvas: mapEl
      });
    }
  },
  watch: {
    map: function( val ) {
      if ( val ) {
        this.setupControllers();
        this.map.on('restartdrag', () => {
          this.options.map((opt) => {
            opt.active = opt.name === "drag"
          });
          this.selectMode( 'l-drag-controller' );
        });
      }
    },
    color( val ) {
      Object.keys(this.controllers).map((k) => {
        this.controllers[k].setColor(this.color);
      })
    },
    section( val ) {
      this.features = {
        "type": "FeatureCollection",
        "features": []
      },
      Object.keys(this.controllers).map((k) => {
        this.controllers[k].setSubsection( drawProperties[this.section] && drawProperties[this.section][this.subsection] || null )
      });
      this.controllers["form-controller"].properties = this.properties;
    },
    subsection( val ) {
      Object.keys(this.controllers).map((k) => {
        this.controllers[k].setSubsection( drawProperties[this.section] && drawProperties[this.section][this.subsection] || null )
      });
      this.controllers["form-controller"].properties = this.properties;
    }
  }
}