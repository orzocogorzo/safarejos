import SidebarScroll from '../sidebar-scroll/sidebar-scroll.vue';

const model = new Object();

export default {
  name: "sidebar-view",
  props: [ "scrollhash", "styleList", "map" ],
  watch: {
    scrollhash: function( val ) {
      return val;
    },
    styleList: function( val ) {
      Object.keys( val ).map( k => {
        this.$el.style[k] = String(val[k]);
      });
    }
  },
  methods: {
    storeSectionData( section, data ) {
      model[section] = data;
      // console.log( model );
    },

    addMapData( data, layerOptions, viewOptions ) {
      const _options = layerOptions || new Object();

      this.map.eachLayer(layer => {
        if ( layer.isAuxiliar ) {
          this.map.removeLayer( layer );
        }
      });

      const layer = L.geoJSON(data, Object.assign(_options, {
        isAuxiliar: true
      }));
      
      layer.addTo(this.map);

      if ( viewOptions ) {
        this.map.setVie( viewOptions ); 
      }

    }
  },
  components: {
    SidebarScroll
  }
}