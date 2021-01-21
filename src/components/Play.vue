<template>
  <div class="page">
    <div class="fixed">
      <Header />
      <div class="controls">
        <span>
          <p><strong><span class="tiles-left">{{ this.gameState.tilesLeft() }}</span></strong></p>
          <p>
            <button class="large" @click="undoState" :disabled="!enableUndo">Undo</button>
            <button class="large" @click="redoState" :disabled="!enableRedo">Redo</button>
          </p>
        </span>
        <span class="tile">
          <Tile v-if="this.pickedTile" @clicked="rotatePickedTile" :type="pickedTile.toJS()" :selectable="true" :halfSize="true"/>
          <button v-if="showSkipMeeple" class="skip-meeple" @click="skipMeeple()">Don't Place a Meeple</button>
        </span>
        <span class="player" v-for="(player, idx) in this.gameState.players()" :key="'p' + idx">
          <PlayerInfo :color="player" :selected="player === gameState.currentPlayer()" :meepleCount="meepleCount(player)" :isComputer="computerPlayers.has(player)" @backgroundClick="toggleComputer(player)" @meepleClick="toggleComputer(player)" @scoreClick="updateScore(player)" :score="gameState.playerScore(player)" />
        </span>
        <!-- TODO - Don't use constant 5 here -->
        <span v-if="gameState.players().size < 5 && gameStateHistory.size <= 1">
            <button @click="addPlayer()">Add Player</button>
        </span>
        <!--
        <span class="players">
          <p>
            Players
          <p>
            <span v-for="(player, idx) in this.gameState.players()" :class="{player: true, selected: player == gameState.currentPlayer()}" :key="idx">
                <span v-if="isComputer(player)">(C) </span>{{ player }}
                <span>(<span class="count">{{ meepleCount(player) }}</span>)</span>
              </a>
            </span>
          </p>
        </span>
        -->
      </div>
    </div>
    <Board @clicked="place" @meepleClicked="meepleClicked" :grid="this.grid" :selectable="okSlots" :selectColor="gameState.currentPlayer()"/>
  </div>
</template>

<script>
import Immutable from 'immutable'
import { io } from 'socket.io-client'

import Tile from './Tile'
import TilePicker from './TilePicker'
import Board from './Board'
import Header from './Header'
import PlayerInfo from './PlayerInfo'

import GameState from '@/GameState'
import Moves from '@/Moves'
import Scoring from '@/Scoring'
import Greedy from '@/computer/Greedy'

