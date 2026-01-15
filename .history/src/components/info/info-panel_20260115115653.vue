<script setup lang="ts">
import { computed } from 'vue'
import { useFileStore, useExifStore } from '@/stores'
import ClearButton from '../editor/clear-button.vue'
import EmptyState from '../common/empty-state.vue'
import TagGroup from './tag-group.vue'

const fileStore = useFileStore()
const exifStore = useExifStore()

const selectedFile = computed(() => {
  if (!fileStore.selectedId) return null
  return fileStore.files.find(f => f.id === fileStore.selectedId) || null
})

const exifData = computed(() => {
  if (!fileStore.selectedId) return null
  return exifStore.data[fileStore.selectedId] || null
})

const groupedTags = computed(() => {
  if (!exifData.value) return {}
  const groups: Record<string, Record<string, unknown>> = {}
  Object.entries(exifData.value).forEach(([key, value]) => {
    if (key === 'fileName' || key === 'fileSize' || key === 'mimeType') return
    let group = 'Other'
    if (key.startsWith('GPS')) group = 'GPS'
    else if (key.startsWith('Image') || key.startsWith('Make') || key.startsWith('Model') || key.startsWith('Software')) group = 'Image'
    else if (key.startsWith('Photo') || key.startsWith('Exposure') || key.startsWith('FNumber') || key.startsWith('ISOSpeed') || key.startsWith('Focal') || key.startsWith('DateTime') || key.startsWith('Orientation')) group = 'Photo'
    else if (key.startsWith('Exif') || key.startsWith('WhiteBalance') || key.startsWith('Flash')) group = 'Photo'
    if (!groups[group]) groups[group] = {}
    groups[group]![key] = value
  })
  return groups
})

const displayName = computed(() => selectedFile.value?.name || 'Unknown')
const fileSize = computed(() => {
  if (!selectedFile.value) return '0 KB'
  return (selectedFile.value.size / 1024).toFixed(1) + ' KB'
})
const mimeType = computed(() => selectedFile.value?.type || 'unknown')
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
    <template v-if="selectedFile">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {{ displayName }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ fileSize }} • {{ mimeType }}
            </p>
          </div>
          <ClearButton />
        </div>
      </div>

      <div class="p-6">
        <TagGroup
          v-for="(tags, groupName) in groupedTags"
          :key="groupName"
          :name="groupName"
          :tags="tags"
        />
      </div>
    </template>

    <EmptyState v-else />
  </div>
</template>
