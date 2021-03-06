import TileLibrary from '@/TileLibrary'

describe('allTiles', () => {

  it('should contain duplicate items', () => {
    const tiles = TileLibrary.allTiles()
    const tileSet = new Set(
      tiles.map((x) => JSON.stringify(x))
    )

    expect(tileSet.size).toBeLessThan(tiles.size)
    expect(tileSet.size).toBeGreaterThan(0)
  })
})

describe('uniqueTiles', () => {

  it('all items returned are unique', () => {
    const tiles = TileLibrary.uniqueTiles()
    const tileSet = new Set(
      tiles.map((x) => JSON.stringify(x))
    )

    expect(tileSet.size).toEqual(tiles.size)
  })

  it('should return 24 items', () => {
    expect(TileLibrary.uniqueTiles().size)
      .toEqual(24)

  })
})
