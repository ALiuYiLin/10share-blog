<script lang="ts" setup>
import SvgIcon from '~/components/SvgIcon.vue';

import {createVNode, render } from 'vue';
const test = useTemplateRef('test')
const codeStr = ``

onMounted(async ()=>{
  
  const blob = new Blob([codeStr],{type:'application/javascript'})
  const moduleUrl = URL.createObjectURL(blob)
  console.log('moduleUrl: ', moduleUrl);

  /* vite-skip-analysis */
  const MainVue = await (await import(/* @vite-ignore */moduleUrl)).default
  console.log('MainVue: ', MainVue);

  const container = document.createElement('div')
  const vNode = createVNode(MainVue,{})
  render(vNode,container)
  test.value?.appendChild(container.firstChild!)

  $fetch('/api/test')
})
</script>
<template>
  <div ref="test">
    <SvgIcon :name="'more'"></SvgIcon>
  </div>
</template>