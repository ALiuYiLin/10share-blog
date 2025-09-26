<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { routes } from './router';
import'@/assets/css/vars.css'
import'@/assets/css/base.css'
import'@/assets/css/utils.css'
import'@/assets/css/icons.css'
import'@/assets/css/fonts.css'
import'@/assets/css/vp-doc.css'
import'@/assets/css/vp-code.css'
import'@/assets/css/custom-block.css'
import { onMounted } from 'vue';
function vueBroserAdd() {
  const importMap = {
    imports: {
      vue: 'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
      'vue-router':
        'https://unpkg.com/vue-router@4/dist/vue-router.esm-browser.js',
    },
  }
  const script = document.createElement('script')
  script.type = 'importmap'
  script.crossOrigin = 'anonymous'
  script.textContent = JSON.stringify(importMap)
  document.head.appendChild(script)
}

onMounted(async ()=>{
  vueBroserAdd()
})
const router = useRouter()
</script>
<template>
  <div>
    <div>
      <ul>
        <li v-for="route in routes" @click="router.push(route.path)">{{ route.name }}</li>
      </ul>
    </div>
    <RouterView></RouterView>
  </div>
</template>
