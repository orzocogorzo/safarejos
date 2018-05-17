import MapView from '../../components/map-view/map-view.vue';
import SidebarView from '../../components/sidebar/sidebar.vue';

import sectionsMap from '../../config-maps/layout-sections.map';

export default {
  name: "map-section",
  props: [ "content" ],
  methods: {
    mapRenderer() {
      this.$data.sections.map.mounted = true;
    },

    sidebarRenderer() {
      this.$data.sections.sidebar.mounted = true;
    },

    afterMount() {
      this.mapRenderer();
      this.sidebarRenderer();
    },

    getMapInstance( map ) {
      this.map = map;
    }
  },
  components: {
    MapView,
    SidebarView
  },
  data: function() {
    return {
      sections: {
        map: {
          mounted: false,
          styleList: false
        },
        sidebar: {
          mounted: false,
          styleList: false
        },
      },
      scrollHash: undefined,
      title: "Safaretjos", 
      subtitle: "Dibuixa el teu barri",
      map: undefined
    }
  },
  watch: {
    scrollHash: function( val ) {
      Object.keys(sectionsMap[val.section]).map(k => {
        this.sections[k].styleList = sectionsMap[val.section][k]; 
      });
    }
  }
}