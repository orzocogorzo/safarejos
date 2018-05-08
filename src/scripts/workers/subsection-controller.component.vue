<style lang="stylus">
#subsection-controller
  display flex
  padding 10px
  flex-shrink 1
  // transition opacity  1s
  .subsection-btn-wrapper
    flex 1
    display flex
    padding 0px 10px
    justify-content center 
    align-items center
    flex-shrink 1
    .subsection-btn
      border-radius 10px
      background #688298
      white-space nowrap
      cursor pointer
      padding 3px 10px
      font-size 0.95em
      color #fff
      flex-shrink 1
      &[hidden]
        display none
      &.btn-previous
        background #986884
      &.btn-next
        opacity 0.5
        pointer-events none
        &[ready]
          opacity 1
          pointer-events initial
</style>

<script>
export default {
  name: "subsection-controller",
  props: [ "current_subsection", "boundaries", "ready" ],
  data: function() {
    return new Object();
  },
  methods: {
    onClickBtn( evt, step ) {
      const next = Math.min(this.boundaries[1], Math.max(this.boundaries[0], (this.current_subsection*1 + step)))
      location.hash = location.hash.split('/').slice(0,2).join('/') + '/' + next;
    }
  },
  watch: {
    current_subsection( val ) {
      this.$el.style.opacity = 0;
      
      const opacities = Array.apply(null, Array(3)).map((d,i) => 0).concat(Array.apply(null, Array(6)).map((d,i) => i/5));
      let i = 0;
      let interval = setInterval(() => {
        this.$el.style.opacity = opacities[i];
        i++
      }, 100 );

      setTimeout(() => {
        clearInterval(interval);
      }, 900 )
    }
  }
}
</script>

<template>
<div id="subsection-controller" class="subsection-controller-wrapper">
  <div class="subsection-btn-wrapper">
    <div :hidden="boundaries[0] == current_subsection" v-on:click="onClickBtn( $event, -1 )" class="subsection-btn btn-previous">Tornar enrere</div>
  </div>
  <div class="subsection-btn-wrapper">
    <div :ready="ready" :hidden="boundaries[1] == current_subsection" v-on:click="onClickBtn( $event, 1 )" class="subsection-btn btn-next">Confirmar</div>
  </div>
</div>
</template>