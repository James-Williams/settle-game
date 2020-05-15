import Immutable from 'immutable'
import Grid from '@/Grid'

export default class {
  constructor (grid, config) {
    if (!grid) {
      grid = new Grid({
        [String([0, 0])]: Immutable.fromJS({
          sides: [ 'c', 'r', 'g', 'r' ]
        })
      })
    }

    if (!config) {
      config = {
        players: ['red', 'orange', 'black'],
        startingMeeple: 7
      }
    }

    this.state = Immutable.fromJS({
      grid: grid,
      config: config
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
