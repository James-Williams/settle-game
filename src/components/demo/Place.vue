<template>
  <div class="page">
    <div class="fixed">
      <Header />
      <div class="controls">
        <span>
          <p><strong><span class="tiles-left">{{ this.tileList.size }}</span></strong> left</p>
          <p>
            <button @click="undoState" :disabled="!enableUndo">Undo</button>
            <button @click="redoState" :disabled="!enableRedo">Redo</button>
          </p>
        </span>
        <span>
          <Tile v-if="this.pickedTile" @clicked="rotatePickedTile" :type="pickedTile.toJS()" :selectable="true" :halfSize="true"/>
        </span>
        <span><p>Players</p><p v-html="playersHtml" /></span>
      </div>
    </div>
    <Board @clicked="place" @meepleClicked="meepleClicked" :grid="this.grid" :selectable="okSlots" :selectColor="currentPlayer"/>
  </div>
</template>

<script>
import Immutable from 'immutable'

import Tile from '../Tile'
import TilePicker from '../TilePicker'
import Board from '../Board'
import Header from '../Header'

import TileLibrary from '@/TileLibrary'
import GameState from '@/GameState'
import Moves from '@/Moves'
import Scoring from '@/Scoring'

export default {
  data () {
    return {
      pickedTile: null,
      pickedIdx: null,
      okSlots: {},
      tileList: Immutable.fromJS(this.tiles),
      gameStateHistory: Immutable.List().push(this.initGameState),
      gameStateIdx: 0
    }
  },
  props: {
    tiles: {
      type: Object,
      default: () => TileLibrary.allTiles()
    },
    initGameState: {
      type: Object,
      default: () => new GameState()
    }
  },
  methods: {
    undoState () {
      if (this.enableUndo) {
        this.gameStateIdx += 1
      }
    },
    redoState () {
      if (this.enableRedo) {
        this.gameStateIdx -= 1
      }
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
        this.updateState(this.gameState.setGrid(String(pos), Immutable.fromJS(this.grid.get(pos))
          .set('meepleSelect', null)
          .set('meeple', Immutable.fromJS({ position: meepleSlot, color: this.prevPlayer }))
        ))
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

              let newState = this.gameState
              newState = newState.setGrid(pos, newTile)

              // Clear old meeple selection
              newState.grid().keys().forEach((key) => {
                newState = newState.setGrid(key, Immutable.fromJS(newState.grid().get(key))
                  .set('meepleSelect', null)
                )
              })

              if (this.meepleCount(this.currentPlayer) > 0) {
                // Set meeple selection
                newTile = newTile.set('meepleSelect', Scoring.freeSlots(newState.grid(), pos))
                newTile = newTile.set('meepleSelectColor', this.currentPlayer)
              }
              newState = newState.setGrid(pos, newTile)
              this.updateState(newState)

              this.randomizePick()
            }
          }
        }
      }
    },
    meepleClicked (pos, meeple) {
      const ok = confirm('Remove meeple?')
      if (ok) {
        this.updateState(this.gameState.setGrid(String(pos), Immutable.fromJS(this.grid.get(pos))
          .set('meeple', null)
        ))
      }
    },
    meepleCount (player) {
      const meeplePlaced = this.grid.placedMeeple()
        .filter(x => x.get('color') === player)
        .size
      return this.gameState.config().get('startingMeeple') - meeplePlaced
    },
    updateState (newGameState) {
      if (this.gameStateIdx > 0) {
        this.gameStateHistory = this.gameStateHistory
          .slice(this.gameStateIdx)
          .unshift(newGameState)
        this.gameStateIdx = 0
      } else {
        this.gameStateHistory = this.gameStateHistory
          .unshift(newGameState)
      }
    }
  },
  created () {
    this.randomizePick()
  },
  computed: {
    enableUndo () {
      return this.gameStateIdx < this.gameStateHistory.size - 1
    },
    enableRedo () {
      return this.gameStateIdx > 0
    },
    gameState () {
      return this.gameStateHistory.get(this.gameStateIdx)
    },
    grid () {
      return this.gameState.grid()
    },
    tilesPlayed () {
      return this.grid.keys().length - 1
    },
    prevPlayer () {
      const idx = this.tilesPlayed % this.gameState.players().size
      return this.gameState.players().get((idx > 0) ? idx - 1 : this.gameState.players().size - 1)
    },
    currentPlayer () {
      return this.gameState.players().get(this.tilesPlayed % this.gameState.players().size)
    },
    playersHtml () {
      const count = (player) => { return this.meepleCount(player) }
      const countHtml = (player) => '(<span class="count">' + count(player) + '</span>)'
      return this.gameState.players()
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
  button {
    height: 28px;
  }
}
</style>
