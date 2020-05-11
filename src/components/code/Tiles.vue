<template>
  <div>
    <Header />
    <div class="options">
      <input type="checkbox" v-model="showGraph">Show Graph</input>
    </div>
    <div class="tiles">
      <div v-for="(tile, idx) in tiles" class="entry" :key="idx">
        <span>
          <Tile :type="tile"/>
          <pre>{{ tileJson(tile) }}</pre>
        </span>
        <span v-if="showGraph">
          <TileGraph :graph="graph(tile)" />
          <pre>{{ graphJson(tile) }}</pre>
        </span>
      </div>
    </div>
  </div>
</template>

<script>

import Tile from '../Tile'
import TileGraph from '../TileGraph'
import Header from '../Header'

import TileLibrary from '@/TileLibrary'
import Scoring from '@/Scoring'

export default {
  data () {
    return {
      tiles: TileLibrary.uniqueTiles(),
      showGraph: false
    }
  },
  methods: {
    tileJson (tile) {
      return JSON.stringify(tile, null, 2)
    },
    graph (tile) {
      return Scoring.tileGraph(tile)
    },
    graphJson (tile) {
      return JSON.stringify(this.graph(tile), null, 2)
    }
  },
  components: {
    Header,
    Tile,
    TileGraph
  }
}
</script>

<style scoped lang="scss">
.tiles {
  text-align: left;
  margin-left: 16px;
  margin-right: 16px;
}
div.entry, span {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  * {
    margin-right: 50px;
  }
}
pre {
  display: inline-block;
  overflow-y: scroll;
  max-height: 180px;
}
</style>
