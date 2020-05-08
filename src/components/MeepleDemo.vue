<template>
  <div class="page">
    <Header />
    <TilePicker @selected="clickTile" :tiles="tiles" />
  </div>
</template>

<script>

import Tile from './Tile'
import TilePicker from './TilePicker'
import Board from './Board'
import Header from './Header'

export default {
  data () {
    return {
      tiles: [
        {
          sides: ['r', 'r', 'r', 'r'],
          meeple: {color: 'black', position: [-1, 0]}
        },
        {
          sides: ['c', 'r', 'r', 'r'],
          meeple: {color: 'orange', position: [0, 1] }
        },
        {
          sides: ['r', 'r', 'r', 'r'],
          meeple: {color: 'red', position: [1, 0] }
        },
        {
          sides: ['g', 'g', 'g', 'g'],
          cloister: true,
          meeple: {color: 'blue', position: [0, 0] }
        },
        {
          sides: ['c', 'c', 'r', 'r'],
          meeple: {color: 'blue', position: [0, 1] }
        },
        {
          sides: ['c', 'c', 'r', 'r'],
          meeple: {color: 'blue', position: [1, 0] }
        },
        {
          sides: ['c', 'c', 'r', 'r'],
          meeple: {color: 'blue', position: [0, -1] }
        },
        {
          sides: ['c', 'c', 'r', 'r'],
          meeple: {color: 'blue', position: [-1, 0] }
        },
        {
          sides: ['c', 'c', 'r', 'r'],
          meeple: {color: 'blue', position: [-1, -1] }
        },
        {
          sides: ['c', 'c', 'r', 'r'],
          meeple: {color: 'blue', position: [-1, 1] }
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
    Header,
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
