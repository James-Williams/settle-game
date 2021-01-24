import GameState from '@/GameState'
import axios from 'axios'
import { io } from 'socket.io-client'
import Vue from 'vue'

export default class {
  constructor (gameId) {
    this._gameId = gameId
    this._state = Vue.observable({
      current: new GameState()
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
      this._loadState(href)
    })
  }

  _loadState (href) {
    axios.get(href)
      .then((res) => {
        console.log('Read:', res.data)
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

  hasHistory () {
    return false
  }

  canUndo () {
    return false
  }

  canRedo () {
    return false
  }

  resetHistory () {}
}
