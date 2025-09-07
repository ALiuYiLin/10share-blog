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

<style>
.icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>