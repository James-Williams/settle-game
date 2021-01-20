import Vue from 'vue'
import Router from 'vue-router'
import PickerDemo from '@/components/demo/Picker'
import AutoTileDemo from '@/components/demo/AutoTile'
import PlaceDemo from '@/components/demo/Place'
import NewGame from '@/components/NewGame'
import Play from '@/components/Play'
import TilesCode from '@/components/code/Tiles'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/play/'
    },
    {
      path: '/play/',
      label: 'New Game',
      component: NewGame
    },
    {
      path: '/play/:gid',
      component: Play
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
