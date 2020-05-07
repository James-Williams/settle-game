import Vue from 'vue'
import Router from 'vue-router'
import DemoPage from '@/components/DemoPage'
import AutoTileDemo from '@/components/AutoTileDemo'
import PlaceDemo from '@/components/PlaceDemo'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: DemoPage
    },
    {
      path: '/place',
      component: PlaceDemo
    },
    {
      path: '/auto',
      component: AutoTileDemo
    }
  ]
})
