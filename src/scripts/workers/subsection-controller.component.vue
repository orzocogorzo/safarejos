<style lang="stylus">
#subsection-controller
  display flex
  padding 10px
  flex-shrink 1
  .subsection-btn-wrapper
    flex 1
    display flex
    // padding 0px 10px
    justify-content center 
    align-items center
    flex-shrink 1
    .subsection-btn
      // border-radius 10px
      // background #688298
      white-space nowrap
      cursor pointer
      padding 0px 10px
      font-size 0.95em
      color #fff
      flex-shrink 1
      > div
        background #688298
        border-radius 10px
        padding 3px 10px
      &[hidden]
        display none
      &.btn-previous > div
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
  props: [ "section", "subsection", "current_section", "current_subsection", "boundaries", "ready", "visible", "container", "offsetW" ],
  methods: {
    onClickBtn( evt, step ) {
      const next = Math.min(this.boundaries[1], Math.max(this.boundaries[0], (this.current_subsection*1 + step)))
      location.hash = location.hash.split('/').slice(0,2).join('/') + '/' + next;
    },
    setContainerStyle() {
      this.container.style.transition = "margin 1s ease-in-out";
      this.container.style.overflow = "unset";
      this.container.style.maxWidth = "calc(100vw - 10px)";
      this.container.style.flexDirection = "row";
      this.container.style.display = "none";
      this.container.style.justifyContent = "flex-start";

      this.setInputsWidth();
    },
    setInputsWidth(){
      this.container.style.transition = "margin 0s";
      this.container.style.marginLeft = (this.offsetW * this.current_subsection * -1) + 'px';
      const inputs = this.inputs || this.container.getElementsByClassName('input-wrapper');
      for ( let input of inputs ) {
        input.style.minWidth = this.offsetW + 'px'
      }
      setTimeout(() => this.container.style.transition = "margin 1s ease-in-out", 2000 );
    },
    lazyRender() {
      const opacities = Array.apply(null, Array(3)).map((d,i) => 0).concat(Array.apply(null, Array(6)).map((d,i) => i/5));
      let i = 0;
      let interval = setInterval(() => {
        this.$el.style.opacity = opacities[i];
        i++
      }, 100 );

      setTimeout(() => {
        clearInterval(interval);
      }, 900 );
    }
  },
  watch: {
    current_subsection( val ) {
      if ( this.container ) {
        this.container.style.marginLeft = (this.offsetW * val * -1) + 'px';
      }
      this.visible && this.section == this.current_subsection && this.lazyRender();
      this.$el.style.opacity = 0;
    },
    current_section( val ) {
      this.visible && this.section == this.current_subsection && this.lazyRender();
      this.$el.style.opacity = 0;
    },
    visible( val ) {
      if ( val ) {
        setTimeout(() => {
          this.container.style.display = "flex";
        }, 2000 );
      } else {
        this.container.style.display = "none";
      }
    },
    container( el ) {
      this.setContainerStyle();
    },
    offsetW( val ) {
      clearTimeout( this.debouncedResize );
      this.debouncedResize = setTimeout(() => {
        this.setInputsWidth();
      }, 300 );
    }
  },
  data: function() {
    return {
      inputs: null,
      debouncedResize: undefined
    }
  }
}
</script>

<template>
<div id="subsection-controller" class="subsection-controller-wrapper">
  <div class="subsection-btn-wrapper">
    <div :hidden="boundaries[0] == current_subsection" v-on:click="onClickBtn( $event, -1 )" class="subsection-btn btn-previous"><div>Tornar enrere</div></div>
  </div>
  <div class="subsection-btn-wrapper">
    <div :ready="ready" :hidden="boundaries[1] == current_subsection" v-on:click="onClickBtn( $event, 1 )" class="subsection-btn btn-next"><div>Confirmar</div></div>
  </div>
</div>
</template>