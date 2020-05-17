import Greedy from '@/computer/Greedy'
import Grid from '@/Grid'
import Moves from '@/Moves'
import Immutable from 'immutable'

describe('nextMove', () => {
  it('should go in the only valid place', () => {
    const grid = new Grid({})
      .set([0, 0], Immutable.fromJS({ sides: ['g', 'c', 'g', 'g'] }))

    const fullCity = { sides: ['c', 'c', 'c', 'c'] }

    expect(Greedy.nextMove(grid, fullCity))
      .toEqual({
        tile: fullCity,
        position: [1, 0]
      })
  })

  it('should rotate the tile to fit', () => {
    const grid = new Grid({})
      .set([0, 0], Immutable.fromJS({ sides: ['r', 'c', 'r', 'r'] }))

    const singleCity = { sides: ['g', 'c', 'g', 'g'] }
    const rotatedCity = { sides: ['g', 'g', 'g', 'c'] }

    expect(Greedy.nextMove(grid, singleCity))
      .toEqual({
        tile: rotatedCity,
        position: [1, 0]
      })
  })

  it('should prefer cities to roads', () => {
    const grid = new Grid({})
      .set([0, 0], Immutable.fromJS({ sides: ['r', 'r', 'r', 'c'] }))

    const singleCity = { sides: ['r', 'r', 'c', 'r'] }
    const rotatedCity = { sides: ['r', 'c', 'r', 'r'] }

    expect(Greedy.nextMove(grid, singleCity))
      .toEqual({
        tile: rotatedCity,
        position: [-1, 0]
      })
  })

  it('should prefer three roads over a city', () => {
    const grid = new Grid({})
      .set([ 0, 1], Immutable.fromJS({ sides: ['c', 'g', 'r', 'g'] }))
      .set([-1, 0], Immutable.fromJS({ sides: ['g', 'r', 'g', 'g'] }))
      .set([ 1, 0], Immutable.fromJS({ sides: ['g', 'g', 'g', 'r'] }))

    const singleCity = { sides: ['c', 'r', 'r', 'r'] }
    const rotatedCity = { sides: ['r', 'r', 'c', 'r'] }

    expect(Greedy.nextMove(grid, singleCity))
      .toEqual({
        tile: rotatedCity,
        position: [0, 0]
      })
  })

  it('should prefer three grass over a road', () => {
    const grid = new Grid({})
      .set([ 0, 1], Immutable.fromJS({ sides: ['c', 'r', 'g', 'r'] }))
      .set([-1, 0], Immutable.fromJS({ sides: ['r', 'g', 'r', 'r'] }))
      .set([ 1, 0], Immutable.fromJS({ sides: ['r', 'r', 'r', 'g'] }))

    const singleCity =  { sides: ['g', 'g', 'r', 'g'] }
    const rotatedCity = { sides: ['g', 'g', 'r', 'g'] }

    expect(Greedy.nextMove(grid, singleCity))
      .toEqual({
        tile: rotatedCity,
        position: [0, 0]
      })
  })
})

