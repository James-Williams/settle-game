import Vue from 'vue'
import Tiles from '@/components/code/Tiles'

describe('Init State', () => {
  it('should display tile svgs and graph svgs', () => {
    const Constructor = Vue.extend(Tiles)
    const vm = new Constructor().$mount()

    const tileSvg = vm.$el.querySelector('.entry span.render svg:not(.blank)')
    const gridSvg = vm.$el.querySelector('.entry span.graph svg:not(.blank)')

    expect(tileSvg.children.length).toBeGreaterThan(1)
    expect(gridSvg.children.length).toBeGreaterThan(1)
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
