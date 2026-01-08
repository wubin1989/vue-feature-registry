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

<script setup>
import useAuthStore from './store'

const authStore = useAuthStore()
</script>
