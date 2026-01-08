import Vue from 'vue'
import Router from 'vue-router'
import Home from './Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: import.meta.env.BASE_URL || '/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})
