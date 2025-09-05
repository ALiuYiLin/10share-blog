<template>
  <div id="app">
    <h1 @click="router.push('test')">test </h1>
    <h1 @click="router.push('blog')">blog </h1>
  </div>
</template>
<script setup lang="ts">
const router = useRouter()
</script>


