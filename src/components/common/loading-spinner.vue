<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'white'
}>()
</script>

<template>
  <div
    class="animate-spin rounded-full border-2 border-current"
    :class="{
      'h-4 w-4 border-b-2': size === 'sm',
      'h-8 w-8 border-b-2': size === 'md' || !size,
      'h-12 w-12 border-b-4': size === 'lg',
      'text-blue-600': color === 'blue' || !color,
      'text-white': color === 'white'
    }"
  />
</template>
