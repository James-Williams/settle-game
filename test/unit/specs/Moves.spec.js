import Moves from '@/Moves'

describe('Moves', () => {

  it('should accept road connections', () => {
    const m = new Moves()
    const t1 = { sides: ['g', 'r', 'c', 'r'] }
    const t2 = { sides: ['g', 'r', 'c', 'r'] }

    expect(m.canJoin(t1, t2, [1, 0]))
      .toEqual(true)
    expect(m.canJoin(t1, t2, [-1, 0]))
      .toEqual(true)
    expect(m.canJoin(t1, t2, [0, 1]))
      .toEqual(false)
    expect(m.canJoin(t1, t2, [0, -1]))
      .toEqual(false)
  })

  it('should accept any full city', () => {
    const m = new Moves()
    const t1 = { sides: ['c', 'c', 'c', 'c'] }
    const t2 = { sides: ['c', 'c', 'c', 'c'] }

    expect(m.canJoin(t1, t2, [1, 0]))
      .toEqual(true)
    expect(m.canJoin(t1, t2, [-1, 0]))
      .toEqual(true)
    expect(m.canJoin(t1, t2, [0, 1]))
      .toEqual(true)
    expect(m.canJoin(t1, t2, [0, -1]))
      .toEqual(true)
  })

  it('should reject all mismatch', () => {
    const m = new Moves()
    const t1 = { sides: ['g', 'g', 'g', 'g'] }
    const t2 = { sides: ['r', 'r', 'r', 'r'] }

    expect(m.canJoin(t1, t2, [1, 0]))
      .toEqual(false)
    expect(m.canJoin(t1, t2, [-1, 0]))
      .toEqual(false)
    expect(m.canJoin(t1, t2, [0, 1]))
      .toEqual(false)
    expect(m.canJoin(t1, t2, [0, -1]))
      .toEqual(false)
  })

  it('should throw if not adjacent', () => {
    const m = new Moves()
    const t1 = { sides: ['g', 'g', 'g', 'g'] }

    expect(() => {
      m.canJoin(t1, t1, [0, 0])
    }).toThrow('Unit vector expected')

    expect(() => {
      m.canJoin(t1, t1, [1, 1])
    }).toThrow('Unit vector expected')

    expect(() => {
      m.canJoin(t1, t1, [-1, 1])
    }).toThrow('Unit vector expected')
    expect(() => {
      m.canJoin(t1, t1, [10, 0])
    }).toThrow('Unit vector expected')
  })
})
