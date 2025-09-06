<script lang="ts" setup>
import Editor from './components/editor.vue';
const content = ref('nihao\nnnn')
</script>

<template>
  <div id="edit-page">
    <Editor  v-model="content"  ></Editor>
  </div>
</template>
