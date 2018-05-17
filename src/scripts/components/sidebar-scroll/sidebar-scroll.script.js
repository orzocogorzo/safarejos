import CoverComponent from '../sidebar-sections/cover/cover.component.vue';
import PersonalComponent from '../sidebar-sections/personal/personal.component.vue';
import HomeComponent from '../sidebar-sections/home/home.component.vue';
import WorkComponent from '../sidebar-sections/work/work.component.vue';
import EndComponent from  '../sidebar-sections/end/end.component.vue';
import IdentityComponent from '../sidebar-sections/identity/identity.component.vue';
import EquipmentsComponent from '../sidebar-sections/equipments/equipments.component.vue';
import SocialComponent from '../sidebar-sections/social/social.component.vue';
import BarriersComponent from '../sidebar-sections/barriers/barriers.component.vue';
import PathsComponent from '../sidebar-sections/paths/paths.component.vue';
import DescriptionComponent from '../sidebar-sections/description/description.component.vue';

import ScrollController from '../../workers/scroll-controller.component.vue';

import scrollHeightsMap from '../../config-maps/scroll-heights.map';

export default {
  name: "sidebar-scroll",
  mounted: function() {
    this.offsetHeight = document.body.offsetHeight;
    this.offsetWidth = document.body.offsetWidth;
    this.scrollLayer = this.$el.children[0];
    resizeListeners.push(() => {
      setTimeout(() => {
        this.offsetHeight = document.body.offsetHeight;
        this.offsetWidth = document.body.offsetWidth;
      }, 100 );
    });
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
      section: undefined
    }
  },
  props: [ "scrollhash" ],
  components: {
    CoverComponent,
    PersonalComponent,
    HomeComponent,
    WorkComponent,
    EndComponent,
    IdentityComponent,
    EquipmentsComponent,
    SocialComponent,
    BarriersComponent,
    PathsComponent,
    DescriptionComponent,
    ScrollController
  },
  watch: {
    scrollhash: function( val ) {
      this.subsection = val.subsection;
      this.section = val.section;
      this.setMarginOffset( val.section );
      this.updateRouter( val );

      if ( !this.scrollLayer.style.transition ) {
        setTimeout(() => this.scrollLayer.style.transition = "margin 2s ease-in-out", 0);
      }
    },
    offsetHeight( val ) {
      this.scrollLayer.style.transition = "margin 0s";
      this.setMarginOffset( this.scrollhash.section );
      setTimeout(() => this.scrollLayer.style.transition = "margin 2s ease-in-out", 2000 );
    }
  },
  methods: {

    setMarginOffset( section ) {
      this.scrollLayer.style.marginTop = String(scrollHeightsMap.names[section] * this.offsetHeight * -1) + 'px';
    },

    onSectionReady( section ,data ) {
      this.$emit("add-section-data", section, data );
      this.router.next.ready = true;
    },

    forceSectionReady() {
      this.router.next.ready = true;
    },

    updateRouter( val ) {
      this.router = {
        previous: {
          display:  Boolean(scrollHeightsMap.index[scrollHeightsMap.names[val.section]+1]) ? Boolean(scrollHeightsMap.index[scrollHeightsMap.names[val.section]-1]) && "block" || "none" : "none",
          hash: 'map/'+scrollHeightsMap.index[scrollHeightsMap.names[val.section]-1] + '/0',
          ready: true
        },
        next: {
          display: Boolean(scrollHeightsMap.index[scrollHeightsMap.names[val.section]-1]) ? Boolean(scrollHeightsMap.index[scrollHeightsMap.names[val.section]+1]) && "block" || "none" : "none",
          hash: 'map/'+scrollHeightsMap.index[scrollHeightsMap.names[val.section]+1] + '/0',
          ready: false
        },
        current: {
          index: scrollHeightsMap.names[val.section],
          name: val.section
        }
      };
    },

    addMapData( data, layerOptions, viewOptions ) {
      this.$emit("add-map-data", data, layerOptions, viewOptions );
    },

    clearMapLayers( viewOptions ){
      this.$emit("clear-map-layers", viewOptions );
    },

    storeMapLayer( section, key ) {
      this.$emit("store-map-layer", section, key );
    },

    onGenerateData( event ) {
      this.$emit("generate-data", event );
    },

    onResetMapSelection( e ) {
      this.$emit("reset-map-selection");
    },

    onOpenPopup( popup ) {
      this.$emit("open-popup", popup );
    },

    onClosePopup(){
      this.$emit("close-popup");
    }
  }
}