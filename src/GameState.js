import Immutable from 'immutable'
import Grid from '@/Grid'
import TileLibrary from '@/TileLibrary'

export default class {
  static PLAYER_COLORS = Immutable.List(['red', 'orange', 'aqua', 'fuchsia', 'black'])

  constructor (state) {
    let grid = state && state.grid
    let config = state && state.config
    let tileList = state && state.tileList
    if (!grid) {
      grid = new Grid({
        [String([0, 0])]: Immutable.fromJS({
          sides: [ 'c', 'r', 'g', 'r' ]
        })
      })
    }

    if (!config) config = {}

    if (!config.players) config.players = ['red', 'orange'].slice(0, 1)
    if (!config.startingMeeple) config.startingMeeple = 7

    if (!tileList) {
      tileList = TileLibrary.allTiles()
      // Shuffle
      for (let i = tileList.size; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        const t = tileList.get(i)
        tileList = tileList.set(i, tileList.get(j))
        tileList = tileList.set(j, t)
      }
    }

    this.state = Immutable.fromJS({
      grid: grid,
      config: config,
      tileList: tileList
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

  nextTile () {
    return this.state.get('tileList').get(0)
  }

  tilesLeft () {
    return this.state.get('tileList').size
  }

  tilesPlayed () {
    return this.grid().keys().length - 1
  }

  currentPlayer () {
    return this.players().get(this.tilesPlayed() % this.players().size)
  }

  prevPlayer () {
    const idx = this.tilesPlayed() % this.players().size
    return this.players().get((idx > 0) ? idx - 1 : this.players().size - 1)
  }

  removeTile () {
    return new this.constructor({
      grid: this.grid(),
      config: this.config(),
      tileList: this.state.get('tileList').shift()
    })
  }

  setGrid (pos, tile) {
    return new this.constructor({
      grid: this.grid().set(pos, tile),
      config: this.config(),
      tileList: this.state.get('tileList')
    })
  }

  setConfig (config) {
    return new this.constructor({
      grid: this.grid(),
      config: Immutable.fromJS(config),
      tileList: this.state.get('tileList')
    })
  }

  toJS () {
    return {
      grid: this.grid().toJS(),
      config: this.config().toJS(),
      tileList: this.state.get('tileList').toJS()
    }
  }
}
