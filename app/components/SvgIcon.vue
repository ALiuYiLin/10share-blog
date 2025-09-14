<template>
  <svg class="icon" aria-hidden="true">
    <use :href="`#icon-${name}`"></use>
  </svg>
</template>

<script lang="ts" setup>
import '@/components/xxx.css'
defineProps({
  name:{ 
    type: String,
    required: true,
   }
})
</script>