import GameState from '@/GameState'
import axios from 'axios'
import { io } from 'socket.io-client'
import Vue from 'vue'

export default class {
  constructor (gameId) {
    this._gameId = gameId
    this._state = Vue.observable({
      gameState: new GameState(),
      current: {
        href: null,
        undoStack: [],
        redoStack: []
      }
    })

    const thisClass = this
    this._vue = new Vue({
      created () {
        this.$watch(() => thisClass._state.current.href, (val) => {
          thisClass._loadGameState()
        })
      }
    })

    axios.get('/api/game/' + this._gameId + '/state/current')
      .then((res) => {
        Vue.set(this._state, 'current', res.data.state)
      })
      .catch(() => {
        this.newState(new GameState())
      })

    io().on('newState' + this._gameId, (href) => {
      if (href.endsWith('current')) {
        this._loadCurrent()
      }
    })
  }

  _loadGameState () {
    axios.get(this._state.current.href)
      .then((res) => {
        console.log('Read GameState:', res.data)
        Vue.set(this._state, 'gameState', GameState.fromJS(res.data.state.gameState))
      })
  }

  _loadCurrent () {
    axios.get('/api/game/' + this._gameId + '/state/current')
      .then((res) => {
        console.log('Read Current:', res.data)
        Vue.set(this._state, 'current', res.data.state)
      })
  }

  get () {
    return this._state.gameState
  }

  newState (gameState) {
    axios.post('/api/game/' + this._gameId + '/state/', {
      gameState: gameState.toJS()
    }).then((res) => {
      const prevHref = this._state.current.href
      this._updateCurrent({...this._state.current,
        href: res.data.href,
        undoStack: prevHref ? this._state.current.undoStack.concat([prevHref]) : [],
        redoStack: []
      })
    })
  }

  _updateCurrent (newCurrent) {
    console.log('Update Current:', newCurrent)
    axios.put('/api/game/' + this._gameId + '/state/current',
      newCurrent
    )
  }

  canUndo () {
    return this._state.current.undoStack.length > 0
  }

  undo () {
    if (this.canUndo()) {
      const undoStack = this._state.current.undoStack
      const redoStack = this._state.current.redoStack
      this._updateCurrent({...this._state.current,
        redoStack: redoStack.concat([this._state.current.href]),
        undoStack: undoStack.slice(0, undoStack.length - 1),
        href: undoStack[undoStack.length - 1]
      })
    }
  }

  canRedo () {
    return this._state.current.redoStack.length > 0
  }

  redo () {
    if (this.canRedo()) {
      const undoStack = this._state.current.undoStack
      const redoStack = this._state.current.redoStack
      this._updateCurrent({...this._state.current,
        undoStack: undoStack.concat([this._state.current.href]),
        redoStack: redoStack.slice(0, redoStack.length - 1),
        href: redoStack[redoStack.length - 1]
      })
    }
  }
}
