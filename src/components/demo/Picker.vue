<template>
  <div class="page">
    <div class="fixed">
      <Header />
      <TilePicker @selected="clickTile"/>
    </div>
    <Board @clicked="place" :grid="getGrid" />
  </div>
</template>

<script>

import Grid from '@/Grid'

import Tile from '../Tile'
import TilePicker from '../TilePicker'
import Board from '../Board'
import Header from '../Header'

export default {
  data () {
    return {
      pickedTile: null,
      grid: {[String([0, 0])]: { blank: 1 }}
    }
  },
  methods: {
    clickTile (tile) {
      this.pickedTile = tile
    },
    place (pos) {
      if (this.pickedTile) {
        const newTile = JSON.parse(JSON.stringify(this.pickedTile))
        this.grid = {...this.grid, [String(pos)]: newTile}
      }
    },
    appHeight () {
      const doc = document.documentElement
      doc.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px')
    }
  },
  computed: {
    getGrid () {
      return new Grid(this.grid)
    }
  },
  created () {
    window.addEventListener('resize', this.appHeight)
    this.appHeight()
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
  height: calc(var(--vh, 1vh) * 100);
}
</style>
