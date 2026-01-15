<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useFile } from '@/composables'
import { useI18n } from '@/i18n'
import { useFileStore } from '@/stores'
import { useExifStore } from '@/stores'
import ExifApp from './components/app/exif-app.vue'
import FileUpload from './components/file/file-upload.vue'
import FileList from './components/file/file-list.vue'
import InfoPanel from './components/info/info-panel.vue'
import * as fileDb from './infrastructure/file-db'

const { hasFiles } = useFile()
const { t, locale } = useI18n()
const fileStore = useFileStore()
const exifStore = useExifStore()

const pageTitle = computed(() => t('app.pageTitle'))

watch(locale, () => {
  document.title = pageTitle.value
}, { immediate: true })

onMounted(async () => {
  const exifDataMap = await fileStore.loadFromStorage()
  if (exifDataMap) {
    exifStore.restoreAllData(exifDataMap)
  }
  const count = await fileDb.getFilesCount()
  if (count === 0) {
    fileStore.clearAllData()
  }
})
</script>

<template>
  <ExifApp>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-6">
        <FileUpload />
        <FileList v-if="hasFiles" />
      </div>
      <div class="lg:col-span-2">
        <InfoPanel />
      </div>
    </div>
  </ExifApp>
</template>
