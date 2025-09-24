<template>
  <div ref="container">
    <h1>test12</h1>
  </div>
</template>
<script lang="ts" setup>
import { request } from '@/utils'
import { componentMount } from '@/utils/vue'
import { onMounted, useTemplateRef } from 'vue'
import'@/assets/css/vars.css'
import'@/assets/css/base.css'
import'@/assets/css/utils.css'
import'@/assets/css/icons.css'
import'@/assets/css/fonts.css'
import'@/assets/css/vp-doc.css'
import'@/assets/css/vp-code.css'
import'@/assets/css/custom-block.css'
const container = useTemplateRef('container')

function vueBroserAdd() {
  const importMap = {
    imports: {
      vue: 'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
      'vue-router':
        'https://unpkg.com/vue-router@4/dist/vue-router.esm-browser.js',
    },
  }
  const script = document.createElement('script')
  script.type = 'importmap'
  script.crossOrigin = 'anonymous'
  script.textContent = JSON.stringify(importMap)

  document.head.appendChild(script)
}
onMounted(async () => {
  vueBroserAdd()
  const { data } = await request<{
    code: string
    css: string
  }>('/render')
  console.log('data.code: ', data.code)
  console.log('data.code: ', data.css)
  if (container.value) componentMount(container.value, data.code, data.css)
})
</script>
