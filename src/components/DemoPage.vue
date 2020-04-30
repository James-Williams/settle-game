<template>
  <div class="page">
    <div class="showcase">
      <Tile v-for="(tile, idx) in tiles" :type="tile" :key="idx"/>
    </div>
    <div>
      <Grid v-for="(grid, idx) in grids" :tiles="grid" :key="idx"/>
    </div>
  </div>
</template>

<script>

import Tile from './Tile'
import Grid from './Grid'

import TileLibrary from '@/TileLibrary'

export default {
  data () {
    return {
      tiles: TileLibrary.uniqueTiles(),
      grids: [
        {
          [String([0, 0])]: { 'sides': [ 'g', 'g', 'r', 'g' ], cloister: 1 },
          [String([1, 0])]: { 'sides': [ 'g', 'c', 'c', 'g' ] },
          [String([2, 0])]: { 'sides': [ 'g', 'r', 'r', 'c' ] },
          [String([3, 0])]: { 'sides': [ 'r', 'g', 'r', 'r' ] },

          [String([0, -1])]: { 'sides': [ 'r', 'r', 'g', 'g' ] },
          [String([1, -1])]: { 'sides': [ 'c', 'c', 'c', 'r' ] },
          [String([3, -1])]: { 'sides': [ 'r', 'g', 'g', 'g' ], cloister: 1 },

          [String([1, -2])]: { 'sides': [ 'c', 'c', 'r', 'r' ] },
          [String([3, -2])]: { 'sides': [ 'g', 'r', 'g', 'r' ] },

          [String([3, -2])]: { 'sides': [ 'g', 'g', 'g', 'g' ], cloister: 1 }

        },
        {
          [String([-1, 0])]: { 'sides': [ 'g', 'c', 'g', 'g' ] },
          [String([0, 0])]: { 'sides': [ 'c', 'g', 'g', 'c' ] },
          [String([0, 1])]: { 'sides': [ 'g', 'g', 'c', 'g' ] }
        }
      ]
    }
  },
  components: {
    Tile,
    Grid
  }
}
</script>

<style scoped lang="scss">
.page {
  div {
    margin-bottom: 15px;
  }
}
.showcase {
  svg {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
