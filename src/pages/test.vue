<template>
  <div ref="container">
    <h1>test12</h1>
  </div>
</template>
<script lang="ts" setup>
import { request } from '@/utils'
import { componentMount } from '@/utils/vue'
import { onMounted, useTemplateRef } from 'vue'
const container = useTemplateRef('container')
onMounted(async () => {
  const { data } = await request<{
    code: string
    css: string
  }>('/render')
  if (container.value) componentMount(container.value, data.code, data.css)
})
</script>
