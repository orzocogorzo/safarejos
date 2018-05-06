// import MapGL from 'mapbox-gl/dist/mapbox-gl';
import L from 'leaflet/dist/leaflet';

import DrawControl from '../map-controls/draw-control/draw-control.vue'

export default {
  name: "map-view",
  data() {
    return {
      map: undefined
    }
  },
  props: [ "mounted" ],
  watch: {
    mounted: function( val ) {
      this.renderMap();
      return val;
    },
    map: function( val ) {
      return val;
    }
  },
  methods: {
    renderMap() {
      // accesToken: "pk.eyJ1Ijoib3J6b2MiLCJhIjoiY2lzZGEzNXhmMDAwdjJvcGZ4NXU2bzU0NCJ9.RzrN_JISe561WfI1SjWCvw",
      this.map = L.map('map').setView( [ 41.4515, 2.203 ], 16 );
      L.tileLayer('https://api.mapbox.com/styles/v1/orzoc/cjeh8ep1s8xls2rpdmaidmh1d/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3J6b2MiLCJhIjoiY2lzZGEzNXhmMDAwdjJvcGZ4NXU2bzU0NCJ9.RzrN_JISe561WfI1SjWCvw')
        .addTo( this.map );
    },

    onDrawModeChange( evt ) {
      if ( evt.drag ) {
        this.map.dragging.enable();
        this.map.touchZoom.enable();
        this.map.doubleClickZoom.enable();
        this.map.scrollWheelZoom.enable();
        this.map.boxZoom.enable();
        this.map.keyboard.enable();
        if (this.map.tap) this.map.tap.enable();
        document.getElementById('map').style.cursor='-webkit-grab';
      } else {
        this.map.dragging.disable();
        this.map.touchZoom.disable();
        this.map.doubleClickZoom.disable();
        this.map.scrollWheelZoom.disable();
        this.map.boxZoom.disable();
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