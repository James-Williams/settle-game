<template>
  <div class="showcase">
    <div class="item" v-for="(tile, idx) in tileList" :key="idx">
      <Tile @clicked="clicked(idx)" :type="tile.toJS()" :key="idx" :halfSize="true" :selectable="true" :meeple="tile.get('meeple')" />
      <div @click="clicked(idx)" v-if="idx === selectedIdx" class="selected"></div>
    </div>
  </div>
</template>

<script>
import Immutable from 'immutable'

import Tile from './Tile'

import TileLibrary from '@/TileLibrary'
import Moves from '@/Moves'

export default {
  data () {
    return {
      selectedIdx: -1,
      tileList: Immutable.fromJS(this.tiles)
    }
  },
  props: {
    tiles: {
      type: Object,
      default: () => TileLibrary.uniqueTiles()
    }
  },
  methods: {
    clicked (idx) {
      if (this.selectedIdx === idx) {
        this.tileList = this.tileList.set(idx, Moves.rotateTile(this.tileList.get(idx)))
      } else {
        this.selectedIdx = idx
      }
      this.$emit('selected', this.tileList.get(this.selectedIdx))
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
