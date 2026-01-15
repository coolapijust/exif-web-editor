<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFileStore, useExifStore } from '@/stores'
import { useI18n } from '@/i18n'
import { useExif } from '@/composables'
import ClearButton from '../editor/clear-button.vue'
import EditDialog from '../editor/edit-dialog.vue'
import TagGroup from './tag-group.vue'
import ImagePreview from '../common/image-preview.vue'

const fileStore = useFileStore()
const exifStore = useExifStore()
const { t } = useI18n()
const { updateTag } = useExif()

const editDialogOpen = ref(false)
const editingTag = ref<{ name: string; value: unknown } | null>(null)

const selectedFile = computed(() => {
  if (!fileStore.selectedId) return null
  return fileStore.files.find(f => f.id === fileStore.selectedId) || null
})

const exifData = computed(() => {
  if (!fileStore.selectedId) return null
  return exifStore.data[fileStore.selectedId] || null
})

const HIDDEN_TAGS = new Set([
  'ExifToolVersion',
  'FileName',
  'FileSize',
  'MimeType',
  'Directory',
  'FileModifyDate',
  'FileAccessDate',
  'FileCreateDate',
  'FilePermissions',
  'FileType',
  'FileTypeExtension',
  'ContainerFormat',
  'MajorBrand',
  'MinorVersion',
  'CompatibleBrands',
  'Brand',
  'Version',
  'Extension',
  'Warning',
  'Error'
])

const groupedTags = computed(() => {
  if (!exifData.value) return {}
  const groups: Record<string, Record<string, unknown>> = {}
  Object.entries(exifData.value).forEach(([key, value]) => {
    if (HIDDEN_TAGS.has(key)) return
    let group = 'Other'
    if (key.startsWith('GPS')) group = 'GPS'
    else if (key.startsWith('Image') || key.startsWith('Make') || key.startsWith('Model') || key.startsWith('Software')) group = 'Image'
    else if (key.startsWith('Photo') || key.startsWith('Exposure') || key.startsWith('FNumber') || key.startsWith('ISOSpeed') || key.startsWith('Focal') || key.startsWith('DateTime') || key.startsWith('Orientation')) group = 'Photo'
    else if (key.startsWith('Exif') || key.startsWith('WhiteBalance') || key.startsWith('Flash')) group = 'Photo'
    if (!groups[group]) groups[group] = {}
    groups[group]![key] = value
  })
  for (const key of Object.keys(groups)) {
    const groupData = groups[key]
    if (groupData && Object.keys(groupData).length === 0) {
      delete groups[key]
    }
  }
  return groups
})

const displayName = computed(() => selectedFile.value?.name || 'Unknown')
const fileSize = computed(() => {
  if (!selectedFile.value) return '0 KB'
  return (selectedFile.value.size / 1024).toFixed(1) + ' KB'
})
const mimeType = computed(() => selectedFile.value?.type || 'unknown')

function handleEditTag(tagName: string, value: unknown): void {
  editingTag.value = { name: tagName, value }
  editDialogOpen.value = true
}

function handleSaveTag(tagName: string, newValue: string): void {
  if (fileStore.selectedId) {
    updateTag(tagName, newValue)
  }
  editDialogOpen.value = false
  editingTag.value = null
}
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

      <div class="p-6 space-y-6">
        <div v-if="selectedFile.preview" class="max-w-xs">
          <ImagePreview :src="selectedFile.preview" :alt="selectedFile.name" />
        </div>

        <div v-if="Object.keys(groupedTags).length > 0">
          <TagGroup
            v-for="(tags, groupName) in groupedTags"
            :key="groupName"
            :name="t(`info.groups.${groupName.toLowerCase()}`)"
            :tags="tags"
            @edit="handleEditTag"
          />
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">
            {{ t('info.noExif') }}
          </p>
        </div>
      </div>
    </template>

    <div v-else class="flex flex-col items-center justify-center py-12 px-4 text-center">
      <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ t('info.noFileSelected') }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ t('info.selectFileHint') }}
      </p>
    </div>

    <EditDialog
      v-if="editingTag"
      :open="editDialogOpen"
      :tag-name="editingTag.name"
      :current-value="editingTag.value"
      @close="editDialogOpen = false; editingTag = null"
      @save="handleSaveTag"
    />
  </div>
</template>
