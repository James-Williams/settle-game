import Immutable from 'immutable'

export default class {
  constructor (tiles) {
    this.tiles = Immutable.fromJS(tiles)
  }

  keys () {
    return Immutable.List(this.tiles.keys())
      .map((x) => x.split(',').map((x) => parseInt(x)))
      .toJS()
  }

  placedMeeple () {
    return Immutable.List(this.tiles.values())
      .filter(x => x.get('meeple'))
      .map(x => x.get('meeple'))
  }

  minX () { return Math.min(...this.keys().map((x) => x[0])) }
  maxX () { return Math.max(...this.keys().map((x) => x[0])) }
  minY () { return Math.min(...this.keys().map((x) => x[1])) }
  maxY () { return Math.max(...this.keys().map((x) => x[1])) }

  get (pos) {
    if (this.tiles.has(String(pos))) {
      return this.tiles.get(String(pos)).toJS()
    }
    return null
  }

  toJS () {
    return this.tiles.toJS()
  }

  set (pos, tile) {
    return new this.constructor(this.tiles.set(String(pos), tile))
  }
}
