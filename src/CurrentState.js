import GameState from '@/GameState'
import axios from 'axios'
import { io } from 'socket.io-client'
import Vue from 'vue'

export default class {
  constructor (gameId) {
    this._gameId = gameId
    this._state = Vue.observable({
      current: new GameState(),
      currentHref: null,
      undoStack: [],
      redoStack: []
    })

    axios.get('/api/game/' + this._gameId + '/state/')
      .then((res) => {
        const href = res.data.latest
        this._loadState(href)
      })
      .catch(() => {
        this.newState(new GameState())
      })

    io().on('newState' + this._gameId, (href) => {
      if (this._state.currentHref) {
          this._state.undoStack.push(this._state.currentHref)
      }
      this._state.redoStack = []
      this._loadState(href)
    })
  }

  _loadState (href) {
    axios.get(href)
      .then((res) => {
        console.log('Read:', res.data)
        this._state.currentHref = href
        this._state.current = GameState.fromJS(res.data.state.gameState)
      })
  }

  get () {
    return this._state.current
  }

  newState (gameState) {
    axios.post('/api/game/' + this._gameId + '/state/', {
      gameState: gameState.toJS()
    })
  }

  canUndo () {
    return this._state.undoStack.length > 0
  }

  undo () {
    if(this.canUndo()) {
        this._state.redoStack.push(this._state.currentHref)
        this._loadState(this._state.undoStack.pop())
    }
  }

  canRedo () {
    return this._state.redoStack.length > 0
  }

  redo () {
    if(this.canRedo()) {
        this._state.undoStack.push(this._state.currentHref)
        this._loadState(this._state.redoStack.pop())
    }
  }
}
