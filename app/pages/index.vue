<template>
  <div id="app">
    <ul>
      <li v-for="route in router.options.routes"><h1 @click="router.push(route.path)">{{ route.name }}</h1></li>
    </ul>
  </div>
</template>
<script setup lang="ts">
const router = useRouter()
</script>


