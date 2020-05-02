<template>
  <div class="page">
    <Tile @clicked="rotate(pickedTile)" :type="pickedTile" />
    <div>
      <Grid @clicked="place" :tiles="grid" />
    </div>
  </div>
</template>

<script>

import Tile from './Tile'
import TileLibrary from '@/TileLibrary'
import TilePicker from './TilePicker'
import Grid from './Grid'

export default {
  data () {
    return {
      pickedTile: {
        sides: [ 'g', 'g', 'g', 'g' ]
      },
      tiles: TileLibrary.uniqueTiles().map(function (x) { return {...x, selectable: 1} }),
      grid: { [String([0, 0])]: { sides: [ 'c', 'r', 'g', 'r' ], selectable: 1 } }
    }
  },
  methods: {
    randomizePick () {
      const idx = Math.floor(Math.random() * this.tiles.length)
      console.log(idx)
      this.pickedTile = this.tiles[idx]
    },
    rotate (tile) {
      const ss = []
      for (var i = 0; i < tile.sides.length; i++) {
        ss.push(tile.sides[(i + tile.sides.length - 1) % tile.sides.length])
      }
      tile.sides = ss
    },
    place (pos) {
      if (this.pickedTile) {
        const newTile = JSON.parse(JSON.stringify(this.pickedTile))

        var grid = {...this.grid, [String(pos)]: newTile}
        this.grid = grid
      }
      this.randomizePick()
    }
  },
  created () {
    this.randomizePick()
  },
  components: {
    Tile,
    TilePicker,
    Grid
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
