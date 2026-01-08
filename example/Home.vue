<template>
  <div>
    <h2>Hello!</h2>
    <p>Custom key from auth module:</p>
    <code>{{ modulesCustom }}</code>
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    modulesCustom() {
      return this.$modules && this.$modules.auth && this.$modules.auth.custom
    }
  }
}
</script>
