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