export default {
  data () {
    return {
      pickedTile: null,
      gameId: undefined,
      okSlots: {},
      gameStateHistory: Immutable.List().push(this.initGameState),
      gameStateIdx: 0,
      computerPlayers: Immutable.Set()
    }
  },
  props: {
    initGameState: {
      type: Object,
      default: () => new GameState()
    }
  },
  methods: {
    updateScore (player) {
      const dScore = parseInt(prompt('Enter score to add', 0))
      if (dScore) {
        const newScore = this.gameState.playerScore(player) + dScore
        this.updateState(this.gameState.setScore(player, newScore))
      }
    },
    skipMeeple () {
      // Clear old meeple selection
      let newState = this.gameState
      this.grid.keys().forEach((key) => {
        newState = newState.setGrid(key, Immutable.fromJS(newState.grid().get(key))
          .set('meepleSelect', null)
        )
      })

      // TODO - This is not so good as it leaves an entry in the undo history
      this.updateState(newState)

      this.playerStart()
    },
    isComputer (player) {
      return this.computerPlayers.has(player)
    },
    toggleComputer (player) {
      if (this.gameStateHistory.size <= 1) {
        if (player !== this.gameState.currentPlayer()) {
          if (this.computerPlayers.has(player)) {
            this.computerPlayers = this.computerPlayers.delete(player)
          } else {
            this.computerPlayers = this.computerPlayers.add(player)
          }
        }
      } else {
        this.updateScore(player)
      }
    },
    addPlayer () {
      const ok = (this.gameStateHistory.size <= 1)
        ? true
        : confirm('Adding a player will restart the game. Are you sure?')
      if (ok) {
        const currentState = this.gameState
        this.gameStateIdx = 0
        this.gameStateHistory = Immutable.List().push(
          this.initGameState.setConfig(
            currentState.config().set('players',
              GameState.PLAYER_COLORS.slice(0, currentState.players().size + 1)
            )
          )
        )
      }
    },
    undoState () {
      if (this.enableUndo) {
        this.gameStateIdx += 1
        this.updatePick()
      }
    },
    redoState () {
      if (this.enableRedo) {
        this.gameStateIdx -= 1
        this.updatePick()
      }
    },
    updateOkSlots () {
      const okSlots = {}
      if (!this.isComputer(this.gameState.currentPlayer())) {
        if (this.pickedTile) {
          Moves.findSlots(
            this.grid,
            this.pickedTile.toJS()
          ).forEach((slot) => {
            okSlots[String(slot)] = slot
          })
        }
      }
      this.okSlots = okSlots
    },
    updatePick () {
      // TODO - Compute this directly from GameState + rotation
      this.pickedTile = this.gameState.nextTile()
      this.updateOkSlots()
    },
    rotatePickedTile () {
      this.pickedTile = Moves.rotateTile(this.pickedTile)
      this.updateOkSlots()
    },
    playerStart () {
      if (this.isComputer(this.gameState.currentPlayer())) {
        if (this.gameState.tilesLeft() > 0) {
          const move = Greedy.nextMove(this.gameState.grid(), this.pickedTile.toJS())
          if (move) {
            this.updateState(this.gameState.setGrid(
              move.position,
              Immutable.fromJS(move.tile)
            ))

            const freeSlots = Scoring.freeSlots(this.gameState.grid(), move.position)
            if (freeSlots.length > 0 &&
                this.meepleCount(this.gameState.prevPlayer()) > 0) {
              let bestSlot = null
              let bestScore = 0
              const graph = Scoring.tileGraph(move.tile)
              freeSlots.forEach(slot => {
                const type = graph.nodes[String(slot)].type
                let score = 0
                let prob = 1
                if (type === 'cloister') {
                  score = 4
                  prob = 0.9
                } else if (type === 'c') {
                  score = 3
                  prob = 0.6
                } else if (type === 'r') {
                  score = 2
                  prob = 0.3
                } else if (type === 'g') {
                  score = 1
                  prob = 0.1
                }
                if (score > bestScore && Math.random() <= prob) {
                  bestScore = score
                  bestSlot = slot
                }
              })
              if (bestSlot) {
                this.updateState(this.gameState.setGrid(
                  move.position,
                  Immutable.fromJS(this.grid.get(move.position))
                    .set('meepleSelect', null)
                    .set('meeple', Immutable.fromJS({ position: bestSlot, color: this.gameState.prevPlayer() }))
                ))
              }
            }
          }
          this.updateState(this.gameState.removeTile())
          this.playerStart()
        }
      }
    },
    place (pos, meepleSlot) {
      if (meepleSlot && this.meepleCount(this.gameState.prevPlayer()) > 0) {
        this.updateState(this.gameState.setGrid(String(pos), Immutable.fromJS(this.grid.get(pos))
          .set('meepleSelect', null)
          .set('meeple', Immutable.fromJS({ position: meepleSlot, color: this.gameState.prevPlayer() }))
        ))
        this.playerStart()
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
              let newState = this.gameState
              newState = newState.removeTile()
              newState = newState.setGrid(pos, newTile)

              // Clear old meeple selection
              newState.grid().keys().forEach((key) => {
                newState = newState.setGrid(key, Immutable.fromJS(newState.grid().get(key))
                  .set('meepleSelect', null)
                )
              })

              if (this.meepleCount(this.gameState.currentPlayer()) > 0) {
                // Set meeple selection
                newTile = newTile.set('meepleSelect', Scoring.freeSlots(newState.grid(), pos))
                newTile = newTile.set('meepleSelectColor', this.gameState.currentPlayer())
              }
              newState = newState.setGrid(pos, newTile)
              this.updateState(newState)

              if (this.meepleCount(this.gameState.prevPlayer()) === 0) {
                this.playerStart()
              }
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
      this.updatePick()
    },
    appHeight () {
      const doc = document.documentElement
      doc.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px')
    }
  },
  created () {
    const gameId = this.$route.params.gid
    this.gameId = gameId
    console.log('Game Id: ' + gameId)
    io().on('newState' + gameId, (href) => {
      console.log('Need to read: ' + href)
    })
    this.updatePick()
    window.addEventListener('resize', this.appHeight)
    this.appHeight()
  },
  computed: {
    showSkipMeeple () {
      if (this.computerPlayers.size === 0) return false
      const meepleSelect = this.grid.tiles()
        .map(x => x.get('meepleSelect'))
        .reduce((x, y) => x || y, false)
      return !!meepleSelect
    },
    canAddPlayers () {
      return this.gameState.players().size < GameState.PLAYER_COLORS.size
    },
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
    }
  },
  components: {
    Header,
    Tile,
    TilePicker,
    Board,
    PlayerInfo
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
  height: calc(var(--vh, 1vh) * 100);
}
.controls {
  margin: 0 1ex;
  display: flex;
  align-items: center;
  justify-content: center;
  & > span:not(:last-child) {
    margin-right: 0.75em;
  }
  span.player:not(:last-child) {
    margin-right: 0.75ex;
  }
  p {
    margin: 0;
  }
  margin-bottom: 1ex;
  button.large {
    height: 28px;
  }
  .tile {
    position: relative;
    .skip-meeple {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
    }
  }
}
a.nostyle:link {
    text-decoration: inherit;
    color: inherit;
}
a.nostyle:visited {
    text-decoration: inherit;
    color: inherit;
}
</style>
