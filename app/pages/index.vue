<template>
  <div id="app">
    <ul>
      <li v-for="blogPath in blogPaths" :key="blogPath" >
        <p @click="loadBlogContent(blogPath)">{{ blogPath }}</p>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import'~/assets/css/vars.css'
import'~/assets/css/base.css'
import'~/assets/css/utils.css'
import'~/assets/css/vp-doc.css'
import'~/assets/css/vp-code.css'
import'~/assets/css/icons.css'
import'~/assets/css/fonts.css'
import'~/assets/css/custom-block.css'
const blogPaths = ref<string[] | null>(null)
async function loadBlogContent(blogPath:string) {
  let html:string = ''
  try {
    html = await $fetch<string>(`/api/render/${blogPath}`, {method: 'get'})
  } catch (error) {
    console.log('error: ', error);
  }
  const id = '10share-blog'
  let container = document.getElementById(id)
  if(!container){
    container = document.createElement('div')
    container.className = 'vp-doc'
    container.id = '10share-blog'
    document.getElementById('app')?.appendChild(container)
  }
  container.innerHTML = html
}


onMounted(async ()=>{
  try{
   blogPaths.value = await $fetch<string[]>('/api/blogs') 
   console.log('blogPaths.value: ', blogPaths.value);
  }catch(error){
    console.log('error: ', error);
  }
})
</script>

<style scoped>
#app {
  width: 688px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>

