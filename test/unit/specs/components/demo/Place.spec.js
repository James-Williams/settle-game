import Vue from 'vue'
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
