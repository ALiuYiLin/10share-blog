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