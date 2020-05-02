<template>
  <div class="grid">
    <div v-for="y in rangeY" :key="y">
      <Tile @clicked="$emit('clicked', [x, y])" v-for="x in rangeX" :type="getTile(x, y)" :key="x"/>
    </div>
  </div>
</template>

<script>
import Tile from './Tile'

export default {
  props: {
    tiles: {
      type: Object
    }
  },
  computed: {
    keys () {
      return Object.keys(this.tiles)
        .map((x) => x.split(',').map((x) => parseInt(x)))
    },
    // TODO - Use Grid Object!
    minX () { return Math.min(...this.keys.map((x) => x[0])) },
    maxX () { return Math.max(...this.keys.map((x) => x[0])) },
    minY () { return Math.min(...this.keys.map((x) => x[1])) },
    maxY () { return Math.max(...this.keys.map((x) => x[1])) },
    rangeX () {
      var rs = []
      var x = this.minX - 1
      while (x <= this.maxX + 1) {
        rs.push(x++)
      }
      return rs
    },
    rangeY () {
      var rs = []
      var x = this.minY - 1
      while (x <= this.maxY + 1) {
        rs.push(x++)
      }
      return rs.reverse()
    }
  },
  methods: {
    getTile (x, y) {
      const tile = this.tiles[String([x, y])]
      if (tile) return tile
      else return { blank: 1, selectable: 1 }
    }
  },
  components: {
    Tile
  }
}
</script>

<style scoped lang="scss">
.grid {
  background: grey;
  padding: 25px;
  white-space: nowrap;
}
</style>
