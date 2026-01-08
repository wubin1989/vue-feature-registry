<template>
  <div>
    <h2>Todos</h2>
    <ul>
      <li
        v-for="(todo, index) in todosStore.getTodos"
        :key="index"
      >
        {{ todo }}
      </li>
    </ul>
    <a href @click.prevent="todosStore.addTodo(Math.random())"
      >Add new todo</a
    >
  </div>
</template>

<script>
import useTodosStore from './store'

export default {
  name: 'Todos',
  setup() {
    const todosStore = useTodosStore()
    return { todosStore }
  }
}
</script>
