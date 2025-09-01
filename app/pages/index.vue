<template>
  <div id="app">
    <button @click="submit">Submit</button>
  </div>
</template>
<script setup lang="ts">
import'~/assets/css/vars.css'
import'~/assets/css/base.css'
import'~/assets/css/utils.css'
import'~/assets/css/vp-doc.css'

async function submit() {
  const html = await $fetch<string>('/api/render', {
    method: 'post',
    body: { content: '## 你好' }
  })
  const container = document.createElement('div')
  container.className = 'vp-doc'
  container.innerHTML = html
  document.getElementById('app')?.appendChild(container)
}
</script>

