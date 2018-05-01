import Vue from 'vue';
import Router from './services/Router';

Vue.component('app', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
});

var app = new Vue({
  el: '#app',
  template: "<div id=app><app v-bind:todo='todo'></app></div>",
  data: {
    todo: {
      text: 'Hello World!'
    }
  },
  mounted: function(){
    var router = new Router();
    router.start();
  }
});