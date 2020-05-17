import Immutable from 'immutable'
import Scoring from '@/Scoring'
import Moves from '@/Moves'

export default class {

  static nextMove (grid, tile) {

    let bestScore = 0
    let best = null
    
    for (let i = 0; i < 4; i++) {
      const slots = Moves.findSlots(grid, tile)
      if (slots.length > 0) {
        slots.forEach((slot) => {

          let score = 0
          for (let dx = 0; dx < 4; dx++) {
            const dir = Moves.DIRECTIONS[dx]
            const ofst = [slot[0] + dir[0], slot[1] + dir[1]]
            if (grid.get(ofst)) {
              const otherTile = grid.get(ofst)
              const type = otherTile.sides[(dx + 2) % 4]
              if (type === 'c') {
                score += 4
              } else if (type === 'r') {
                score += 2
              } else if (type === 'g') {
                score += 1
              }
            }
          }

          if (score > bestScore) {
            best = {
              tile: tile,
              position: slot
            }
            bestScore = score
          }
        })
      }
      tile = Moves.rotateTile(Immutable.fromJS(tile)).toJS()
    }
    return best
  }
}
