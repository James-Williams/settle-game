import Immutable from 'immutable'

export default {
  uniqueTiles () {
    // Do we need SEQ here?
    return Immutable.Seq(Immutable.fromJS(
      this.packed.map(x => x.tile)
    ))
  },
  allTiles () {
    let tiles = Immutable.List()
    this.packed.forEach((p) => {
      for (let i = 0; i < p.count; i++) {
        tiles = tiles.push(Immutable.fromJS(p.tile))
      }
    })
    return tiles
  },
  packed: [
    { label: 'Cloister',
      count: 4,
      tile: {
        sides: [ 'g', 'g', 'g', 'g' ],
        cloister: 1
      }
    },

    { label: 'Single city',
      count: 5,
      tile: {
        sides: [ 'c', 'g', 'g', 'g' ]
      }
    },

    { label: 'Bridge city',
      count: 1,
      tile: {
        sides: [ 'g', 'c', 'g', 'c' ]
      }
    },

    { label: 'Bonus bridge city',
      count: 2,
      tile: {
        sides: [ 'g', 'c', 'g', 'c' ],
        bonus: 1
      }
    },

    { label: 'Triple city',
      count: 3,
      tile: {
        sides: [ 'c', 'c', 'g', 'c' ]
      }
    },

    { label: 'Bonus triple city',
      count: 1,
      tile: {
        sides: [ 'c', 'c', 'g', 'c' ],
        bonus: 1
      }
    },

    { label: 'Bonus full city',
      count: 1,
      tile: {
        sides: [ 'c', 'c', 'c', 'c' ],
        bonus: 1
      }
    },

    { label: 'Corner city',
      count: 3,
      tile: {
        sides: [ 'c', 'c', 'g', 'g' ]
      }
    },

    { label: 'Bonus corner city',
      count: 2,
      tile: {
        sides: [ 'c', 'c', 'g', 'g' ],
        bonus: 1
      }
    },

    { label: 'Split double city',
      count: 3,
      tile: {
        sides: [ 'c', 'g', 'c', 'g' ],
        split: 1
      }
    },

    { label: 'Split side city',
      count: 2,
      tile: {
        sides: [ 'c', 'c', 'g', 'g' ],
        split: 1
      }
    },

    { label: 'Cloister with road',
      count: 2,
      tile: {
        sides: [ 'g', 'g', 'r', 'g' ],
        cloister: 1
      }
    },

    { label: 'Triple city with road',
      count: 1,
      tile: {
        sides: [ 'c', 'c', 'r', 'c' ]
      }
    },

    { label: 'Bonus triple city with road',
      count: 3,
      tile: {
        sides: [ 'c', 'c', 'r', 'c' ],
        bonus: 1
      }
    },

    { label: 'Straight road',
      count: 8,
      tile: {
        sides: [ 'g', 'r', 'g', 'r' ]
      }
    },

    { label: 'Straight road with city',
      count: 4,
      tile: {
        sides: [ 'c', 'r', 'g', 'r' ]
      }
    },

    { label: 'Corner city with corner road',
      count: 3,
      tile: {
        sides: [ 'c', 'c', 'r', 'r' ]
      }
    },

    { label: 'Bonus corner city with corner road',
      count: 2,
      tile: {
        sides: [ 'c', 'c', 'r', 'r' ],
        bonus: 1
      }
    },

    { label: 'Corner road',
      count: 9,
      tile: {
        sides: [ 'g', 'g', 'r', 'r' ]
      }
    },

    { label: 'Corner road with left city',
      count: 3,
      tile: {
        sides: [ 'c', 'g', 'r', 'r' ]
      }
    },

    { label: 'Corner road with right city',
      count: 3,
      tile: {
        sides: [ 'c', 'r', 'r', 'g' ]
      }
    },

    { label: 'Three-way cross-road',
      count: 4,
      tile: {
        sides: [ 'g', 'r', 'r', 'r' ]
      }
    },

    { label: 'Three-way cross-road with city',
      count: 3,
      tile: {
        sides: [ 'c', 'r', 'r', 'r' ]
      }
    },

    { label: 'Four-way cross-road',
      count: 1,
      tile: {
        sides: [ 'r', 'r', 'r', 'r' ]
      }
    }
  ]
}
