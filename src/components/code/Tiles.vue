<template>
  <div>
    <Header />
    <div class="options">
      <input type="checkbox" id="showGraph" v-model="showGraph" />
      <label for="showGraph">Show Graph</label>
      <input type="checkbox" id="hideBonus" v-model="hideBonus" />
      <label for="hideBonus">Hide Bonus Tiles</label>
      <input type="checkbox" id="rotate90" v-model="rotate90" />
      <label for="rotate90">Rotate 90&deg;</label>
      <input type="checkbox" id="rotate180" v-model="rotate180" />
      <label for="rotate180">Rotate 180&deg;</label>
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
import Moves from '@/Moves'

export default {
  data () {
    return {
      allTiles: TileLibrary.uniqueTiles(),
      showGraph: true,
      hideBonus: true,
      rotate90: false,
      rotate180: false
    }
  },
  computed: {
    tiles () {
      let tiles = this.allTiles.filter((tile) => {
        return !this.hideBonus || !tile.bonus
      })
      if (this.rotate90) {
        tiles = tiles.map((x) => Moves.rotateTile(
          JSON.parse(JSON.stringify(x))
        ))
      }
      if (this.rotate180) {
        tiles = tiles.map((x) => Moves.rotateTile(
          Moves.rotateTile(
            JSON.parse(JSON.stringify(x))
          )
        ))
      }
      return tiles
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
label {
  margin-right: 15px;
}
</style>
