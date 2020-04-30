<template>
  <div class="page">
    <div>
      <Tile v-for="(tile, idx) in tiles" :type="tile" :key="idx"/>
    </div>
    <div>
      <Grid :tiles="grid"/>
    </div>
  </div>
</template>

<script>

import Tile from './Tile'
import Grid from './Grid'

export default {
  data () {
    return {
      tiles: [
        { 'sides': [ 'r', 'g', 'r', 'g' ] },
        { 'sides': [ 'c', 'c', 'r', 'r' ] },
        { 'sides': [ 'g', 'g', 'r', 'g' ], cloiser: 1 },
        { blank: 1 },
        { 'sides': [ 'g', 'c', 'c', 'g' ] }
      ],
      grid: {
        [String([-1, 0])]: { 'sides': [ 'g', 'c', 'g', 'g' ] },
        [String([0, 0])]: { 'sides': [ 'c', 'g', 'g', 'c' ] },
        [String([0, 1])]: { 'sides': [ 'g', 'g', 'c', 'g' ] }
      }
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
</style>
