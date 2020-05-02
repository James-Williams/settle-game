
export default class {
  constructor (tiles) {
    this.tiles = {}
    Object.keys(tiles).forEach((k) => {
      this.tiles[k] = tiles[k]
    })
  }

  keys () {
    return Object.keys(this.tiles)
      .map((x) => x.split(',').map((x) => parseInt(x)))
  }

  minX () { return Math.min(...this.keys().map((x) => x[0])) }
  maxX () { return Math.max(...this.keys().map((x) => x[0])) }
  minY () { return Math.min(...this.keys().map((x) => x[1])) }
  maxY () { return Math.max(...this.keys().map((x) => x[1])) }

  get (pos) {
    if (pos.length !== 2) throw new Error('Invalid grid position')

    if (String(pos) in this.tiles) {
      return JSON.parse(JSON.stringify(this.tiles[String(pos)]))
    }
    return null
  }
}
