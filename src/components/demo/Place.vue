<template>
  <div class="page">
    <div class="fixed">
      <Header />
      <div class="controls">
        <span>
          <p><strong><span class="tiles-left">{{ this.tileList.size }}</span></strong></p>
          <p>tiles left</p>
        </span>
        <span>
          <Tile v-if="this.pickedTile" @clicked="rotatePickedTile" :type="pickedTile.toJS()" :selectable="true" :halfSize="true"/>
        </span>
        <span><p>Players</p><p v-html="playersHtml" /></span>
      </div>
    </div>
    <Board @clicked="place" @meepleClicked="meepleClicked" :tiles="this.grid.toJS()" :selectable="okSlots" :selectColor="currentPlayer"/>
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
      currentPlayerIdx: 1,
      pickedTile: null,
      pickedIdx: null,
      okSlots: {},
      tileList: Immutable.fromJS(this.tiles),
      grid: new Grid({ [String([0, 0])]: Immutable.fromJS({ sides: [ 'c', 'r', 'g', 'r' ] }) })
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
        this.grid,
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
      if (meepleSlot && this.meepleCount(this.prevPlayer) > 0) {
        this.grid = this.grid.set(String(pos), Immutable.fromJS(this.grid.get(pos))
          .set('meepleSelect', null)
          .set('meeple', Immutable.fromJS({ position: meepleSlot, color: this.prevPlayer }))
        )
      } else {
        if (this.pickedTile) {
          let newTile = this.pickedTile

          if (!(this.grid.get(pos))) {
            const okSlots = {}
            Moves.findSlots(
              this.grid,
              newTile.toJS()
            ).forEach((slot) => {
              okSlots[String(slot)] = slot
            })
            if (String(pos) in okSlots) {
              this.tileList = this.tileList.splice(this.pickedIdx, 1)

              this.grid = this.grid.set(pos, newTile)

              // Clear old meeple selection
              Object.keys(this.grid).forEach((key) => {
                this.grid = this.grid.set(String(pos), Immutable.fromJS(this.grid.get(pos))
                  .set('meepleSelect', null)
                )
              })

              if (this.meepleCount(this.currentPlayer) > 0) {
                // Set meeple selection
                newTile = newTile.set('meepleSelect', Scoring.freeSlots(this.grid, pos))
                newTile = newTile.set('meepleSelectColor', this.currentPlayer)
                this.grid = this.grid.set(String(pos), newTile)
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
        this.grid = this.grid.set(String(pos), Immutable.fromJS(this.grid.get(pos))
          .set('meeple', null)
        )
      }
    },
    meepleCount (player) {
      const meeplePlaced = this.grid.placedMeeple()
        .filter(x => x.get('color') === player)
        .size
      return 7 - meeplePlaced
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
    },
    playersHtml () {
      const count = (player) => { return this.meepleCount(player) }
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
