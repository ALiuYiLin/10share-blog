<script lang="ts" setup>
const content = ref('')
const blogPath = ref('')
const blogName = ref('')
function saveBlogs(){
  $fetch('/api/blogs/save',{
    method:'POST',
    body:{
      content: content.value,
      blogPath: blogPath.value,
      name: blogName.value
    }
  })
}
</script>

<template>
  <div id="edit-page">
    <input v-model="blogPath" placeholder="blog path" type="text">
    <input v-model="blogName" placeholder="blog name" type="text">
    <textarea placeholder="blog content" v-model="content" rows="10"></textarea>
    <button @click="saveBlogs">submit</button>
  </div>
</template>

<style scoped>
input {
  width: 400px;
  border: 1px solid black;
  padding: 10px;
}
textarea {
  width: 400px;
  border: 1px solid black;
  padding: 10px;
}
button {
  padding: 3px 10px;
  border: 1px solid green;
  border-radius: 4px;
  color: white;
  background-color: green;
}
</style>