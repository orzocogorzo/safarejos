// import MapGL from 'mapbox-gl/dist/mapbox-gl';
import L from 'leaflet/dist/leaflet';
import * as _ from 'lodash';

import DrawControl from '../map-controls/draw-control/draw-control.vue'

import drawOptionsMap from './draw-options.map';

export default {
  name: "map-view",
  data() {
    return {
      map: undefined,
      drawTool: null,
      drawColor: null,
      drawProperties: null,
      section: null,
      subsection: null
    }
  },
  props: [ "mounted", "styleList", "scrollhash" ],
  watch: {
    mounted: function( val ) {
      this.renderMap();
      return val;
    },
    styleList: function( val ) {
      Object.keys( val ).map( k => {
        this.$el.style[k] = String(val[k]);
      });
      
      let interval = setInterval(() => {
        this.map.invalidateSize();
      }, 20 );
      
      setTimeout(() => {
        clearInterval(interval);
      }, 1600 );
    },
    scrollhash( val ) {
      this.drawTool = drawOptionsMap[val.section]
        && drawOptionsMap[val.section].tools[val.subsection]
        && drawOptionsMap[val.section].tools[val.subsection]
        || [];
      this.drawColor = ['#fff0','#ff004d','#3c9ac7','#fff860','#55ab71'][val.subsection];
      this.drawProperties = drawOptionsMap[val.section]
        && drawOptionsMap[val.section].properties
        || [];
      this.section = val.section;
      this.subsection = val.subsection;
    }
  },
  methods: {
    renderMap() {
      this.map = L.map('map').setView( [ 41.4354394404612, 2.2126132249832158 ], 16 );
      L.tileLayer('https://api.mapbox.com/styles/v1/orzoc/ciu8cr5ar002t2imlm7l0s7zy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3J6b2MiLCJhIjoiY2lzZGEzNXhmMDAwdjJvcGZ4NXU2bzU0NCJ9.RzrN_JISe561WfI1SjWCvw', {})
        .addTo( this.map );

      this.$emit("map-rendered", this.map );
    },

    onDrawModeChange( evt ) {
      if ( evt.drag ) {
        this.map.dragging.enable();
        this.map.touchZoom.enable();
        this.map.doubleClickZoom.enable();
        // this.map.scrollWheelZoom.enable();
        // this.map.boxZoom.enable();
        this.map.keyboard.enable();
        if (this.map.tap) this.map.tap.enable();
        document.getElementById('map').style.cursor='-webkit-grab';
      } else {
        this.map.dragging.disable();
        this.map.touchZoom.disable();
        this.map.doubleClickZoom.disable();
        // this.map.scrollWheelZoom.disable();
        // this.map.boxZoom.disable();
        this.map.keyboard.disable();
        if (this.map.tap) this.map.tap.disable();
        document.getElementById('map').style.cursor='crosshair';
      }
    }
  },
  components: {
    DrawControl
  }
}