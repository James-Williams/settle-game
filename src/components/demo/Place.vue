<template>
  <div class="page">
    <div class="fixed">
      <Header />
      <div class="controls">
        <span>
          <p><strong><span class="tiles-left">{{ this.tiles.size }}</span></strong></p>
          <p>tiles left</p>
        </span>
        <span>
          <Tile v-if="this.pickedTile" @clicked="rotatePickedTile" :type="pickedTile.toJS()" :selectable="true" :halfSize="true"/>
        </span>
        <span><p>Players</p><p v-html="playersHtml" /></span>
      </div>
    </div>
    <Board @clicked="place" @meepleClicked="meepleClicked" :tiles="getGrid" :selectable="okSlots" :selectColor="currentPlayer"/>
  </div>
</template>

<script>
import Immutable from 'immutable'

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
        orange: { meepleCount: 7 },
        red: { meepleCount: 7 }
      },
      currentPlayerIdx: 1,
      pickedTile: null,
      pickedIdx: null,
      okSlots: {},
      grid: { [String([0, 0])]: { sides: [ 'c', 'r', 'g', 'r' ] } }
    }
  },
  props: {
    tiles: {
      type: Object,
      default: () => TileLibrary.allTiles()
    }
  },
  methods: {
    nextPlayer () {
      let idx = this.currentPlayerIdx + 1
      if (idx >= this.players.length) idx = 0
      this.currentPlayerIdx = idx
    },
    updateOkSlots () {
      const okSlots = {}
      Moves.findSlots(
        new Grid(Immutable.fromJS(this.grid).toJS()),
        this.pickedTile.toJS()
      ).forEach((slot) => {
        okSlots[String(slot)] = slot
      })
      this.okSlots = okSlots
    },
    randomizePick () {
      if (this.tileList.size === 0) {
        this.pickedTile = null
        this.pickedIdx = null
      } else {
        const idx = Math.floor(Math.random() * this.tileList.size)
        this.pickedIdx = idx
        this.pickedTile = this.tileList.get(idx)
        this.updateOkSlots()
      }
    },
    rotatePickedTile () {
      this.pickedTile = Moves.rotateTile(this.pickedTile)
      this.updateOkSlots()
    },
    place (pos, meepleSlot) {
      if (meepleSlot && this.playerData[this.prevPlayer].meepleCount > 0) {
        this.grid[String(pos)] = this.grid[String(pos)]
          .set('meepleSelect', null)
          .set('meeple', Immutable.fromJS({ position: meepleSlot, color: this.prevPlayer }))
        this.playerData[this.prevPlayer].meepleCount -= 1
      } else {
        if (this.pickedTile) {
          let newTile = this.pickedTile

          if (!(String(pos) in this.grid)) {
            const okSlots = {}
            Moves.findSlots(
              new Grid(Immutable.fromJS(this.grid).toJS()),
              newTile.toJS()
            ).forEach((slot) => {
              okSlots[String(slot)] = slot
            })
            if (String(pos) in okSlots) {
              // this.tileList.splice(this.pickedIdx, 1)

              let grid = {...this.grid, [String(pos)]: newTile}
              this.grid = grid

              // Clear old meeple selection
              Object.keys(this.grid).forEach((key) => {
                this.grid[key].meepleSelect = null
              })

              if (this.playerData[this.currentPlayer].meepleCount > 0) {
                // Set meeple selection
                newTile = newTile.set('meepleSelect', Scoring.freeSlots(new Grid(
                  Immutable.fromJS(this.grid).toJS()
                ), pos))
                newTile = newTile.set('meepleSelectColor', this.currentPlayer)
                this.grid[String(pos)] = newTile
              }

              this.nextPlayer()
              this.randomizePick()
            }
          }
        }
      }
    },
    meepleClicked (pos, meeple) {
      const ok = confirm('Remove meeple?')
      if (ok) {
        const key = String(pos)
        this.grid[key] = {...this.grid[key], meeple: null}
        this.playerData[meeple.color].meepleCount += 1
      }
    },
    getGrid () {
      return this.grid
    }
  },
  created () {
    this.randomizePick()
  },
  computed: {
    placedMeeple () {
      return Object.values(this.grid)
        .filter(x => x.meeple)
    },
    getGrid () {
      return Immutable.fromJS(this.grid).toJS()
    },
    tileList () {
      return Immutable.fromJS(this.tiles)
    },
    prevPlayer () {
      const idx = this.currentPlayerIdx
      return this.players[(idx > 0) ? idx - 1 : this.players.length - 1]
    },
    currentPlayer () {
      return this.players[this.currentPlayerIdx]
    },
    playersHtml () {
      const count = (player) => { return this.playerData[player].meepleCount }
      const countHtml = (player) => '(<span class="count">' + count(player) + '</span>)'
      return this.players
        .map((player) => (player === this.currentPlayer)
          ? '<strong>' + player + ' ' + countHtml(player) + '</strong>'
          : player + ' ' + countHtml(player))
        .map(x => '<span class="player">' + x + '</span>')
        .join(', ')
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
  display: flex;
  flex-direction: column;
  height: 100%;
  height: 100vh;
  height: -webkit-fill-available;
}
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  span:not(:last-child) {
    margin-right: 1em;
  }
  p {
    margin: 0;
  }
  margin-bottom: 1ex;
}
</style>
