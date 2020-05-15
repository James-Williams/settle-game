import Immutable from 'immutable'

export default class {
  constructor (grid) {
    this.state = Immutable.fromJS({
      grid: grid,
      players: ['red', 'orange', 'black']
    })
  }

  grid () {
    return this.state.get('grid')
  }

  players () {
    return this.state.get('players')
  }

  setGrid (pos, tile) {
    return new this.constructor(this.grid().set(pos, tile))
  }
}
