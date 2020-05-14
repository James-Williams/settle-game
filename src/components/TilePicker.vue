<template>
  <div class="showcase">
    <div class="item" v-for="(tile, idx) in tiles" :key="idx">
      <Tile @clicked="clicked(tile)" :type="tile" :key="idx" :halfSize="true" :selectable="true" :meeple="tile.meeple" />
      <div @click="clicked(tile)" v-if="tile === selected" class="selected"></div>
    </div>
  </div>
</template>

<script>

import Tile from './Tile'

import TileLibrary from '@/TileLibrary'

export default {
  data () {
    return {
      selected: null
    }
  },
  props: {
    tiles: {
      type: Array,
      default: () => TileLibrary.uniqueTiles()
    }
  },
  methods: {
    clicked (tile) {
      if (this.selected === tile) {
        this.rotate(this.selected)
      } else {
        this.selected = tile
      }
      this.$emit('selected', this.selected)
    },
    rotate (tile) {
      const ss = []
      for (var i = 0; i < tile.sides.length; i++) {
        ss.push(tile.sides[(i + tile.sides.length - 1) % tile.sides.length])
      }
      tile.sides = ss
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
