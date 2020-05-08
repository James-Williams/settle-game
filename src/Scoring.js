
import Moves from '@/Moves'

export default class {
  static meepleSlots (tile) {
    const res = []

    if (tile.cloister) {
      return [ ...Moves.DIRECTIONS, [0, 0] ]
    }

    for (let i = 0; i < 4; i++) {
      const prevI = (i === 0) ? 3 : (i - 1)
      const prevSide = tile.sides[prevI]
      const side = tile.sides[i]
      const vec = Moves.DIRECTIONS[i]
      if (side === 'g' || side === 'c') {
        res.push(vec)
      }
      if (side === 'r') {
        res.push(vec)
        if (vec[0] === 0) {
          if (prevSide !== 'r') res.push([vec[1] * -1, vec[1]])
          res.push([vec[1] * 1, vec[1]])
        } else if (vec[1] === 0) {
          res.push([vec[0], vec[0] * -1])
          if (prevSide !== 'r') res.push([vec[0], vec[0] * 1])
        }
      }
    }
    return res
  }
}
