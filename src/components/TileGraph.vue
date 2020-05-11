<template>
  <div :class="{tile: true, halfSize: halfSize}">
    <svg style="background: light-blue">

      <path v-for="(node, idx) in nodes" :key="'p' + idx" d="M-5 -5 L5 5 M-5 5 L5 -5" :style="{stroke: 'black', transform: nodeTransform(node)}" />

      <line v-for="(edge, idx) in edges" :key="'l' + idx" :x1="svgPos(edge[0])[0]" :y1="svgPos(edge[0])[1]" :x2="svgPos(edge[1])[0]" :y2="svgPos(edge[1])[1]" :style="{stroke: 'black'}" />

      <rect x="0" y="0" rx="2" ry="2" width="100" height="100" style="fill:none;stroke:black;stroke-width:2;opacity:1" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    graph: {
      type: Object
    },
    halfSize: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    svgPos (pos) {
      const vec = [ pos[0], -1 * pos[1] ]
      return vec.map((x) => 50 + (35 * x))
    },
    nodeTransform (node) {
      const pos = this.svgPos(node)
      return 'translate(' + pos[0] + 'px, ' + pos[1] + 'px)'
    }
  },
  computed: {
    nodes () {
      return Object.keys(this.graph.nodes)
        .map((x) => x.split(',').map((y) => parseInt(y)))
    },
    edges () {
      const edges = []
      Object.keys(this.graph.adj).forEach((nodeKey) => {
        this.graph.adj[nodeKey].forEach((adjKey) => {
          const nodePos = nodeKey.split(',').map((y) => parseInt(y))
          const adjPos = adjKey.split(',').map((y) => parseInt(y))
          edges.push([ nodePos, adjPos ])
        })
      })
      return edges
    }
  }
}
</script>

<style scoped lang="scss">
.tile {
  display: inline-block;
  position: relative;
  width: 100px;
  height: 100px;
  svg {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 0;
    left: 0;
  }
}
.tile.halfSize {
  width: 50px;
  height: 50px;
  svg {
    transform: scale(0.5) translate(-50px, -50px);
  }
}
.selectable {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.selectable:hover {
    box-shadow:inset 0px 0px 0px 5px blue;
}
</style>
