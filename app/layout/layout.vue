<script lang="ts" setup>
import'~/assets/css/vars.css'
import'~/assets/css/base.css'
import'~/assets/css/utils.css'
import'~/assets/css/icons.css'
import'~/assets/css/fonts.css'
const router = useRouter()
</script>
<template>
  <div class="layout">
    <h1 @click="router.push('/')">10share-blog</h1>
    <nuxt-page></nuxt-page>
  </div>
</template>