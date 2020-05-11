
import Moves from '@/Moves'

export default class {
  static gridGraph (grid) {
    const adj = {}
    const nodes = {}

    grid.keys().forEach((pos) => {
      const tile = grid.get(pos)
      const g = this.globalTileGraph(tile, pos)
      Object.keys(g.nodes).forEach((key) => {
        nodes[key] = g.nodes[key]
        adj[key] = g.adj[key]
      })

      for (let i = 0; i < 4; i++) {
        const dir = Moves.DIRECTIONS[i]
        const eastKey = [pos[0] + dir[0], pos[1] + dir[1]]
        const eastTile = grid.get(eastKey)
        if (eastTile) {
          // TODO - Fix for farm connections
          const adjDir = [-1 * dir[0], -1 * dir[1]]
          const nodeKey = String(pos) + ',' + String(dir)
          const adjKey = String(eastKey) + ',' + String(adjDir)
          adj[nodeKey].add(adjKey)
        }
      }
    })

    return { nodes: nodes, adj: adj }
  }

  static partitionGraph (graph) {
    const partitions = {}
    const membership = {}
    let nextPartition = 0

    Object.keys(graph.nodes).forEach((nodeKey) => {
      if (!(nodeKey in membership)) {
        const c = new Set([nodeKey])
        let q = Array.from(graph.adj[nodeKey])
        while (q.length > 0) {
          const k = q.shift()
          if (!c.has(k)) {
            c.add(k)
            // TODO - Only bad graphs have no adj[k]
            if (graph.adj[k]) {
              q = q.concat(Array.from(graph.adj[k]))
            }
          }
        }
        let p = null
        Array.from(c).forEach((nodeKey) => {
          if (nodeKey in membership) {
            p = membership[nodeKey]
          }
        })
        if (p === null) {
          p = String(nextPartition++)
          partitions[p] = new Set()
        }
        Array.from(c).forEach((nodeKey) => {
          partitions[p].add(nodeKey)
          membership[nodeKey] = p
        })
      }
    })

    return { partitions: partitions, membership: membership }
  }

  static globalTileGraph (tile, position) {
    const tg = this.tileGraph(tile)
    const nodes = {}
    const adj = {}

    Object.keys(tg.nodes).forEach((key) => {
      const node = tg.nodes[key]
      const newKey = String(position) + ',' + key
      nodes[newKey] = { ...node, pos: position }

      adj[newKey] = new Set()
      tg.adj[key].forEach((target) => {
        adj[newKey].add(String(position) + ',' + target)
      })
    })

    return {adj: adj, nodes: nodes}
  }

  static tileGraph (tile) {
    const adj = {}
    const nodes = {}

    for (let i = 0; i < 4; i++) {
      const prevIdx = (i === 0) ? 3 : i - 1
      const nextIdx = (i === 3) ? 0 : i + 1
      const oppositeIdx = (i + 2) % 4
      const side = tile.sides[i]
      const vec = Moves.DIRECTIONS[i]
      const set = new Set()

      // Neighbours
      if (!(side === 'c') || !tile.split) {
        if (tile.sides[prevIdx] === side) {
          set.add(String(Moves.DIRECTIONS[prevIdx]))
        }
        if (tile.sides[nextIdx] === side) {
          set.add(String(Moves.DIRECTIONS[nextIdx]))
        }
      }

      // Opposites
      if (tile.sides[oppositeIdx] === side && tile.sides[nextIdx] !== side) {
        if (tile.split) {
          if (side === 'g') {
            set.add(String(Moves.DIRECTIONS[oppositeIdx]))
          }
        } else {
          if (side === 'c') {
            set.add(String(Moves.DIRECTIONS[oppositeIdx]))
          }
        }
      }

      // Corner Road
      if (side === 'r' &&
          tile.sides[nextIdx] === 'r' &&
          tile.sides[oppositeIdx] !== 'r' &&
          tile.sides[prevIdx] !== 'r') {
        const m = ((i % 2) === 1) ? 1 : -1
        const d = (vec[0]) ? [0, m * vec[0]] : [m * vec[1], 0]
        const v = [vec[0] + d[0], vec[1] + d[1]]
        const w = [-1 * v[0], -1 * v[1]]

        if (!(String(v) in adj)) adj[String(v)] = new Set()
        adj[String(v)].add(String(w))
        if (!(String(w) in adj)) adj[String(w)] = new Set()
        adj[String(w)].add(String(v))
      }

      if (!(String(vec) in adj)) adj[String(vec)] = new Set()
      set.forEach((x) => adj[String(vec)].add(x))

      nodes[String(vec)] = { type: side, ofst: vec }
      if (tile.meeple && String(vec) === String(tile.meeple.position)) {
        nodes[String(vec)].meeple = {...tile.meeple}
      }

      if (side === 'r') {
        const ds = (vec[0]) ? [[0, -1], [0, 1]] : [[-1, 0], [1, 0]]
        ds.forEach((d) => {
          const v = [ vec[0] + d[0], vec[1] + d[1] ]
          const k = String(v)
          nodes[k] = { type: 'g', ofst: v }
          if (!(String(k) in adj)) adj[String(k)] = new Set()
        })
        if (tile.sides[prevIdx] === 'g') {
          const d = ds[0]
          const v = [ vec[0] + d[0], vec[1] + d[1] ]
          const w = Moves.DIRECTIONS[prevIdx]
          adj[String(v)].add(String(w))
          if (!(String(w) in adj)) adj[String(w)] = new Set()
          adj[String(w)].add(String(v))
        }
        if (tile.sides[nextIdx] === 'g') {
          const d = ds[1]
          const v = [ vec[0] + d[0], vec[1] + d[1] ]
          const w = Moves.DIRECTIONS[nextIdx]
          adj[String(v)].add(String(w))
          if (!(String(w) in adj)) adj[String(w)] = new Set()
          adj[String(w)].add(String(v))
        }
      }
    }

    if (tile.cloister) {
      const k = String([0, 0])
      nodes[k] = { type: 'cloister', ofst: [0, 0] }
      adj[k] = new Set()
    }

    return { adj: adj, nodes: nodes }
  }

  static freeSlots (grid, pos) {
    const graph = this.gridGraph(grid)
    const part = this.partitionGraph(graph)
    const meepleMap = {}

    Object.keys(part.partitions).forEach((id) => {
      meepleMap[id] = []
      Array.from(part.partitions[id].values()).forEach((nodeId) => {
        const node = graph.nodes[nodeId]
        // TODO - Only bad graphs have !node
        if (node && node.meeple) {
          meepleMap[id].push(node.meeple)
        }
      })
    })

    const slotKeys = this.meepleSlots(grid.get(pos))
      .map((x) => pos.concat(x))
      .map(String)

    const slots = []
    slotKeys.forEach((slotKey) => {
      const par = part.membership[slotKey]
      if (meepleMap[par].length === 0) {
        const slot = graph.nodes[slotKey].ofst
        slots.push(slot)
      }
    })

    return slots
  }

  static meepleSlots (tile) {
    return Object.keys(this.tileGraph(tile).nodes)
      .map((x) => x.split(',').map((y) => parseInt(y)))
  }
}
