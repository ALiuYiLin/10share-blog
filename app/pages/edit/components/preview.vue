<script lang="ts" setup>
import'~/assets/css/vp-doc.css'
import'~/assets/css/vp-code.css'
import'~/assets/css/custom-block.css'
defineProps({
  html: {
    type: String,
    default: ''
  }
})

</script>
<template>
  <div class="preview vp-doc" v-html="html"></div>
</template>

<style scoped>


.preview {
  padding: 20px;
  width: 600px;
  margin-left: 20px;
  border: 1px solid black;
}

</style>