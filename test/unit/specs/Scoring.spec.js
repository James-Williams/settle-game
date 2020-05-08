import Scoring from '@/Scoring'

describe('meepleSlots', () => {

  it('one for each grass side', () => {
    const fullGrass = { sides: ['g', 'g', 'g', 'g'] }
    expect(Scoring.meepleSlots(fullGrass).sort())
      .toEqual([ [0,1], [0,-1], [1,0], [-1,0] ].sort())
  })

  it('one for each city side', () => {
    const fullCity = { sides: ['c', 'c', 'c', 'c'] }
    expect(Scoring.meepleSlots(fullCity).sort())
      .toEqual([ [0,1], [0,-1], [1,0], [-1,0] ].sort())
  })

  it('each side of a road too', () => {
    const upRoad = { sides: ['r', 'c', 'c', 'c'] }
    const rightRoad = { sides: ['c', 'r', 'c', 'c'] }
    const downRoad = { sides: ['c', 'c', 'r', 'c'] }
    const leftRoad = { sides: ['c', 'c', 'c', 'r'] }

    expect(Scoring.meepleSlots(upRoad).sort())
      .toEqual([ [0,1], [0,-1], [-1,0], [1,0], [-1,1], [1,1] ].sort())

    expect(Scoring.meepleSlots(rightRoad).sort())
      .toEqual([ [0,1], [0,-1], [-1,0], [1,0], [1,-1], [1,1] ].sort())

    expect(Scoring.meepleSlots(downRoad).sort())
      .toEqual([ [0,1], [0,-1], [-1,0], [1,0], [-1,-1], [1,-1] ].sort())

    expect(Scoring.meepleSlots(leftRoad).sort())
      .toEqual([ [0,1], [0,-1], [-1,0], [1,0], [-1,-1], [-1,1] ].sort())
  })

  it('two roads share a slot', () => {
    const cornerRoad = { sides: ['r', 'r', 'c', 'c'] }

    expect(Scoring.meepleSlots(cornerRoad).sort())
      .toEqual([ [0,1], [0,-1], [-1,0], [1,0], [-1,1], [1,1], [1,-1] ].sort())

    const cornerRoad2 = { sides: ['c', 'r', 'r', 'c'] }

    expect(Scoring.meepleSlots(cornerRoad2).sort())
      .toEqual([ [0,1], [0,-1], [-1,0], [1,0], [1,1], [1,-1], [-1,-1] ].sort())
  })

  it('Four roads give eight slots', () => {
    const fullRoad = { sides: ['r', 'r', 'r', 'r'] }

    expect(Scoring.meepleSlots(fullRoad).sort())
      .toEqual([
        [0,1], [0,-1], [-1,0], [1,0],
        [-1,-1], [-1,1], [1,-1], [1,1]
      ].sort())
  })

  it('Cloister has middle slot too', () => {
    const grassCloister = { sides: ['g', 'g', 'g', 'g'], cloister: true }
    const roadCloister = { sides: ['g', 'g', 'r', 'g'], cloister: true }

    expect(Scoring.meepleSlots(grassCloister).sort())
      .toEqual([
        [0,1], [0,-1], [-1,0], [1,0], [0,0]
      ].sort())

    expect(Scoring.meepleSlots(roadCloister).sort())
      .toEqual([
        [0,1], [0,-1], [-1,0], [1,0], [0,0]
      ].sort())
  })
})
