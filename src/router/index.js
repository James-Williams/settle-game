import Vue from 'vue'
import Router from 'vue-router'
import DemoPage from '@/components/DemoPage'
import AutoTileDemo from '@/components/AutoTileDemo'
import RandomTileDemo from '@/components/RandomTileDemo'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: DemoPage
    },
    {
      path: '/random',
      component: RandomTileDemo
    },
    {
      path: '/auto',
      component: AutoTileDemo
    }
  ]
})
