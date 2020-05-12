<template>
  <div class="page">
    <div class="fixed">
      <Header />
      <div class="controls">
        <span>
          <Tile v-if="this.pickedTile" @clicked="rotate(pickedTile)" :type="pickedTile" :selectable="true" :halfSize="true"/>
          <div><strong>{{ this.tiles.length }}</strong></div>
        </span>
        <span>
          Next Tile: {{ this.currentPlayer }}
        </span>
      </div>
    </div>
    <Board @clicked="place" :tiles="grid" :selectable="okSlots" />
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
      players: ['orange', 'red'],
      playerData: {
        'orange': { meepleCount: 7 },
        'red': { meepleCount: 7 }
      },
      currentPlayerIdx: 1,
      pickedTile: null,
      pickedIdx: null,
      okSlots: {},
      tiles: TileLibrary.allTiles(),
      grid: { [String([0, 0])]: { sides: [ 'c', 'r', 'g', 'r' ] } }
    }
  },
  methods: {
    nextPlayer () {
      let idx = this.currentPlayerIdx + 1
      if (idx >= this.players.length) idx = 0
      this.currentPlayerIdx = idx
    },
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
          meeple: { position: meepleSlot, color: this.prevPlayer }
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

              this.nextPlayer()
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
  computed: {
    prevPlayer () {
      const idx = this.currentPlayerIdx
      return this.players[(idx > 0) ? idx - 1 : this.players.length - 1]
    },
    currentPlayer () {
      return this.players[this.currentPlayerIdx]
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.fixed {
}
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  span:not(:last-child) {
    margin-right: 1em;
  }
  margin-bottom: 1ex;
}
</style>
