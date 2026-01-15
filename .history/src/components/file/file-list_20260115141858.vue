<script setup lang="ts">
import { computed } from 'vue'
import { useFileStore, useExifStore } from '@/stores'
import { useI18n } from '@/i18n'

const fileStore = useFileStore()
const exifStore = useExifStore()
const { t } = useI18n()

const files = computed(() => fileStore.files)
const selectedId = computed(() => fileStore.selectedId)

function selectFile(id: string): void {
  fileStore.selectFile(id)
}

function removeFile(e: Event, id: string): void {
  e.stopPropagation()
  fileStore.removeFile(id)
  exifStore.clearFileData(id)
}
</script>

<template>
  <div v-if="files.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ t('fileList.title') }} ({{ files.length }})
      </h3>
    </div>
    <div class="max-h-96 overflow-y-auto">
      <div
        v-for="file in files"
        :key="file.id"
        class="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        :class="{ 'bg-blue-50 dark:bg-blue-900/20': selectedId === file.id }"
        @click="selectFile(file.id)"
      >
        <img
          v-if="file.preview"
          :src="file.preview"
          :alt="file.name"
          class="w-10 h-10 object-cover rounded-lg mr-3"
        />
        <div v-else class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3 flex items-center justify-center">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ file.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ (file.size / 1024).toFixed(1) }} {{ t('fileList.size') }}
          </p>
        </div>
        <button
          @click="(e) => removeFile(e, file.id)"
          class="p-1 text-gray-400 hover:text-red-500 transition-colors"
          :title="t('common.delete')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
