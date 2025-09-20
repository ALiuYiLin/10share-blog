<template>
  <div id="docs-page">
    <ul>
      <li v-for="docsPath in docsPaths" :key="docsPath">{{ docsPath }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { request } from '@/utils/api';
import { onMounted, ref } from 'vue';

const docsPaths = ref<string[]|null>(null)

onMounted(async()=>{
   docsPaths.value = (await request<string[]>('/docs')).data
})

</script>