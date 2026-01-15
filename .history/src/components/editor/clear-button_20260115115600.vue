<script setup lang="ts">
import { useExif } from '@/composables'

const { removeTag } = useExif()

async function handleClearAll(): Promise<void> {
  if (confirm('Are you sure you want to clear all EXIF data from this image?')) {
    await removeTag('all')
  }
}
</script>

<template>
  <button
    @click="handleClearAll"
    class="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
  >
    Clear All EXIF
  </button>
</template>
