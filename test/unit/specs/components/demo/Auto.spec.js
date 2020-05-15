import Vue from 'vue'
import { mount } from '@vue/test-utils'
import AutoTile from '@/components/demo/AutoTile'
import TileLibrary from '@/TileLibrary'

describe('Auto Placement', () => {
  it('no tiles left once it\'s finished placing', async () => {
    const vm = mount(AutoTile, {
      propsData: {
        waitTime: 0,
        tiles: TileLibrary.allTiles().toJS().slice(0,4)
      }
    })

    const tilesLeft = vm.vm.tiles.length

    await Vue.nextTick()

    expect(tilesLeft).toEqual(0)
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
