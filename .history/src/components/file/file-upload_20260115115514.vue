<script setup lang="ts">
import { useFile, useExif } from '@/composables'

const { handleFileSelect, onDragOver, onDragLeave, onDrop, dragOver } = useFile()
const { loading } = useExif()

function handleFileChange(event: Event): void {
  const target = event.target as HTMLInputElement
  handleFileSelect(target.files)
  target.value = ''
}
</script>

<template>
  <div
    class="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200"
    :class="[
      dragOver
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
    ]"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div v-if="loading" class="flex flex-col items-center justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading EXIF data...</p>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-8">
      <svg
        class="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p class="text-lg text-gray-700 dark:text-gray-300 mb-2">
        Drag and drop images here
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        or click to select files
      </p>
      <p class="text-xs text-gray-400 dark:text-gray-500">
        Supports JPEG, PNG, WebP, HEIC, TIFF
      </p>

      <label class="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
        <span>Select Files</span>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/heic,image/tiff"
          class="hidden"
          @change="handleFileChange"
        />
      </label>
    </div>
  </div>
</template>
