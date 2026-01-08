import { defineStore } from 'pinia'

export default defineStore('todos', {
  state: () => ({
    todos: []
  }),
  getters: {
    getTodos: (state) => state.todos
  },
  actions: {
    addTodo(todo) {
      this.todos.push(todo)
    }
  }
})
