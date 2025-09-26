<template>
  <div id="docs-page">
    <ul>
      <li v-for="docsPath in docsPaths" :key="docsPath" @click="showDoc(docsPath)">{{ docsPath }}</li>
    </ul>
    <div ref="doc-wrapper"></div>
  </div>
</template>

<script lang="ts" setup>
import { request } from '@/utils/api';
import { componentMount } from '@/utils/vue';
import { onMounted, ref, useTemplateRef } from 'vue';
const docWrapper = useTemplateRef('doc-wrapper')
const docsPaths = ref<string[]|null>(null)
async function showDoc(docPath:string){
  const {data} = await request<{code:string,css:string}>('/render?docPath='+docPath.replaceAll('\\','/'))
  if(docWrapper.value) componentMount(docWrapper.value,data.code,data.css)
}

onMounted(async()=>{
  docsPaths.value = (await request<string[]>('/docs')).data
})

</script>