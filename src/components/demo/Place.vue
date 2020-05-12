<template>
  <div class="page">
    <Header />
    <div>
      <Tile v-if="this.pickedTile" @clicked="rotate(pickedTile)" :type="pickedTile" :selectable="true"/>
      <div><strong>Remaining: {{ this.tiles.length }}</strong></div>
    </div>
    <Board @clicked="place" :tiles="grid" :selectable="okSlots"/>
  </div>
</template>

<script>

import Tile from '../Tile'
import TilePicker from '../TilePicker'
import Board from '../Board'
import Header from '../Header'

import TileLibrary from '@/TileLibrary'
import Grid from '@/Grid'
import Moves from '@/Moves'
import Scoring from '@/Scoring'

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
    meepleClicked (pos) {
      console.log(pos)
    },
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
    place (pos, meepleSlot) {
      if (meepleSlot) {
        this.grid[String(pos)] = {
          ...this.grid[String(pos)],
          meepleSelect: null,
          meeple: { position: meepleSlot, color: 'red' }
        }
      } else {
        if (this.pickedTile) {
          const newTile = JSON.parse(JSON.stringify(this.pickedTile))

          if (!(String(pos) in this.grid)) {
            const okSlots = {}
            Moves.findSlots(new Grid(this.grid), newTile).forEach((slot) => {
              okSlots[String(slot)] = slot
            })
            if (String(pos) in okSlots) {
              this.tiles.splice(this.pickedIdx, 1)

              let grid = {...this.grid, [String(pos)]: newTile}
              this.grid = grid

              // Clear old meeple selection
              Object.keys(this.grid).forEach((key) => {
                this.grid[key].meepleSelect = null
              })

              // Set meeple selection
              newTile.meepleSelect = Scoring.freeSlots(new Grid(this.grid), pos)

              this.randomizePick()
            }
          }
        }
      }
    }
  },
  created () {
    this.randomizePick()
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
  height: 100%;
}
</style>
