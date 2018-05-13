import SidebarScroll from '../sidebar-scroll/sidebar-scroll.vue';

const model = new Object();

export default {
  name: "sidebar-view",
  props: [ "scrollhash", "styleList", "map" ],
  watch: {
    styleList: function( val ) {
      Object.keys( val ).map( k => {
        this.$el.style[k] = String(val[k]);
      });
    }
  },
  methods: {
    storeSectionData( section, data ) {
      model[section] = data;
    },

    clearMapLayers( viewOptions ) {
      this.map.eachLayer(layer => {
        if ( layer.options.isAuxiliar || layer.options.isOverlay ) {
          this.map.removeLayer( layer );
        }
      });

      if ( viewOptions ) {
        this.map.setView( viewOptions.latlng, viewOptions.zoom ); 
      }
    },

    addMapData( data, layerOptions, viewOptions ) {
      const _options = layerOptions || new Object();

      this.map.eachLayer(layer => {
        if ( layer.options.isAuxiliar || layer.options.isOverlay ) {
          this.map.removeLayer( layer );
        }
      });

      const layer = L.geoJSON( data, Object.assign( _options, {
        isAuxiliar: true
      }));
      
      layer.addTo( this.map );

      if ( viewOptions ) {
        this.map.setView( viewOptions.latlng, viewOptions.zoom ); 
      }

    },

    generateData() {
      var file = new Blob([JSON.stringify(model)], {type: "json"});
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = "data.json";
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0);
    },

    storeMapLayer( section, key ) {
      this.map.fire("storedata");
      // model[section] = model[section] || new Object();
      model[section] = this.map.__data__;
      // this.map.__data__ = null;
    },

    resetMapSelection( e ) {
      this.map.eachLayer(layer => {
        if ( layer.options.isAuxiliar ) {
          layer.setStyle({
            fillColor: "#3388ff"
          });
        }
      });
    }
  },
  components: {
    SidebarScroll
  }
}