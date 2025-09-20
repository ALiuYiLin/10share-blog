<template>
  <div>
    <h1>test12</h1>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';

onMounted(async()=>{
  fetch('/docs').then((res)=>{
    console.log('res: ', res);
  })
})

</script>