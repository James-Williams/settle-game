import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Place from '@/components/demo/Place'
import Grid from '@/Grid'
import GameState from '@/GameState'
import Immutable from 'immutable'

describe('Init State', () => {
  it('should display a single tile svg', () => {
    const Constructor = Vue.extend(Place)
    const vm = new Constructor().$mount()

    const nonBlankSvgs = vm.$el.querySelectorAll('.grid svg:not(.blank)')

    expect(nonBlankSvgs.length).toEqual(1)
    expect(nonBlankSvgs[0].children.length).toBeGreaterThan(0)
  })
})

describe('Controls', () => {
  it('clicking should modify next tile (due to rotation)', async () => {
    const Constructor = Vue.extend(Place)
    const vm = mount(Place, {
      propsData: {
        initGameState: new GameState({
          tileList: [
            { sides: ['c', 'g', 'g', 'g'] }
          ]
        })
      }
    })

    const nextTile = vm.find('.controls .tile')
    const svgBefore = nextTile.find('svg').html()
    const clickSurface = nextTile.find('.selectable')

    await clickSurface.trigger('click')

    const svgAfter = nextTile.find('svg').html()

    expect(svgAfter).not.toEqual(svgBefore)
  })

  it('clicking in a valid space places a tile', async () => {
    const Constructor = Vue.extend(Place)
    const vm = mount(Place, {
      propsData: {
        initGameState: new GameState({
          tileList: [
            { sides: ['c', 'c', 'c', 'c'] },
            { sides: ['c', 'c', 'c', 'c'] },
          ]
        })
      }
    })

    const validSlots = vm.findAll('.grid .tile div.selectable')
    const tileCountBefore = vm.findAll('.grid .tile svg:not(.blank)').length

    expect(validSlots.length).toBeGreaterThan(0)
    expect(tileCountBefore).toEqual(1)

    await validSlots.at(0).trigger('click')

    const tileCountAfter = vm.findAll('.grid .tile svg:not(.blank)').length

    expect(tileCountAfter).toEqual(2)
  })

  it('placing a tile decrements the tile count', async () => {
    const Constructor = Vue.extend(Place)
    const vm = mount(Place, {
      propsData: {
        initGameState: new GameState({
          tileList: [
            { sides: ['c', 'c', 'c', 'c'] },
            { sides: ['c', 'c', 'c', 'c'] },
          ]
        })
      }
    })

    const tileCountBefore = vm.find('.controls .tiles-left').text()
    expect(tileCountBefore).toEqual(String(2))

    const validSlots = vm.findAll('.grid .tile div.selectable')
    expect(validSlots.length).toBeGreaterThan(0)

    await validSlots.at(0).trigger('click')

    const tileCountAfter = vm.find('.controls .tiles-left').text()
    expect(tileCountAfter).toEqual(String(1))
  })

  it('players start with 7 meeple', async () => {
    const Constructor = Vue.extend(Place)
    const vm = mount(Place, {
      propsData: {
        initGameState: new GameState({
          tileList: [
            { sides: ['c', 'g', 'g', 'g'] }
          ]
        })
      }
    })

    const counts = vm.findAll('.controls .player .count')

    for (let i = 0; i < counts.length; i++) {
      expect(counts.at(i).text()).toEqual(String(7))
    }
  })

  it('placing a meeple decrements displaye tile count', async () => {
    const Constructor = Vue.extend(Place)
    const vm = mount(Place, {
      propsData: {
        initGameState: new GameState({
          tileList: [
            { sides: ['c', 'c', 'c', 'c'] },
            { sides: ['c', 'c', 'c', 'c'] },
          ]
        })
      }
    })

    const validSlots = vm.findAll('.grid .tile div.selectable')
    const tileCountBefore = vm.findAll('.grid .tile svg:not(.blank)').length

    expect(validSlots.length).toBeGreaterThan(0)

    await validSlots.at(0).trigger('click')

    const validTiles = vm.findAll('.grid .tile svg:not(.blank)')
    expect(validTiles.length).toEqual(2)

    for (let i = 0; i < validTiles.length; i++) {
      await validTiles.at(i).trigger('click', {
        offsetX: 15,
        offsetY: 50
      })
    }

    const meepleCount = vm.findAll('.controls .player svg.meeple:not(.hide)').length
    expect(meepleCount).toEqual(6)
  })

  it('clicking on a meeple removes it', async () => {
    const Constructor = Vue.extend(Place)
    const vm = mount(Place, {
      propsData: {
        initGameState: new GameState({
          tileList: [
            { sides: ['c', 'c', 'c', 'c'] },
            { sides: ['c', 'c', 'c', 'c'] },
          ]
        })
      }
    })

    const validSlots = vm.findAll('.grid .tile div.selectable')
    const tileCountBefore = vm.findAll('.grid .tile svg:not(.blank)').length

    expect(validSlots.length).toBeGreaterThan(0)

    await validSlots.at(0).trigger('click')

    const placedTileIdx = 0
    const validTiles = vm.findAll('.grid .tile svg:not(.blank)')
    expect(validTiles.length).toEqual(2)
    const validTileComp = validTiles.at(placedTileIdx).element.parentElement.__vue__
    expect(validTileComp.meepleSelectColor).toEqual('red')

    // Place meeple
    await validTiles.at(placedTileIdx).trigger('click', {
      offsetX: 15,
      offsetY: 50
    })

    global.confirm = jest.fn(() => true)
    expect(global.confirm).not.toHaveBeenCalled()

    const meepleBefore = vm.vm.grid.placedMeeple()
    expect(meepleBefore.size).toEqual(1)
    expect(meepleBefore.get(0).get('color')).toEqual('red')

    // Remove meeple
    for (let i = 0; i < validTiles.length; i++) {
      await validTiles.at(i).trigger('click', {
        offsetX: 15,
        offsetY: 50
      })
    }

    expect(global.confirm).toHaveBeenCalled()

    const meepleAfter = vm.vm.grid.placedMeeple()
    expect(meepleAfter.size).toEqual(0)
  })

  it('single player - can\'t place more meeple than we have', async () => {
    const Constructor = Vue.extend(Place)
    const vm = mount(Place, {
      propsData: {
        initGameState: new GameState({
          grid: new Grid({
            [String([0, 0])]: Immutable.fromJS({
              sides: [ 'g', 'g', 'g', 'g' ],
              cloister: true
            })}),
          config: {
            players: ['red'],
            startingMeeple: 1
          },
          tileList: [
            { sides: ['g', 'g', 'g', 'g'], cloister: true },
            { sides: ['g', 'g', 'g', 'g'], cloister: true },
            { sides: ['g', 'g', 'g', 'g'], cloister: true },
          ]
        })
      }
    })

    const validSlots = vm.findAll('.grid .tile div.selectable')
    const tileCountBefore = vm.findAll('.grid .tile svg:not(.blank)').length
    expect(validSlots.length).toBeGreaterThan(0)
    await validSlots.at(0).trigger('click')

    const placedTileIdx = 0
    const validTiles = vm.findAll('.grid .tile svg:not(.blank)')
    expect(validTiles.length).toEqual(2)
    const validTileComp = validTiles.at(placedTileIdx).element.parentElement.__vue__
    expect(validTileComp.meepleSelectColor).toEqual('red')

    // Place meeple
    await validTiles.at(placedTileIdx).trigger('click', {
      offsetX: 15,
      offsetY: 50
    })

    const meepleBefore = vm.vm.grid.placedMeeple()
    expect(meepleBefore.size).toEqual(1)
    expect(meepleBefore.get(0).get('color')).toEqual('red')

    const validSlots2 = vm.findAll('.grid .tile div.selectable')
    expect(validSlots2.length).toBeGreaterThan(0)
    await validSlots2.at(0).trigger('click')

    const validTiles2 = vm.findAll('.grid .tile svg:not(.blank)')
    expect(validTiles2.length).toEqual(3)
    for (let i = 0; i < validTiles2.length; i++) {
      const validTile = validTiles2.at(i)
      const validTileComp = validTile.element.parentElement.__vue__
      expect(validTileComp.meepleSelect).toBeNull()
    }
  })

})

const spies = {};

beforeEach(done => {
  function failIfError(error) {
    // You can also just immediately fail if you don't use console.error()
    if (error instanceof Error) {
      done.fail(error);
    }
  }

  spies.consoleError = jest
    .spyOn(console, "error")
    .mockImplementation(failIfError);

  done();
});

afterEach(() => {
  spies.consoleError.mockRestore();
});
