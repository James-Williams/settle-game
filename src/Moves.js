
export default class {
  canJoin (t1, t2, vec) {
    if ((Math.abs(vec[0]) + Math.abs(vec[1])) !== 1) {
      throw new Error('Unit vector expected')
    }
    const idx1 = vec[0] ? (vec[0] == 1 ? 1 : 3) : (vec[1] == 1 ? 0 : 2)
    const idx2 = (idx1 + 2) % 4
    return t1.sides[idx1] === t2.sides[idx2]
  }
}
