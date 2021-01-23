import GameState from '@/GameState'
import Vue from 'vue'

export default class {
  constructor (gameId) {
    this.gameId = gameId
    this.state = Vue.observable({
      current: new GameState()
    })
  }

  get () {
    return this.state.current
  }

  newState (gameStateJs) {
    this.state.current = GameState.fromJS(gameStateJs)
  }

  hasHistory () {
    return false
  }

  resetHistory () {}
}
