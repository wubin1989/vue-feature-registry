<template>
  <div>
    <p v-if="authStore.getUser">
      Current user:
      <b>{{ authStore.getUser }}</b>
    </p>
    <p v-else>
      <a href @click.prevent="authStore.updateUser('John Doe')"
        >Login as John Doe</a
      >
    </p>
  </div>
</template>

<script>
import useAuthStore from './store'

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  }
}
</script>
