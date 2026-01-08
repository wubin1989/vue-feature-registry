import { defineStore } from 'pinia'

export default defineStore('auth', {
  state: () => ({
    user: null
  }),
  getters: {
    getUser: (state) => state.user
  },
  actions: {
    updateUser(user) {
      this.user = user
    }
  }
})
