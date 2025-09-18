<script lang="ts" setup>
import SvgIcon from '~/components/SvgIcon.vue';
import testVue from '@/components/test.vue'
import {componentMount} from '~/utils'
import'~/assets/css/vp-doc.css'
import'~/assets/css/vp-code.css'
import'~/assets/css/custom-block.css'

const test = useTemplateRef('test')

onMounted(async ()=>{
  const {code,cssString} = await $fetch('/api/test',{method:'POST',body:{
    vueStr:''
  }})
  // console.log('cssString: ', cssString);
  console.log('code: ', code);

  // const {code,cssString} = await $fetch('/api/test')
  const el = document.getElementById("098000")
  if(el){
    console.log("@@@@@");
    componentMount(el,code,cssString)
  }

})
</script>
<template>
  <div ref="test" id="098000">
    <testVue></testVue>
    <SvgIcon :name="'more'"></SvgIcon>
  </div>
</template>