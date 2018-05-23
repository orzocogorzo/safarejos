<style lang="stylus">
#scroll-controller
  display: flex
  width 100%
  justify-content space-around
  position absolute 
  bottom 50px
  .direction-btn
    background-color #ccccff
    border-radius 50%
    color #000000
    display flex
    flex 1
    height 40px
    max-width 40px
    background-color #b96983
    z-index 30
    background-size contain
    background-repeat no-repeat
    background-position 50%
    cursor pointer
    border 1.5px solid #fff
    &:hover
      background-color lighten(#b96983,15%)
    &.previous-btn
      background-image url('../../assets/images/left-double-arrow.svg')
    &.next-btn
      background-image url('../../assets/images/right-double-arrow.svg')
      opacity 0.5
      &[active="true"]
        opacity 1

</style>

<script>
export default {
  name: "scroll-controller",
  props: [ "next", "previous" ],
  methods: {
    onNext( evt ) {
      this.$emit('restart-map-drag');
      location.hash = this.next.ready && this.next.hash || location.hash
    },
    onPrevious( evt ) {
      this.$emit('restart-map-drag');
      location.hash = this.previous.ready && this.previous.hash || location.hash
    }
  },
  // watch: {
  //   next: {
  //     handler: ( val ) => {
  //       console.log( val.ready );
  //     },
  //     deep: true
  //   }
  // }
}
</script>

<template>
<div id="scroll-controller" class="scroll-controller-wrapper">
  <div class="direction-btn previous-btn" v-on:click="onPrevious" v-bind:style="{ display: previous ? previous.display : 'none' }"></div>
  <div :active="[ next ? next.ready : false ]" class="direction-btn next-btn" v-on:click="onNext" v-bind:style="{ display: next ? next.display : 'none' }"></div>
</div>
</template>