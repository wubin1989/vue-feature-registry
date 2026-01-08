# Vue Feature Registry

> 帮助你在大型 Vue 项目中实现按功能组织的模块结构 👷‍👷‍

[English](./README.md) | [中文文档](./README.zh-CN.md)

## 构建大型 Vue 项目

当 Vue 项目不断增长时，传统的[按类型组织文件夹](https://itnext.io/how-to-structure-a-vue-js-project-29e4ddc1aeeb)结构可能会变得难以管理，因为跨文件的依赖关系难以重构和理清。

相反，你应该考虑[将代码组织成"功能"模块](https://softwareengineering.stackexchange.com/a/338610)，每个模块封装自己的组件、Pinia store、路由等。这可以看作是一种结构设计模式，鼓励相关代码的封装。

这个仓库的主要目的就是**规定一个可扩展的项目结构**。为了简化设置，这个简单的 [Vue 插件](https://vuejs.org/guide/reusability/plugins.html)通过从每个模块中提取 Pinia stores 和路由定义并全局注册它们，帮助你轻松实现这一点。

## 插件安装

安装 NPM 包

```bash
yarn add vue3-feature-registry
```

在你的 main.js（或等效文件）中，添加

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import VueFeatureRegistry from 'vue3-feature-registry'
import foo from './modules/foo'
import bar from './modules/bar'

const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes: []
})

// 使用插件并传入模块、pinia 和 router 引用
app.use(VueFeatureRegistry, {
  modules: {
    foo,
    bar
  },
  pinia,
  router
})

app.use(router)
app.use(pinia)
app.mount('#app')
```

该插件目前实现三个功能：

1. **Pinia stores** - 在每个模块中定义的 Pinia store 会被注册到全局 Pinia 实例
2. **Vue router** - 每个模块中的路由定义会被合并并注册到全局路由实例
3. **Vue 实例辅助属性** - `$modules` 被注入到所有组件中，方便访问每个模块可以导出的自定义值

## 推荐设置

> 请查看 [example](./example) 文件夹作为参考设置

选择一个适合你本地模块的文件夹结构。每个模块可以是简单的（如下面的 `foo`）或复杂的（如下面的 `bar`），取决于你的需求。

```
modules/
│
├── foo/
│   ├── index.js
│   ├── router.js
│   ├── store.js
│   └── ComponentA.vue
│
└── bar/
    ├── index.js
    ├── router.js
    ├── store/
    │   ├── mutations.js
    │   ├── actions.js
    │   └── getters.js
    │
    ├── views/
    │   ├── PageA.vue
    │   └── PageB.vue
    │
    ├── services/
    │   ├── datasource.js
    │   └── tracking.js
    │
    └── tests/
        ├── services.spec.js
        └── views.spec.js
```

技术上对你的目录树结构或文件命名没有限制，只要每个模块导出一个如下所示的对象即可

```javascript
// modules/foo/index.js

import router from './router.js'
import store from './store.js'

export default {
  router, // 模块的 vue router（如果有）
  store, // 模块的 pinia store（如果有）
  custom: {
    // 可选的自定义信息，用于共享
    foo: 'bar'
  }
}
```

路由和 store 对象正是你从 Pinia stores 和 Vue Router 定义中所期望和了解的

```javascript
// modules/foo/router.js

import ComponentA from './ComponentA.vue'

export default {
  routes: [
    {
      path: '/foo',
      name: 'foo',
      component: ComponentA
    }
  ],
  beforeEach: (to, from, next) => {
    // 导航守卫
    next()
  }
}
```

```javascript
// modules/foo/store.js

import { defineStore } from 'pinia'

export default defineStore('foo', {
  state: () => ({
    foo: []
  }),
  getters: {
    getFoo: (state) => state.foo
  },
  actions: {
    setFoo(foo) {
      this.foo = foo
    }
  }
})
```

## 何时使用

### 不要过早过度设计

对于中小型项目，按类型组织文件夹的方法通常更易于导航，因为将所有路由和 stores 放在一个地方很有帮助。

如果你是一两个人构建一个小型 Vue 应用，这通常没问题。

### LIFT 你的代码库

当项目增长到数百个组件，有大型开发团队在同一个代码库上工作时，情况开始发生变化。

你要实现的目标可以缩写为 LIFT：构建应用结构，以便能够快速**定位**代码，**识别**代码一目了然，保持**最扁平**的结构，并**尝试**保持 DRY（不要重复自己）

但请记住，并非所有代码都可以或应该是自包含的：基础 UI 组件、API 客户端、通用工具等可能不应该是模块。

但是一个带有自己的路由（例如 /login）、store（例如 currentUser）、测试（例如 login.spec.js）和视图组件（例如 Login.vue）的身份验证模块非常适合封装。

## 技巧和窍门

### 从模块中暴露内容

作为经验法则，你能让模块之间以及模块与代码库其余部分之间保持越隔离，维护就越容易。

但是，有时你确实想要导出一个组件、服务或工具函数供其他代码使用。在这些情况下，我建议你明确地只从模块的 `index.js` 中导出

```javascript
// modules/foo/index.js

import ComponentA from './ComponentA.vue'
import { utilityFunction } from './utilities.js'

export { ComponentA, utilityFunction }
```

```javascript
// somewhere-else.js

import { ComponentA, utilityFunction } from './modules/foo'
```

这实现了两个目标：

1. 导入语句读起来很好，并且是自解释的，即 _从模块 foo 导入 x_
2. 之后重构和修改模块要容易得多，因为明确知道模块外部暴露了什么。你甚至可以更改文件名，同时保持命名导出向外，以便在重构时不会破坏其他内容。

### 在组件中使用 Pinia stores

在组件中使用 Pinia stores 时，你可以使用 Composition API：

```javascript
// Component.vue
<script setup>
import useFooStore from '../modules/foo/store'

const fooStore = useFooStore()

// 访问 state
console.log(fooStore.foo)

// 调用 actions
fooStore.setFoo(['bar', 'baz'])

// 访问 getters
console.log(fooStore.getFoo)
</script>
```

或使用 Options API：

```javascript
// Component.vue
<script>
import useFooStore from '../modules/foo/store'

export default {
  setup() {
    const fooStore = useFooStore()
    return { fooStore }
  }
}
</script>

<template>
  <div>
    <p>{{ fooStore.foo }}</p>
    <button @click="fooStore.setFoo(['bar'])">Set Foo</button>
  </div>
</template>
```

### 异步懒加载模块

当你的代码库增长时，将所有内容打包在一起会导致一个巨大的初始下载，而客户端可能永远不会使用这些代码。

相反，考虑使用代码分割，只在需要时加载模块。你可以在每个模块内部使用[懒加载路由](https://router.vuejs.org/guide/advanced/lazy-loading.html#grouping-components-in-the-same-chunk)来实现这一点，或者你可以使用 `registerModules` 函数和 [Vite 的动态导入](https://vitejs.dev/guide/features.html#dynamic-import)加载整个模块定义

```javascript
import { registerModules } from 'vue3-feature-registry'

const { default: foo } = await import('./modules/foo')
registerModules({ foo })
```

## 贡献

克隆仓库并安装依赖

```bash
# 运行示例应用
yarn serve

# 生产构建
yarn build

# 运行单元测试
yarn test

# 代码检查
yarn lint
```

欢迎提交 PR 和 issue！

## 许可证

[MIT](http://opensource.org/licenses/MIT)

使用它，fork 它，修改它，随你便 🖖
