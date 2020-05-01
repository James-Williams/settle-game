<template>
  <div class="showcase">
    <div class="item" v-for="(tile, idx) in tiles" :key="idx">
      <Tile @clicked="clicked(tile)" :type="tile" :key="idx"/>
      <div @click="clicked(tile)" v-if="tile === selected" class="selected"></div>
    </div>
  </div>
</template>

<script>

import Tile from './Tile'

import TileLibrary from '@/TileLibrary'

export default {
  data () {
    var ts = []
    TileLibrary.uniqueTiles().forEach((x) => {
      x.selectable = 1
      ts.push(x)
    })
    return {
      selected: null,
      tiles: ts
    }
  },
  methods: {
    clicked (tile) {
      if (this.selected === tile) {
        this.selected = null
      } else {
        this.selected = tile
      }
      this.$emit('selected', this.selected)
    }
  },
  components: {
    Tile
  }
}
</script>

<style scoped lang="scss">
.showcase {
  .item {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
  }
  .selected {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0,0,255,0.4);
    box-shadow:inset 0px 0px 0px 5px blue;
  }
}
</style>
