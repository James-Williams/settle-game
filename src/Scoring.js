
import Moves from '@/Moves'

export default class {

  static gridGraph(grid) {
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
          // Todo - Fix for farm connections
          const adjDir = [-1 * dir[0], -1 * dir[1]]
          const nodeKey = String(pos) + ',' + String(dir)
          const adjKey = String(eastKey) + ',' + String(adjDir)
          adj[nodeKey].add(adjKey)
        }
      }
    })

    return { nodes: nodes, adj: adj }
  }

  static partitionGraph(graph) {
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
            q = q.concat(Array.from(graph.adj[k]))
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

  static globalTileGraph(tile, position) {
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
      const side = tile.sides[i]
      const vec = Moves.DIRECTIONS[i]
      const set = new Set()
      if (tile.sides[prevIdx] === side) {
        set.add(String(Moves.DIRECTIONS[prevIdx]))
      }
      if (tile.sides[nextIdx] === side) {
        set.add(String(Moves.DIRECTIONS[nextIdx]))
      }
      adj[String(vec)] = set

      nodes[String(vec)] = { type: side, ofst: vec }
      if (tile.meeple && String(vec) === String(tile.meeple.position)) {
      nodes[String(vec)].meeple = {...tile.meeple}
      }
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
        if (node.meeple) {
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

  // TODO - Replace this with a call to tileGraph with Object.keys
  static meepleSlots (tile) {
    const res = []

    if (tile.cloister) {
      return [ ...Moves.DIRECTIONS, [0, 0] ]
    }

    for (let i = 0; i < 4; i++) {
      const prevI = (i === 0) ? 3 : (i - 1)
      const prevSide = tile.sides[prevI]
      const side = tile.sides[i]
      const vec = Moves.DIRECTIONS[i]
      if (side === 'g' || side === 'c') {
        res.push(vec)
      }
      if (side === 'r') {
        res.push(vec)
        if (vec[0] === 0) {
          if (prevSide !== 'r') res.push([vec[1] * -1, vec[1]])
          res.push([vec[1] * 1, vec[1]])
        } else if (vec[1] === 0) {
          res.push([vec[0], vec[0] * -1])
          if (prevSide !== 'r') res.push([vec[0], vec[0] * 1])
        }
      }
    }
    return res
  }
}
