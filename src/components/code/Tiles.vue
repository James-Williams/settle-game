<template>
  <div>
    <Header />
    <div class="tiles">
      <div v-for="(tile, idx) in tiles" class="entry" :key="idx">
        <Tile :type="tile"/>
        <pre>{{ tileJson(tile) }}</pre>
        <pre>{{ graphJson(tile) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>

import Tile from '../Tile'
import Header from '../Header'

import TileLibrary from '@/TileLibrary'
import Scoring from '@/Scoring'

export default {
  data () {
    return {
      tiles: TileLibrary.uniqueTiles()
    }
  },
  methods: {
    tileJson (tile) {
      return JSON.stringify(tile,null,2)
    },
    graphJson (tile) {
      return JSON.stringify(Scoring.tileGraph(tile),null,2)
    }
  },
  components: {
    Header,
    Tile
  }
}
</script>

<style scoped lang="scss">
.tiles {
  text-align: left;
  margin-left: 16px;
  margin-right: 16px;
}
div.entry {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  * {
    margin-right: 25px;
  }
}
pre {
  display: inline-block;
  overflow-y: scroll;
  max-height: 180px;
}
</style>
