import Vue from 'vue'
import Router from 'vue-router'
import PickerDemo from '@/components/PickerDemo'
import AutoTileDemo from '@/components/AutoTileDemo'
import PlaceDemo from '@/components/PlaceDemo'
import MeepleDemo from '@/components/MeepleDemo'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/demo/place/'
    },
    {
      label: 'Auto Map Demo',
      path: '/demo/auto/',
      component: AutoTileDemo
    },
    {
      label: 'Meeple Demo',
      path: '/demo/meeple/',
      component: MeepleDemo
    },
    {
      label: 'Picker Demo',
      path: '/demo/pick/',
      component: PickerDemo
    },
    {
      label: 'Placing Demo',
      path: '/demo/place/',
      component: PlaceDemo
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
