<script lang="ts" setup>
import Editor from './components/editor.vue';
import Preview from './components/preview.vue';
const content = ref('nihao\nnnn')
const html = ref('')
const render = ()=>{
  $fetch('/api/render',{
    method:'POST',
    body: {
      content: content.value
    }
  }).then(res=>{
    html.value = res
  }).catch(e=>{
    console.log('e: ', e);
  })
}
</script>

<template>
  <div id="edit-page">
    <div>
      <button @click="render">保存</button>
    </div>
    <div class="markdown-wrapper">
      <Editor  v-model="content"  ></Editor>
      <Preview :html="html"></Preview>
    </div>
  </div>
</template>

<style scoped>
.markdown-wrapper{
  display: flex;
  flex-direction: row;
}
</style>
