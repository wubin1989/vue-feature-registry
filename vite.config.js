import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ command, mode }) => {
  const isLib = mode === 'lib'
  
  if (isLib) {
    // Build library mode
    return {
      plugins: [vue()],
      build: {
        lib: {
          entry: resolve(__dirname, 'lib/index.js'),
          name: 'VueFeatureRegistry',
          fileName: (format) => `vue-feature-registry.${format}.js`
        },
        rollupOptions: {
          external: ['vue', 'vue-router', 'pinia'],
          output: {
            globals: {
              vue: 'Vue',
              'vue-router': 'VueRouter',
              pinia: 'Pinia'
            }
          }
        }
      }
    }
  }
  
  // Development mode (example)
  return {
    plugins: [vue()],
    root: 'example',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'example')
      }
    }
  }
})
