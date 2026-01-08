import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'

// import plugin and static modules to load
import VueFeatureRegistry, { registerModules } from '../lib'
import auth from './modules/auth'

const app = createApp(App)

// use router and pinia first
app.use(router)
app.use(pinia)

// use the plugin and pass modules, pinia and vue router
app.use(VueFeatureRegistry, {
  modules: { auth },
  pinia,
  router
})

app.mount('#app')

// lazily import a module asynchronously and register it
setTimeout(async () => {
  const { default: todos } = await import('./modules/todos')
  registerModules({ todos })
}, 1000)
