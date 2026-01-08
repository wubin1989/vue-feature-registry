import Vue from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'

// import plugin and static modules to load
import VueFeatureRegistry, { registerModules } from '../lib'
import auth from './modules/auth'

// use the plugin and pass modules, pinia and vue router
Vue.use(VueFeatureRegistry, {
  modules: { auth },
  pinia,
  router
})

Vue.use(pinia)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// lazily import a module asynchronously and register it
setTimeout(async () => {
  const { default: todos } = await import('./modules/todos')
  registerModules({ todos })
}, 1000)
