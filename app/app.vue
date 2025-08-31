<template>
  <div id="app">
    <button @click="submit">按钮</button>
  </div>
</template>


<script lang="ts" setup>
import { createVNode, render } from "vue";

const htmlStr = ref('')

async function submit() {
  const html = await $fetch<string>('/api/render', {
    method: 'post',
    body: { content: '## 你好' }
  })
  const container = document.createElement('div')
  container.innerHTML = html
  document.getElementById('app')?.appendChild(container.firstChild!)

}
</script>