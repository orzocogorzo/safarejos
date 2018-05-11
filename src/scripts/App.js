import Vue from 'vue';
import Router from './services/Router';
import Controller from './services/Controller';

window.onresize = function( e ) {
  for ( let fn of this.resizeListeners ) {
    if ( typeof fn === "function" ) {
      fn( e );
    }
  }
}

window.resizeListeners = [];

const routerComponent = {
  name: 'router-component',
  template: '<div id="router-component" class="router-component-wrapper"></div>',
  data: function() {
    return {
      current_component: null
    }
  },
  methods: {
    attachCurrentComponent( view ) {
      view.$mount();
      this.current_component = view;
      this.$el.appendChild( view.$el );
      view.afterMount && view.afterMount();
    }
  }
};

const App = function() {
  return new Vue({
    el: '#app',
    template: "<div id=app><div class='router-component-container'></div></div>",
    mounted: function() {
      this.attachRouterComponent();
      var controller = new Controller( this );
      var router = new Router( controller );
      router.start();
    },
    data: {
      router_component: null
    },
    methods: {
      attachRouterComponent() {
        const RouterComponent = Vue.extend(routerComponent);
        this.router_component = new RouterComponent();
        this.router_component.$mount();
        this.$el.getElementsByClassName('router-component-container')[0].appendChild( this.router_component.$el );
      }
    }
  });
};

export { App }