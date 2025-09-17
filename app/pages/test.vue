<script lang="ts" setup>
import SvgIcon from '~/components/SvgIcon.vue';
import testVue from '@/components/test.vue'
import {createVNode, render } from 'vue';
const test = useTemplateRef('test')
function resetScoped(el:Element,scopedId:string){
  let attrs = el.getAttributeNames().filter(p=>p.startsWith('data-v'))
  attrs.forEach(attr=>{
    el.removeAttribute(attr)
  })
  attrs.unshift(scopedId)
  attrs.forEach(attr=>{
    el.setAttribute(attr,'')
  })
}
function WithScoped(vNode:globalThis.VNode){
  const el = vNode.el as Element
  if(typeof vNode.type === 'string'){

  }
  else{
    // @ts-ignore
    const scopedId = vNode.type.__scopeId
    resetScoped(el,scopedId)

    el.querySelectorAll('*').forEach(subEl=>{
      resetScoped(subEl,scopedId)
    })

  }
  if(vNode.el){
    const subVnodes = vNode.el.__vnode.dynamicChildren as globalThis.VNode[]
    subVnodes.forEach(Vnode=>{
      WithScoped(Vnode)
    })
  }
}
onMounted(async ()=>{
  const code = await $fetch('/api/test')
  console.log('code: ', code);

  const dataUrl = "data:text/javascript;base64," + btoa(code)

  /* vite-skip-analysis */
  const MainVue = await (await import(/* @vite-ignore */dataUrl)).default
  console.log('MainVue: ', MainVue);

  

  const container = document.createElement('div')
  const vNode = createVNode(MainVue,{})

  render(vNode,container)
  console.log('vNode: ', vNode);
  console.log('vNode.el.__vnode: ', vNode.el!.__vnode.children);
  WithScoped(vNode)

  test.value?.appendChild(container.firstChild!)

})
</script>
<template>
  <div ref="test">
    <testVue></testVue>
    <SvgIcon :name="'more'"></SvgIcon>
  </div>
</template>