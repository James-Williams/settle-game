import Scoring from '@/Scoring'
import Grid from '@/Grid'

describe('gridGraph', () => {

  it('two cites are connected', () => {
    const fullCity = { sides: ['c', 'c', 'c', 'c'] }

    const grid = new Grid({
      [String([0,0])]: fullCity,
      [String([1,0])]: fullCity
    })

    const graph = Scoring.gridGraph(grid)

    expect(graph.adj[String([0,0,1,0])])
      .toContain(String([1,0,-1,0]))
    expect(graph.adj[String([0,0,1,0])].size)
      .toEqual(3)
    expect(graph.adj[String([1,0,-1,0])])
      .toContain(String([0,0,1,0]))
    expect(graph.adj[String([1,0,-1,0])].size)
      .toEqual(3)
  })
})

describe('partitionGraph', () => {

  it('should find partitions on generic graph', () => {
    const graph = {
      nodes: {
        0: {a:'b'},
        1: {c:'d'},
        A: {1:2}
      },
      adj: {
        0: new Set(['1']),
        1: new Set(['0']),
        A: new Set()
      }
    }

    expect(Scoring.partitionGraph(graph))
      .toEqual({
        partitions: {
          0: new Set(['0', '1']),
          1: new Set(['A'])
        },
        membership: {
          0: '0',
          1: '0',
          A: '1'
        }
      })
  })
  it('should be transitive', () => {
    const graph = {
      nodes: {
        0: {a:'b'},
        1: {c:'d'},
        2: {1:2},
        3: {3:4}
      },
      adj: {
        0: new Set(['3']),
        1: new Set(['2','3']),
        2: new Set(['1']),
        3: new Set(['1','0']),
      }
    }

    expect(Scoring.partitionGraph(graph))
      .toEqual({
        partitions: {
          0: new Set(['3', '0', '1', '2']),
        },
        membership: {
          0: '0',
          1: '0',
          2: '0',
          3: '0'
        }
      })
  })
})

describe('globalTileGraph', () => {

  it('Graph for full city with meeple', () => {
    const fullCity = {
      sides: ['c', 'c', 'c', 'c'],
      meeple: { position: [0, 1], color: 'orange' }
    }

    expect(Scoring.globalTileGraph(fullCity, [1,1]))
      .toEqual({
        adj: {
          [String([1,1, 1,0])]: new Set([ String([1,1,0,-1]), String([1,1,0,1]) ]),
          [String([1,1,-1,0])]: new Set([ String([1,1,0,-1]), String([1,1,0,1]) ]),
          [String([1,1,0, 1])]: new Set([ String([1,1,-1,0]), String([1,1,1,0]) ]),
          [String([1,1,0,-1])]: new Set([ String([1,1,-1,0]), String([1,1,1,0]) ])
        },
        nodes: {
          [String([1,1, 1,0])]: { type: 'c', pos: [1,1], ofst: [1,0] },
          [String([1,1,-1,0])]: { type: 'c', pos: [1,1], ofst: [-1,0] },
          [String([1,1,0, 1])]: { type: 'c', pos: [1,1], ofst: [0,1], meeple: {...fullCity.meeple} },
          [String([1,1,0,-1])]: { type: 'c', pos: [1,1], ofst: [0,-1] }
        }
      })
  })
})

describe('tileGraph', () => {

  it('Graph for full city with meeple', () => {
    const fullCity = {
      sides: ['c', 'c', 'c', 'c'],
      meeple: { position: [0, 1], color: 'orange' }
    }

    expect(Scoring.tileGraph(fullCity))
      .toEqual({
        adj: {
          [String([ 1,0])]: new Set([ String([0,-1]), String([0,1]) ]),
          [String([-1,0])]: new Set([ String([0,-1]), String([0,1]) ]),
          [String([0, 1])]: new Set([ String([-1,0]), String([1,0]) ]),
          [String([0,-1])]: new Set([ String([-1,0]), String([1,0]) ])
        },
        nodes: {
          [String([ 1,0])]: { type: 'c', ofst: [1,0] },
          [String([-1,0])]: { type: 'c', ofst: [-1,0] },
          [String([0, 1])]: { type: 'c', ofst: [0,1], meeple: {...fullCity.meeple} },
          [String([0,-1])]: { type: 'c', ofst: [0,-1] }
        }
      })
  })
})

describe('freeSlots', () => {

  it('all slots free on single tile', () => {
    const fullCity = { sides: ['c', 'c', 'c', 'c'] }

    const grid = new Grid({
      [String([0,0])]: fullCity
    })

    expect(Scoring.freeSlots(grid, [0, 0]).sort())
    .toEqual([ [0,-1], [0,1], [-1,0], [1,0] ].sort())
  })

  it('all slots free on neighbour tiles', () => {
    const fullCity = { sides: ['c', 'c', 'c', 'c'] }

    const grid = new Grid({
      [String([0,0])]: fullCity,
      [String([1,0])]: fullCity
    })

    expect(Scoring.freeSlots(grid, [1, 0]).sort())
    .toEqual([ [0,-1], [0,1], [-1,0], [1,0] ].sort())
  })

  it('no slots free on tile with meeple', () => {
    const meepleCity = {
      sides: ['c', 'c', 'c', 'c'],
      meeple: { position: [0, 1] }
    }

    const grid = new Grid({
      [String([0,0])]: meepleCity,
    })

    expect(Scoring.freeSlots(grid, [0, 0]).sort())
    .toEqual([].sort())
  })

  it('no slots free on neighbour tiles with meeple', () => {
    const fullCity = { sides: ['c', 'c', 'c', 'c'] }
    const meepleCity = {
      sides: ['c', 'c', 'c', 'c'],
      meeple: { position: [0, 1] }
    }

    const grid = new Grid({
      [String([0,0])]: meepleCity,
      [String([1,0])]: fullCity
    })

    expect(Scoring.freeSlots(grid, [1, 0]).sort())
    .toEqual([].sort())
  })
})

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
