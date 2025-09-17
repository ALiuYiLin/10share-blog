<script lang="ts" setup>
import SvgIcon from '~/components/SvgIcon.vue';
import testVue from '@/components/test.vue'
import {createVNode, render } from 'vue';
console.log('testVue: ', testVue);

const test = useTemplateRef('test')
interface StyleInjectOptions {
  insertAt?: 'top' | 'bottom'
}

function styleInject(css: string, ref: StyleInjectOptions = {}): void {
  const insertAt = ref.insertAt

  if (!css || typeof document === 'undefined') return

  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  style.type = 'text/css'

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild)
    } else {
      head.appendChild(style)
    }
  } else {
    head.appendChild(style)
  }

  if ((style as any).styleSheet) {
    // 兼容 IE
    ;(style as any).styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
}

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
  const {code,cssString} = await $fetch('/api/test')
  console.log('cssString: ', cssString);
  console.log('code: ', code);
  styleInject(cssString)

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