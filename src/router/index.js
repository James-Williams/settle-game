import Vue from 'vue'
import Router from 'vue-router'
import PickerDemo from '@/components/demo/Picker'
import AutoTileDemo from '@/components/demo/AutoTile'
import PlaceDemo from '@/components/demo/Place'
import TilesCode from '@/components/code/Tiles'

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
      label: 'Tile Code',
      path: '/code/tiles/',
      component: TilesCode
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
