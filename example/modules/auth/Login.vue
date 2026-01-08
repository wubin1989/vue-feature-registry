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

<script setup>
import useAuthStore from './store'

const authStore = useAuthStore()
</script>
