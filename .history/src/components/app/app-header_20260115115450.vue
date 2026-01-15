<script setup lang="ts">
import { computed } from 'vue'
import { useUI, useFile } from '@/composables'

const { theme, toggleTheme, showInfo } = useUI()
const { hasFiles, clearAll } = useFile()

const themeIcon = computed(() => {
  return theme.value === 'light' ? '🌙' : '☀️'
})

function handleClearAll(): void {
  if (hasFiles.value) {
    clearAll()
    showInfo('All files cleared')
  }
}
</script>

<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
          EXIF Editor
        </h1>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          View and edit image metadata
        </span>
      </div>

      <div class="flex items-center space-x-4">
        <button
          v-if="hasFiles"
          @click="handleClearAll"
          class="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          Clear All
        </button>
        <button
          @click="toggleTheme"
          class="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :title="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`"
        >
          {{ themeIcon }}
        </button>
      </div>
    </div>
  </header>
</template>
