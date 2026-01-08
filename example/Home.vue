<template>
  <div>
    <h2>Hello!</h2>
    <p>Custom key from auth module:</p>
    <code>{{ $modules?.auth?.custom }}</code>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
