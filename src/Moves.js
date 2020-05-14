import Immutable from 'immutable'

export default class {
  static DIRECTIONS = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ]

  static rotateTile (tile) {
    const ss = []
    const sides = tile.get('sides')
    for (var i = 0; i < sides.size; i++) {
      ss.push(sides.get((i + sides.size - 1) % sides.size))
    }
    return tile.set('sides', Immutable.fromJS(ss))
  }

  static canJoin (t1, t2, vec) {
    if ((Math.abs(vec[0]) + Math.abs(vec[1])) !== 1) {
      throw new Error('Unit vector expected')
    }
    const idx1 = vec[0] ? (vec[0] === 1 ? 1 : 3) : (vec[1] === 1 ? 0 : 2)
    const idx2 = (idx1 + 2) % 4
    return t1.sides[idx1] === t2.sides[idx2]
  }

  static findSlots (grid, tile) {
    const slots = {}

    for (let x = grid.minX() - 1; x <= grid.maxX() + 1; x++) {
      for (let y = grid.minY() - 1; y <= grid.maxY() + 1; y++) {
        const pos = [x, y]
        if (!grid.get(pos)) {
          let ok = true
          let any = false
          this.DIRECTIONS.forEach((d) => {
            const t = grid.get([pos[0] + d[0], pos[1] + d[1]])
            if (t) {
              if (this.canJoin(tile, t, d)) {
                any = true
              } else {
                ok = false
              }
            }
          })
          if (any && ok) {
            slots[String(pos)] = pos
          }
        }
      }
    }

    return Object.keys(slots)
      .map((x) => x.split(',').map((x) => parseInt(x)))
  }
}
