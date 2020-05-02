<template>
  <div class="page">
    <TilePicker @selected="clickTile"/>
    <div>
      <Board v-for="(grid, idx) in grids" @clicked="place" :tiles="grid" :key="idx" />
    </div>
  </div>
</template>

<script>

import Tile from './Tile'
import TilePicker from './TilePicker'
import Board from './Board'

export default {
  data () {
    return {
      pickedTile: null,
      grids: [
        {[String([0, 0])]: { blank: 1 }},
        {
          [String([0, 0])]: { 'sides': [ 'g', 'g', 'r', 'g' ], cloister: 1 },
          [String([1, 0])]: { 'sides': [ 'g', 'c', 'c', 'g' ] },
          [String([2, 0])]: { 'sides': [ 'g', 'r', 'r', 'c' ] },
          [String([3, 0])]: { 'sides': [ 'r', 'g', 'r', 'r' ] },

          [String([0, -1])]: { 'sides': [ 'r', 'r', 'g', 'g' ] },
          [String([1, -1])]: { 'sides': [ 'c', 'c', 'c', 'r' ] },
          [String([3, -1])]: { 'sides': [ 'r', 'g', 'g', 'g' ], cloister: 1 },

          [String([1, -2])]: { 'sides': [ 'c', 'c', 'r', 'r' ] },
          [String([3, -2])]: { 'sides': [ 'g', 'r', 'g', 'r' ] },

          [String([3, -2])]: { 'sides': [ 'g', 'g', 'g', 'g' ], cloister: 1 }
        }
      ]
    }
  },
  methods: {
    clickTile (tile) {
      this.pickedTile = tile
    },
    place (pos) {
      if (this.pickedTile) {
        const newTile = JSON.parse(JSON.stringify(this.pickedTile))
        var grid = {...this.grids[0], [String(pos)]: newTile}
        this.grids = {...this.grids, 0: grid}
      }
    }
  },
  components: {
    Tile,
    TilePicker,
    Board
  }
}
</script>

<style scoped lang="scss">
.page {
  div {
    margin-bottom: 15px;
  }
}
</style>
