<template>
  <svg class="icon" aria-hidden="true">
    <use :href="`#icon-${name}`"></use>
  </svg>
</template>

<script lang="ts" setup>
defineProps({
  name:{ 
    type: String,
    required: true,
   }
})
</script>