<template>
  <div id="blog-page">
    <ul>
      <li v-for="blogPath in blogPaths" :key="blogPath" >
        <p @click="loadBlogContent(blogPath)">{{ blogPath }}</p>
      </li>
    </ul>
    <div ref="10share-docs"></div>
  </div>
</template>


<script setup lang="ts">
import'~/assets/css/vp-doc.css'
import'~/assets/css/vp-code.css'
import'~/assets/css/custom-block.css'
import path from 'path'
const blogPaths = ref<string[] | null>(null)
const el = useTemplateRef('10share-docs')
async function loadBlogContent(blogPath:string) {
  let {code ,cssString} = await $fetch<{code:string,cssString:string}>(`/api/render/?path=${blogPath}`, {method: 'get'})
  componentMount(el.value!,code,cssString)
}


onMounted(async ()=>{
  try{
   blogPaths.value = await $fetch<string[]>('/api/blogs') 
   console.log('blogPaths.value: ', blogPaths.value);
  }catch(error){
    console.log('error: ', error);
  }
})
if(import.meta.hot){
  import.meta.hot.on('md:hrm',(p)=>{
    console.log("发生热重载");
    loadBlogContent('example/vue')
  })
}
</script>

<style scoped>
#blog-page {
  width: 688px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>