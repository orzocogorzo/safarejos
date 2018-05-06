import MapView from '../../components/map-view/map-view.vue';
import SidebarView from '../../components/sidebar/sidebar.vue';

export default {
  name: "map-section",
  props: [ "content" ],
  methods: {
    mapRenderer() {
      this.$data.sections.map = true;
    },

    sidebarRenderer() {
      this.$data.sections.sidebar = true;
    },

    afterMount() {
      console.log("afterMount");
      this.mapRenderer();
      this.sidebarRenderer();
    }
  },
  components: {
    MapView,
    SidebarView
  },
  data: function() {
    return {
      sections: {
        map: false,
        sidebar: false
      },
      title: "MAP SECTION", 
      message: "Welcome to the map section"
    }
  }
}