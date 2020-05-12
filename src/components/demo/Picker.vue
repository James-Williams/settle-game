<template>
  <div class="page">
    <div class="fixed">
      <Header />
      <TilePicker @selected="clickTile"/>
    </div>
    <Board v-for="(grid, idx) in grids" @clicked="place" :tiles="grid" :key="idx" />
  </div>
</template>

<script>

import Tile from '../Tile'
import TilePicker from '../TilePicker'
import Board from '../Board'
import Header from '../Header'

export default {
  data () {
    return {
      pickedTile: null,
      grids: [
        {[String([0, 0])]: { blank: 1 }}
      ]
    }
  },
  methods: {
    clickTile (tile) {
      this.pickedTile = tile
    },
    place (pos) {
      if (this.pickedTile) {
        const newTile = JSON.parse(JSON.stringify(this.pickedTile))
        var grid = {...this.grids[0], [String(pos)]: newTile}
        this.grids = {...this.grids, 0: grid}
      }
    }
  },
  components: {
    Header,
    Tile,
    TilePicker,
    Board
  }
}
</script>

<style scoped lang="scss">
.page {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  height: 100vh;
  height: -webkit-fill-available;
}
</style>
