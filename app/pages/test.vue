<script lang="ts" setup>
import SvgIcon from '~/components/SvgIcon.vue';
import { createElementBlock, openBlock, createElementVNode, createVNode, render } from 'vue';
const test = useTemplateRef('test')
const codeStr = `\
import { createElementBlock, openBlock, createElementVNode, createVNode } from 'vue';

function render(_ctx, _cache) {
  return (openBlock(), createElementBlock("div", null, [...(_cache[0] || (_cache[0] = [
    createElementVNode("h1", null, "hello", -1 /* CACHED */)
  ]))]))
}

const script$1 = {};


script$1.render = render;
script$1.__file = "foo.vue";

var script = {
  __name: 'main',
  setup(__props) {

return (_ctx, _cache) => {
  return (openBlock(), createElementBlock("div", null, [
    _cache[0] || (_cache[0] = createElementVNode("h1", null, "main.vue", -1 /* CACHED */)),
    createVNode(script$1)
  ]))
}
}

};

script.__file = "main.vue";

export { script as default };
`

onMounted(async ()=>{
  
  const blob = new Blob([codeStr],{type:'application/javascript'})
  const moduleUrl = URL.createObjectURL(blob)
  console.log('moduleUrl: ', moduleUrl);

  /* vite-skip-analysis */
  const MainVue = await (await import(moduleUrl)).default
  console.log('MainVue: ', MainVue);

  const container = document.createElement('div')
  const vNode = createVNode(MainVue,{})
  render(vNode,container)
  test.value?.appendChild(container.firstChild!)
})
</script>
<template>
  <div ref="test">
    <SvgIcon :name="'more'"></SvgIcon>
    <!-- <MainVue></MainVue> -->
  </div>
</template>