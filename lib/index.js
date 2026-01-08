const defaultOptions = { vmProperty: '$modules' }
let modules = {}
let pinia = null
let router = null

/**
 * Install the plugin with Vue.use(VueFeatureRegistry, options)
 * @param {Object} Vue - Vue constructor
 * @param {Object} [options]
 * @param {Object} [options.modules] - an object containing modules you want to register
 * @param {Object} [options.pinia] - a Pinia instance
 * @param {Object} [options.router] - a Vue Router instance
 */
export default function(Vue, options = {}) {
  options = Object.assign({}, defaultOptions, options)
  if (options.pinia) pinia = options.pinia
  if (options.router) router = options.router
  if (options.vmProperty) registerVmProperty(Vue, options.vmProperty)
  if (isModuleShape(options.modules)) registerModules(options.modules)
}

/**
 * Helper to assure that shape of object is module definition(s)
 * @param {Object} mod
 */
const isModuleShape = mod =>
  !!mod && typeof mod === 'object' && Object.keys(mod).length > 0

/**
 * Define a vm instance property shorthand
 * @param {Object} Vue
 */
export function registerVmProperty(Vue, name) {
  if (name in Vue.prototype) return false
  Vue.prototype[name] = modules
}

/**
 * Register one or more modules
 * @param {Object} mods
 */
export function registerModules(mods) {
  if (!isModuleShape(mods)) return false
  modules = Object.assign(modules, mods)
  Object.keys(mods).forEach(modKey => {
    const modDefinition = mods[modKey]
    if (pinia) registerModuleStore(modKey, modDefinition, pinia)
    if (router) registerModuleRouter(modDefinition, router)
  })
}

/**
 * Return all registered modules
 * @returns {object} modules
 */
export function getModules() {
  return modules
}

/**
 * Resets all values (helpful for testing)
 */
export function reset() {
  modules = {}
  pinia = null
  router = null
}

/**
 * Extract and register a module store (Pinia)
 * @param {string} key
 * @param {Object} mod
 * @param {Object} piniaInstance
 */
export function registerModuleStore(key, mod, piniaInstance) {
  if ('store' in mod === false) return false
  // Pinia stores are defined using defineStore
  // The store function returned by defineStore will automatically register
  // when first called, so we just need to verify it exists
  // Store will be created when first accessed via useStore()
  if (typeof mod.store === 'function') {
    // Store is already a defineStore function, no action needed
    // It will be registered when first used
    return true
  }
  return false
}

/**
 * Extract and register a module router
 * @param {Object} mod
 * @param {Object} router
 */
export function registerModuleRouter(mod, router) {
  if ('router' in mod === false) return false
  const { routes: moduleRoutes, ...moduleMethods } = mod.router
  if (moduleRoutes) {
    // Vue Router 3.5.4 uses addRoutes (deprecated but still works) or addRoute
    if (typeof router.addRoutes === 'function') {
      router.addRoutes(moduleRoutes)
    } else if (typeof router.addRoute === 'function') {
      moduleRoutes.forEach(route => {
        router.addRoute(route)
      })
    }
  }
  if (moduleMethods && Object.keys(moduleMethods).length > 0) {
    Object.keys(moduleMethods).forEach(moduleMethod => {
      // Handle navigation guards (beforeEach, beforeResolve, afterEach)
      if (['beforeEach', 'beforeResolve', 'afterEach'].includes(moduleMethod)) {
        if (typeof moduleMethods[moduleMethod] === 'function') {
          router[moduleMethod](moduleMethods[moduleMethod])
        }
      } else {
        // Handle other router methods
        const methodName = moduleMethods[moduleMethod].name || moduleMethod
        if (typeof router[methodName] === 'function') {
          router[methodName].call(router, moduleMethods[moduleMethod])
        }
      }
    })
  }
}
