<template>
  <div>
    <Tile v-for="(tile, idx) in tiles" :type="tile" :key="idx"/>
  </div>
</template>

<script>

import Tile from './Tile'

export default {
  data () {
    return {
      tiles: [
        { 'sides': [ 'r', 'g', 'r', 'g' ] },
        { 'sides': [ 'c', 'c', 'r', 'r' ] },
        { 'sides': [ 'g', 'g', 'r', 'g' ], cloiser: 1 },
        { blank: 1 },
        { 'sides': [ 'g', 'c', 'c', 'g' ] }
      ]
    }
  },
  components: {
    Tile
  }
}
</script>

<style scoped>
</style>
