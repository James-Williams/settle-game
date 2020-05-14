import Vue from 'vue'
import Picker from '@/components/demo/Picker'

describe('Init State', () => {
  it('should display a single tile svg', () => {
    const Constructor = Vue.extend(Picker)
    const vm = new Constructor().$mount()

    const blankSvgs = vm.$el.querySelectorAll('.grid svg.blank')
    const nonBlankSvgs = vm.$el.querySelectorAll('.grid svg:not(.blank)')

    expect(blankSvgs.length).toBeGreaterThan(1)
    expect(nonBlankSvgs.length).toEqual(0)
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
