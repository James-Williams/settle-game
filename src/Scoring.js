
import Moves from '@/Moves'

export default class {
  /**
   * @param {Grid} grid A grid of tiles
   * @returns {Object} A single graph containing all nodes and edges
   *   from the graphs of each tile in the grid. Nodes ids are lifted
   *   into a global co-ordinate system.
   */
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

      // Add side crossing edges
      for (let i = 0; i < 4; i++) {
        const dir = Moves.DIRECTIONS[i]
        const adjPos = [pos[0] + dir[0], pos[1] + dir[1]]
        const adjTile = grid.get(adjPos)
        const adjDir = [-1 * dir[0], -1 * dir[1]]
        const nodeKey = String(pos) + ',' + String(dir)
        const adjKey = String(adjPos) + ',' + String(adjDir)
        if (adjTile) {
          adj[nodeKey].add(adjKey)

          if (tile.sides[i] === 'r') {
            [-1, 1].forEach((j) => {
              const ofst = dir[0] ? [0, j] : [j, 0]
              const grassDir = [dir[0] + ofst[0], dir[1] + ofst[1]]
              const grassAdjDir = [adjDir[0] + ofst[0], adjDir[1] + ofst[1]]
              const nodeKey = String(pos) + ',' + String(grassDir)
              const adjKey = String(adjPos) + ',' + String(grassAdjDir)
              adj[nodeKey].add(adjKey)
            })
          }
        }
      }
    })

    return { nodes: nodes, adj: adj }
  }

  /**
   * Partitions a graph into connected sub-graphs.
   * @param {Object} graph A graph
   * @rturns {Object} A graph partioning
   */
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

  /**
   * @param {Object} tile A tile
   * @param {Array} position A unit vector
   * @returns {Object} The graph for the tile using
   *   node ids lifted into a global co-ordinate system.
   */
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

  /**
   * @param {Object} tile A tile
   * @returns {Object} A graph representing the tile. One node for each
   *   position a meeple could possibly be played. Edges between nodes
   *   that are part of the same tile element.
   */
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
      if (side !== 'c' || !tile.split) {
        if (side !== 'r') {
          if (tile.sides[prevIdx] === side) {
            set.add(String(Moves.DIRECTIONS[prevIdx]))
          }
          if (tile.sides[nextIdx] === side) {
            set.add(String(Moves.DIRECTIONS[nextIdx]))
          }
        }
      }

      // Opposites
      if (tile.sides[oppositeIdx] === side &&
          tile.sides[prevIdx] !== side &&
          tile.sides[nextIdx] !== side) {
        if (tile.split) {
          if (side === 'g') {
            set.add(String(Moves.DIRECTIONS[oppositeIdx]))
          }
        } else {
          if (side === 'c' || side === 'r') {
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

        // TODO - DRY - Use a local function for this repeated pair :)
        if (!(String(v) in adj)) adj[String(v)] = new Set()
        adj[String(v)].add(String(w))

        if (!(String(w) in adj)) adj[String(w)] = new Set()
        adj[String(w)].add(String(v))

        // Road connection
        // TODO - RED - GREEN this :)
        const a = Moves.DIRECTIONS[i]
        const b = Moves.DIRECTIONS[nextIdx]
        if (!(String(a) in adj)) adj[String(a)] = new Set()
        adj[String(a)].add(String(b))
        if (!(String(b) in adj)) adj[String(b)] = new Set()
        adj[String(b)].add(String(a))
      }

      if (!(String(vec) in adj)) adj[String(vec)] = new Set()
      set.forEach((x) => adj[String(vec)].add(x))

      nodes[String(vec)] = { type: side, ofst: vec }

      if (side === 'r') {
        const ds = (vec[0]) ? [[0, -1], [0, 1]] : [[-1, 0], [1, 0]]
        ds.forEach((d) => {
          const v = [ vec[0] + d[0], vec[1] + d[1] ]
          const k = String(v)
          nodes[k] = { type: 'g', ofst: v }
          if (!(String(k) in adj)) adj[String(k)] = new Set()
        })
        if (tile.sides[prevIdx] === 'g') {
          const w = Moves.DIRECTIONS[prevIdx]
          const v = [ vec[0] + w[0], vec[1] + w[1] ]
          adj[String(v)].add(String(w))
          if (!(String(w) in adj)) adj[String(w)] = new Set()
          adj[String(w)].add(String(v))
        }
        if (tile.sides[nextIdx] === 'g') {
          const w = Moves.DIRECTIONS[nextIdx]
          const v = [ vec[0] + w[0], vec[1] + w[1] ]
          adj[String(v)].add(String(w))
          if (!(String(w) in adj)) adj[String(w)] = new Set()
          adj[String(w)].add(String(v))
        }
        if (tile.sides[nextIdx] === 'c' &&
            tile.sides[nextIdx] === 'c' &&
            tile.sides[oppositeIdx] === 'r') {
          const v = Moves.DIRECTIONS[nextIdx]
          const wp = Moves.DIRECTIONS[i]
          const vp = [ v[0] + wp[0], v[1] + wp[1] ]
          const wn = Moves.DIRECTIONS[oppositeIdx]
          const vn = [ v[0] + wn[0], v[1] + wn[1] ]
          if (!(String(vp) in adj)) adj[String(vp)] = new Set()
          adj[String(vp)].add(String(vn))
          if (!(String(vn) in adj)) adj[String(vn)] = new Set()
          adj[String(vn)].add(String(vp))
        }
      }
    }

    if (tile.cloister) {
      const k = String([0, 0])
      nodes[k] = { type: 'cloister', ofst: [0, 0] }
      adj[k] = new Set()
    }

    // Add meeple to graph
    if (tile.meeple && tile.meeple.position) {
      nodes[String(tile.meeple.position)].meeple = {...tile.meeple}
    }

    return { adj: adj, nodes: nodes }
  }

  /**
   * Given a grid and a tile position, returns the list of meeple slots
   *   within the tile that it's valid for a new meeple to be played.
   * @param {Grid} grid A grid
   * @param {Array} pos A position vector
   * @returns {Array} A list of position vectors.
   */
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

  /**
   * @param {Object} tile A tile
   * @returns {Array} A list of slots within the tile which it
   *   is potentially possible to play a meeple.
   */
  static meepleSlots (tile) {
    return Object.keys(this.tileGraph(tile).nodes)
      .map((x) => x.split(',').map((y) => parseInt(y)))
  }
}
