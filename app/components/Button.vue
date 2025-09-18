<template>
  <div class="mybutton">
    <button>nihao{{ a }}</button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const a = ref('123')
</script>
<style scoped>
.mybutton button{
  color: green;
}
</style>