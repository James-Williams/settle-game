import Immutable from 'immutable'

export default class {
  constructor (tiles) {
    this.tileMap = Immutable.fromJS(tiles)
  }

  keys () {
    return Immutable.List(this.tileMap.keys())
      .map((x) => x.split(',').map((x) => parseInt(x)))
      .toJS()
  }

  tiles () {
    return Immutable.List(this.tileMap.values())
  }

  placedMeeple () {
    return Immutable.List(this.tileMap.values())
      .filter(x => x.get('meeple'))
      .map(x => x.get('meeple'))
  }

  minX () { return Math.min(...this.keys().map((x) => x[0])) }
  maxX () { return Math.max(...this.keys().map((x) => x[0])) }
  minY () { return Math.min(...this.keys().map((x) => x[1])) }
  maxY () { return Math.max(...this.keys().map((x) => x[1])) }

  get (pos) {
    if (this.tileMap.has(String(pos))) {
      return this.tileMap.get(String(pos)).toJS()
    }
    return null
  }

  toJS () {
    return this.tileMap.toJS()
  }

  set (pos, tile) {
    return new this.constructor(this.tileMap.set(String(pos), tile))
  }
}
