<template>
  <div class="wrap">
    <div class="grid">
      <div v-for="y in rangeY" :key="y">
        <div class="tile" v-for="x in rangeX" :key="x">
          <Tile @clicked="$emit('clicked', [x, y], $event)" :type="getTile(x, y)" :selectable="isSelectable(x, y)" :selectColor="selectColor" :halfSize="halfSize" :meeple="getMeeple(x, y)" :meepleSelect="getMeepleSelect(x, y)" :meepleSelectColor="getMeepleSelectColor(x, y)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tile from './Tile'

export default {
  props: {
    tiles: {
      type: Object
    },
    selectable: {
      type: Object,
      default: () => { return {} }
    },
    selectColor: {
      type: String,
      default: 'blue'
    },
    halfSize: {
      type: Boolean,
      default: false
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
      var x = this.minX - 2
      while (x <= this.maxX + 2) {
        rs.push(x++)
      }
      return rs
    },
    rangeY () {
      var rs = []
      var x = this.minY - 2
      while (x <= this.maxY + 2) {
        rs.push(x++)
      }
      return rs.reverse()
    }
  },
  methods: {
    isSelectable (x, y) {
      return String([x, y]) in this.selectable
    },
    getTile (x, y) {
      const tile = this.tiles[String([x, y])]
      if (tile) return tile
      else return { blank: 1 }
    },
    getMeeple (x, y) {
      if ((String([x, y]) in this.tiles)) {
        const tile = this.tiles[String([x, y])]
        return tile.meeple
      }
      return null
    },
    getMeepleSelect (x, y) {
      if ((String([x, y]) in this.tiles)) {
        const tile = this.tiles[String([x, y])]
        return tile.meepleSelect
      }
      return null
    },
    getMeepleSelectColor (x, y) {
      if ((String([x, y]) in this.tiles)) {
        const tile = this.tiles[String([x, y])]
        return tile.meepleSelectColor
      }
      return null
    }
  },
  components: {
    Tile
  }
}
</script>

<style scoped lang="scss">
.wrap {
  flex: auto;
  position: relative;
}
.grid {
  background: grey;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: scroll;
  line-height: 0;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.tile {
  position: relative;
  display: inline-block;
}
</style>
