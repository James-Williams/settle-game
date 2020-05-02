<template>
  <div class="page">
    <Tile @clicked="rotate(pickedTile)" :type="pickedTile" :selectable="true"/>
    <div>
      <Board @clicked="place" :tiles="grid" :selectable="okSlots"/>
    </div>
  </div>
</template>

<script>

import Tile from './Tile'
import TileLibrary from '@/TileLibrary'
import TilePicker from './TilePicker'
import Board from './Board'

import Grid from '@/Grid'
import Moves from '@/Moves'

export default {
  data () {
    return {
      pickedTile: {
        sides: [ 'g', 'g', 'g', 'g' ]
      },
      okSlots: {},
      tiles: TileLibrary.uniqueTiles(),
      grid: { [String([0, 0])]: { sides: [ 'c', 'r', 'g', 'r' ] } }
    }
  },
  methods: {
    updateOkSlots () {
      const okSlots = {}
      Moves.findSlots(new Grid(this.grid), this.pickedTile).forEach((slot) => {
        okSlots[String(slot)] = slot
      })
      this.okSlots = okSlots
    },
    randomizePick () {
      const idx = Math.floor(Math.random() * this.tiles.length)
      this.pickedTile = this.tiles[idx]
      this.updateOkSlots()
    },
    rotate (tile) {
      const ss = []
      for (var i = 0; i < tile.sides.length; i++) {
        ss.push(tile.sides[(i + tile.sides.length - 1) % tile.sides.length])
      }
      tile.sides = ss
      this.updateOkSlots()
    },
    place (pos) {
      if (this.pickedTile) {
        const newTile = JSON.parse(JSON.stringify(this.pickedTile))
        if (!(String(pos) in this.grid)) {
          const okSlots = {}
          Moves.findSlots(new Grid(this.grid), newTile).forEach((slot) => {
            okSlots[String(slot)] = slot
          })
          if (String(pos) in okSlots) {
            let grid = {...this.grid, [String(pos)]: newTile}
            this.grid = grid
            this.randomizePick()
          }
        }
      }
    }
  },
  created () {
    this.randomizePick()
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
