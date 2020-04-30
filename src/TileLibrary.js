
export default {
  uniqueTiles () {
    return this.packed.map((x) => x.tile)
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
        sides: [ 'g', 'c', 'g', 'c' ]
      },
      bonus: 1
    },

    { label: 'Cloister with road',
      count: 2,
      tile: {
        sides: [ 'g', 'g', 'r', 'g' ],
        cloister: 1
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
      count: 2,
      tile: {
        sides: [ 'r', 'r', 'r', 'r' ]
      }
    }
  ]
}
