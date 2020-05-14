import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Place from '@/components/demo/Place'

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
        tiles: [
          { sides: ['c', 'g', 'g', 'g'] }
        ]
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
        tiles: [
          { sides: ['c', 'c', 'c', 'c'] },
          { sides: ['c', 'c', 'c', 'c'] },
        ]
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

  it('placing a tile derements the tile count', async () => {
    const Constructor = Vue.extend(Place)
    const vm = mount(Place, {
      propsData: {
        tiles: [
          { sides: ['c', 'c', 'c', 'c'] },
          { sides: ['c', 'c', 'c', 'c'] },
        ]
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
        tiles: [
          { sides: ['c', 'g', 'g', 'g'] }
        ]
      }
    })

    const counts = vm.findAll('.controls .player .count')

    for (let i = 0; i < counts.length; i++) {
      expect(counts.at(i).text()).toEqual(String(7))
    }
  })

  it('placing a meeple decreased count', async () => {
    const Constructor = Vue.extend(Place)
    const vm = mount(Place, {
      propsData: {
        tiles: [
          { sides: ['c', 'c', 'c', 'c'] },
          { sides: ['c', 'c', 'c', 'c'] },
        ]
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

    const counts = vm.findAll('.controls .player .count')
    expect(counts.at(1).text()).toEqual(String(6))
  })

  it('clicking on a meeple removes it', async () => {
    const Constructor = Vue.extend(Place)
    const vm = mount(Place, {
      propsData: {
        tiles: [
          { sides: ['c', 'c', 'c', 'c'] },
          { sides: ['c', 'c', 'c', 'c'] },
        ]
      }
    })

    const validSlots = vm.findAll('.grid .tile div.selectable')
    const tileCountBefore = vm.findAll('.grid .tile svg:not(.blank)').length

    expect(validSlots.length).toBeGreaterThan(0)

    await validSlots.at(0).trigger('click')

    const validTiles = vm.findAll('.grid .tile svg:not(.blank)')
    expect(validTiles.length).toEqual(2)

    // Place meeple
    for (let i = 0; i < validTiles.length; i++) {
      await validTiles.at(i).trigger('click', {
        offsetX: 15,
        offsetY: 50
      })
    }

    global.confirm = jest.fn(() => true)
    expect(global.confirm).not.toHaveBeenCalled()

    const countsBefore = vm.findAll('.controls .player .count')
    expect(countsBefore.at(1).text()).toEqual(String(6))

    // Remove meeple
    for (let i = 0; i < validTiles.length; i++) {
      await validTiles.at(i).trigger('click', {
        offsetX: 15,
        offsetY: 50
      })
    }

    expect(global.confirm).toHaveBeenCalled()

    const countsAfter = vm.findAll('.controls .player .count')
    expect(countsAfter.at(1).text()).toEqual(String(7))
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
