<template>
  <div class="page">
    <Header />
    <Tile v-if="this.pickedTile" :type="pickedTile" />
    <div>
      <strong>Remaining: {{ this.tiles.length }}</strong>
    </div>
    <div>
      <Board @clicked="place" :tiles="grid" :halfSize="true"/>
    </div>
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

        // Auto-place tile and repeat
        const randRot = Math.floor(Math.random() * 4)
        for (let i = 0; i < randRot; i++) this.rotate(this.pickedTile)

        let bestPos = null
        let bestScore = 0
        let bestRot = 0
        for (let rot = 0; rot < 4; rot++) {
          const ks = Object.keys(this.okSlots)
          if (ks.length > 0) {
            for (let i = 0; i < ks.length; i++) {
              const pos = this.okSlots[ks[i]]
              let score = 0
              for (let dx = 0; dx < 4; dx++) {
                const dir = Moves.DIRECTIONS[dx]
                const ofst = [pos[0] + dir[0], pos[1] + dir[1]]
                if (String(ofst) in this.grid) {
                  const otherTile = this.grid[String(ofst)]
                  const type = otherTile.sides[dx]
                  if (type === 'c') {
                    score += 4
                  } else if (type === 'r') {
                    score += 2
                  } else {
                    score += 1
                  }
                }
              }
              if (score > bestScore) {
                bestScore = score
                bestPos = pos
                bestRot = rot
              }
            }
          }
          this.rotate(this.pickedTile)
        }

        // Move to desired rotation for 'bestPos'
        for (let i = 0; i < bestRot; i++) this.rotate(this.pickedTile)

        window.setTimeout(() => this.place(bestPos), 75)
      }
    },
    randomColor () {
      const colors = [ 'orange', 'blue', 'red', 'black' ]
      const idx = Math.floor(Math.random() * colors.length)
      return colors[idx]
    },
    randomMeeple (pos) {
      const grid = new Grid(this.grid)
      if (Math.random() > 0.5) {
        const slots = Scoring.freeSlots(grid, pos)
        const pick = Math.floor(Math.random() * slots.length)
        const key = String(pos)
        this.grid[key].meeple = {
          color: this.randomColor(),
          position: slots[pick]
        }
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

            this.randomMeeple(pos)

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
    Board,
    Header
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