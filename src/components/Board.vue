<template>
  <div class="wrap">
    <div class="grid">
      <div v-for="y in rangeY" :key="y">
        <div class="tile" v-for="x in rangeX" :key="x">
          <Tile @clicked="$emit('clicked', [x, y], $event)" :type="getTile(x, y)" :selectable="isSelectable(x, y)" :selectColor="selectColor" :halfSize="halfSize" :meeple="getMeeple(x, y)" :meepleSelect="getMeepleSelect(x, y)" :meepleSelectColor="getMeepleSelectColor(x, y)" @meepleClicked="$emit('meepleClicked', [x, y], $event)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tile from './Tile'

export default {
  props: {
    grid: {
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
    rangeX () {
      var rs = []
      var x = this.grid.minX() - 2
      while (x <= this.grid.maxX() + 2) {
        rs.push(x++)
      }
      return rs
    },
    rangeY () {
      var rs = []
      var x = this.grid.minY() - 2
      while (x <= this.grid.maxY() + 2) {
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
      const tile = this.grid.get([x, y])
      if (tile) return tile
      else return { blank: 1 }
    },
    getMeeple (x, y) {
      const tile = this.grid.get([x, y])
      if (tile) {
        return tile.meeple
      }
      return null
    },
    getMeepleSelect (x, y) {
      const tile = this.grid.get([x, y])
      if (tile) {
        return tile.meepleSelect
      }
      return null
    },
    getMeepleSelectColor (x, y) {
      const tile = this.grid.get([x, y])
      if (tile) {
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
