import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Picker from '@/components/demo/Picker'
import TileLibrary from '@/TileLibrary'

describe('Init State', () => {
  it('should display no tile svgs', () => {
    const Constructor = Vue.extend(Picker)
    const vm = new Constructor().$mount()

    const blankSvgs = vm.$el.querySelectorAll('.grid svg.blank')
    const nonBlankSvgs = vm.$el.querySelectorAll('.grid svg:not(.blank)')

    expect(blankSvgs.length).toBeGreaterThan(1)
    expect(nonBlankSvgs.length).toEqual(0)
  })

  it('tile picker displays all unique tiles', () => {
    const vm = mount(Picker)
    const pickerTiles = vm.findAll('.showcase .tile svg:not(.blank)')
    expect(pickerTiles.length).toEqual(TileLibrary.uniqueTiles().size)
  })
})

describe('Controls', () => {
  it('clicking on picker rotates the tile', async () => {
    const vm = mount(Picker)

    const pickerTileBefore = vm.findAll('.showcase .tile').at(1)
    const htmlBefore = pickerTileBefore.find('svg').html()

    const selectElement = pickerTileBefore.find('div.selectable')

    await selectElement.trigger('click')

    const pickerTileAfterOnce = vm.findAll('.showcase .tile').at(1)
    const htmlAfterOnce = pickerTileBefore.find('svg').html()
    expect(htmlAfterOnce).toEqual(htmlBefore)

    await selectElement.trigger('click')

    const pickerTileAfterTwice = vm.findAll('.showcase .tile').at(1)
    const htmlAfterTwice = pickerTileBefore.find('svg').html()
    expect(htmlAfterTwice).not.toEqual(htmlBefore)
  })

  it('clicking in a valid space places a tile', async () => {
    const vm = mount(Picker)

    const validSlots = vm.findAll('.grid .tile svg.blank')
    const tileCountBefore = vm.findAll('.grid .tile svg:not(.blank)').length

    const pickerTiles = vm.findAll('.showcase .tile div.selectable')

    await pickerTiles.at(0).trigger('click')

    expect(vm.vm.pickedTile).toBeDefined()

    expect(validSlots.length).toBeGreaterThan(0)
    expect(tileCountBefore).toEqual(0)

    await validSlots.at(0).trigger('click')

    const tileCountAfter = vm.findAll('.grid .tile svg:not(.blank)').length

    expect(tileCountAfter).toEqual(1)
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
