<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { routes } from './router';
const router = useRouter()
</script>
<template>
  <div>
    <div>
      <ul>
        <li v-for="route in routes" @click="router.push(route.path)">{{ route.name }}</li>
      </ul>
    </div>
    <RouterView></RouterView>
  </div>
</template>