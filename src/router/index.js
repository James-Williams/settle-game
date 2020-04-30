import Vue from 'vue'
import Router from 'vue-router'
import DemoPage from '@/components/DemoPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: DemoPage
    }
  ]
})
