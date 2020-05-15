import Immutable from 'immutable'

export default class {
  constructor (grid) {
    this.state = Immutable.fromJS({
      grid: grid,
      config: {
        players: ['red', 'orange', 'black'],
        startingMeeple: 7
      }
    })
  }

  grid () {
    return this.state.get('grid')
  }

  players () {
    return this.state.get('config').get('players')
  }

  config () {
    return this.state.get('config')
  }

  setGrid (pos, tile) {
    return new this.constructor(this.grid().set(pos, tile))
  }
}
