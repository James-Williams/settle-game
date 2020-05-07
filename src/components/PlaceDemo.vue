<template>
  <div class="page">
    <div>
      <Tile v-if="this.pickedTile" @clicked="rotate(pickedTile)" :type="pickedTile" :selectable="true"/>
      <div><strong>Remaining: {{ this.tiles.length }}</strong></div>
    </div>
    <Board @clicked="place" :tiles="grid" :selectable="okSlots"/>
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
      pickedTile: null,
      pickedIdx: null,
      okSlots: {},
      tiles: TileLibrary.allTiles(),
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
      if (this.tiles.length === 0) {
        this.pickedTile = null
        this.pickedIdx = null
      } else {
        const idx = Math.floor(Math.random() * this.tiles.length)
        this.pickedIdx = idx
        this.pickedTile = this.tiles[idx]
        this.updateOkSlots()
      }
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

        this.tiles.splice(this.pickedIdx, 1)

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
  height: 100%;
}
</style>
