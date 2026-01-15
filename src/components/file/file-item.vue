<script setup lang="ts">
import type { FileItem } from '@/types'

defineProps<{
  file: FileItem
  selected?: boolean
}>()

defineEmits<{
  select: []
  remove: []
}>()
</script>

<template>
  <div
    class="flex items-center p-3 rounded-lg cursor-pointer transition-colors"
    :class="selected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
    @click="$emit('select')"
  >
    <img
      v-if="file.preview"
      :src="file.preview"
      :alt="file.name"
      class="w-12 h-12 object-cover rounded-lg mr-3"
    />
    <div v-else class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3 flex items-center justify-center">
      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
        {{ file.name }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {{ (file.size / 1024).toFixed(1) }} KB
      </p>
    </div>
    <button
      @click.stop="$emit('remove')"
      class="p-1 text-gray-400 hover:text-red-500 transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
