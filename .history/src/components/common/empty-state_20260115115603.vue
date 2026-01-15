<script setup lang="ts">
defineProps<{
  icon?: string
  title?: string
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div v-if="icon" class="text-6xl mb-4">
      {{ icon }}
    </div>
    <h3 v-if="title" class="text-lg font-medium text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>
    <p v-if="message" class="text-sm text-gray-500 dark:text-gray-400">
      {{ message }}
    </p>
    <slot />
  </div>
</template>
