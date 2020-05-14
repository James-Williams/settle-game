import Grid from '@/Grid'
import Moves from '@/Moves'
import Immutable from 'immutable'

describe('rotateTile', () => {
  it('should rotate a road cloister', () => {
    const roadCloister = Immutable.fromJS({
      sides: [ 'g', 'g', 'r', 'g' ],
      cloister: true
    })

    expect(Moves.rotateTile(roadCloister))
      .toEqual(Immutable.fromJS({
        sides: [ 'g', 'g', 'g', 'r'],
        cloister: true
      }))
  })
})

describe('findSlots', () => {
  it('should return all sides for full city', () => {
    const fullCity = { sides: ['c', 'c', 'c', 'c'] }

    const grid = new Grid({
      [String([0,0])]: fullCity
    })

    expect(Moves.findSlots(grid, fullCity).sort())
      .toEqual(Moves.DIRECTIONS.sort())

    const grid2 = new Grid({
      [String([1,-1])]: fullCity
    })
    const expected2 = [
      [1, 0],
      [2, -1],
      [1, -2],
      [0, -1]
    ]

    expect(Moves.findSlots(grid2, fullCity).sort())
      .toEqual(expected2.sort())
  })

  it('should go all around', () => {
    const fullCity = { sides: ['c', 'c', 'c', 'c'] }

    const grid = new Grid({
      [String([0,0])]: fullCity,
      [String([0,1])]: fullCity,
      [String([1,0])]: fullCity,
      [String([1,1])]: fullCity
    })

    expect(Moves.findSlots(grid, fullCity).length).toEqual(8)
  })

  it('should take in multiple sides', () => {
    const fullCity = { sides: ['c', 'c', 'c', 'c'] }
    const upCity = { sides: ['c', 'g', 'g', 'g'] }
    const fullRoad = { sides: ['r', 'r', 'r', 'r'] }

    const grid = new Grid({
      [String([0,0])]: upCity,
      [String([1,1])]: fullRoad
    })

    expect(Moves.findSlots(grid, fullCity))
    .toEqual([])
  })

  it('should check all sides', () => {
    const cityN = { sides: ['c', 'g', 'g', 'g'] }
    const cityE = { sides: ['g', 'c', 'g', 'g'] }
    const cityS = { sides: ['g', 'g', 'c', 'g'] }
    const cityW = { sides: ['g', 'g', 'g', 'c'] }
    const fullCity = { sides: ['c', 'c', 'c', 'c'] }

    const grid = new Grid({
      [String([0,1])]: cityS,
      [String([0,-1])]: cityN,
      [String([1,0])]: cityW,
      [String([-1,0])]: cityE
    })

    expect(Moves.findSlots(grid, fullCity))
      .toEqual([
        [0, 0]
      ])
  })
})

describe('canJoin()', () => {

  it('should accept road connections', () => {
    const t1 = { sides: ['g', 'r', 'c', 'r'] }
    const t2 = { sides: ['g', 'r', 'c', 'r'] }

    expect(Moves.canJoin(t1, t2, [ 1,  0])).toEqual(true)
    expect(Moves.canJoin(t1, t2, [-1,  0])).toEqual(true)
    expect(Moves.canJoin(t1, t2, [ 0,  1])).toEqual(false)
    expect(Moves.canJoin(t1, t2, [ 0, -1])).toEqual(false)
  })

  it('should accept any full city', () => {
    const t1 = { sides: ['c', 'c', 'c', 'c'] }
    const t2 = { sides: ['c', 'c', 'c', 'c'] }

    expect(Moves.canJoin(t1, t2, [1, 0]))
      .toEqual(true)
    expect(Moves.canJoin(t1, t2, [-1, 0]))
      .toEqual(true)
    expect(Moves.canJoin(t1, t2, [0, 1]))
      .toEqual(true)
    expect(Moves.canJoin(t1, t2, [0, -1]))
      .toEqual(true)
  })

  it('should reject all mismatch', () => {
    const t1 = { sides: ['g', 'g', 'g', 'g'] }
    const t2 = { sides: ['r', 'r', 'r', 'r'] }

    expect(Moves.canJoin(t1, t2, [1, 0]))
      .toEqual(false)
    expect(Moves.canJoin(t1, t2, [-1, 0]))
      .toEqual(false)
    expect(Moves.canJoin(t1, t2, [0, 1]))
      .toEqual(false)
    expect(Moves.canJoin(t1, t2, [0, -1]))
      .toEqual(false)
  })

  it('should throw if not adjacent', () => {
    const t1 = { sides: ['g', 'g', 'g', 'g'] }

    expect(() => {
      Moves.canJoin(t1, t1, [0, 0])
    }).toThrow('Unit vector expected')

    expect(() => {
      Moves.canJoin(t1, t1, [1, 1])
    }).toThrow('Unit vector expected')

    expect(() => {
      Moves.canJoin(t1, t1, [-1, 1])
    }).toThrow('Unit vector expected')
    expect(() => {
      Moves.canJoin(t1, t1, [10, 0])
    }).toThrow('Unit vector expected')
  })
})
