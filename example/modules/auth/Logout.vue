<template>
  <div>
    <p v-if="!authStore.getUser">Not currently logged in</p>
    <p v-else>
      <a href @click.prevent="authStore.updateUser(null)"
        >Logout now</a
      >
    </p>
  </div>
</template>

<script>
import useAuthStore from './store'

export default {
  name: 'Logout',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  }
}
</script>
