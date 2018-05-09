import CoverComponent from '../sidebar-sections/cover/cover.component.vue';
import PersonalComponent from '../sidebar-sections/personal/personal.component.vue';
import HomeComponent from '../sidebar-sections/home/home.component.vue';
import WorkComponent from '../sidebar-sections/work/work.component.vue';
import EndComponent from  '../sidebar-sections/end/end.component.vue';

import ScrollController from '../../workers/scroll-controller.component.vue';

import routesMap from './scroll-heights.map';

export default {
  name: "sidebar-scroll",
  mounted: function() {
    this.offsetHeight = document.body.offsetHeight;
    this.offsetWidth = document.body.offsetWidth;
    this.scrollLayer = this.$el.children[0];
  },
  data: function() {
    return {
      offsetHeight: null,
      offsetWidth: null,
      scrollLayer: null,
      router: {
        next: {
          visible: false,
          hash: undefined
        },
        previous: {
          visible: false,
          hash: undefined
        },
        current: {
          index: undefined,
          name: undefined
        }
      },
      subsection: undefined,
      sectionData: {

      }
    }
  },
  props: [ "scrollhash" ],
  components: {
    CoverComponent,
    PersonalComponent,
    HomeComponent,
    WorkComponent,
    EndComponent,
    ScrollController
  },
  watch: {
    scrollhash: function( val ) {
      this.subsection = val.subsection
      this.setMarginOffset( val.section );
      this.updateRouter( val );

      if ( !this.scrollLayer.style.transition ) {
        setTimeout(() => this.scrollLayer.style.transition = "margin 2s ease-in-out", 0);
      }
    }
  },
  methods: {

    setMarginOffset( section ) {
      this.scrollLayer.style.marginTop = String(routesMap.names[section] * this.offsetHeight * -1) + 'px';
    },

    onSectionReady( section ,data ) {
      this.$emit("add-section-data", section, data );
      this.router.next.ready = true;
    },

    updateRouter( val ) {
      this.router = {
        previous: {
          display:  Boolean(routesMap.index[routesMap.names[val.section]+1]) ? Boolean(routesMap.index[routesMap.names[val.section]-1]) && "block" || "none" : "none",
          hash: 'map/'+routesMap.index[routesMap.names[val.section]-1] + '/0',
          ready: true
        },
        next: {
          display: Boolean(routesMap.index[routesMap.names[val.section]-1]) ? Boolean(routesMap.index[routesMap.names[val.section]+1]) && "block" || "none" : "none",
          hash: 'map/'+routesMap.index[routesMap.names[val.section]+1] + '/0',
          ready: false
        },
        current: {
          index: routesMap.names[val.section],
          name: val.section
        }
      };
    },

    addMapData( data, layerOptions, viewOptions ) {
      this.$emit("add-map-data", data, layerOptions, viewOptions );
    },

    onGenerateData( event ) {
      this.$emit("generate-data", event );
    }
  }
}