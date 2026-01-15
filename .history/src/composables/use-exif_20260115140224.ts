import { ref, computed } from 'vue'
import { useExifStore, useFileStore, useUIStore } from '@/stores'
import { batchRead } from '@/services/reader'
import { writeImage } from '@/services/writer'
import { clearAllExif, clearTag } from '@/services/clear'
import { readAsDataURL } from '@/infrastructure/file'
import type { ExifData, FileItem } from '@/types'

export function useExif() {
  const exifStore = useExifStore()
  const fileStore = useFileStore()
  const uiStore = useUIStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const currentFile = computed(() => {
    if (!fileStore.selectedId) return null
    return fileStore.files.find((f: FileItem) => f.id === fileStore.selectedId) || null
  })

  const currentExifData = computed(() => {
    if (!fileStore.selectedId) return null
    return exifStore.data[fileStore.selectedId] || null
  })

  async function loadExifData(files: File[]): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const results = await batchRead(files)
      for (const item of results) {
        fileStore.addFiles([item])
        if (item.exifData) {
          exifStore.setExifData(item.id, item.exifData)
        }
        const preview = await readAsDataURL(item.file)
        item.preview = preview
      }
      const firstFile = results[0]
      if (firstFile && !fileStore.selectedId) {
        fileStore.selectFile(firstFile.id)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load EXIF data'
      uiStore.showNotification({
        id: Date.now().toString(),
        type: 'error',
        message: error.value
      })
    } finally {
      loading.value = false
    }
  }

  async function updateTag(tagName: string, value: unknown): Promise<ArrayBuffer | null> {
    if (!fileStore.selectedId) return null
    loading.value = true
    try {
      const file = currentFile.value
      if (!file) return null
      console.log('Writing tag:', tagName, '=', value)
      const data = await writeImage(file.file, { [tagName]: value } as Partial<ExifData>)
      console.log('Write result:', data, 'size:', data?.byteLength)
      exifStore.updateTag(fileStore.selectedId, tagName, value)
      uiStore.showNotification({
        id: Date.now().toString(),
        type: 'success',
        message: `Tag "${tagName}" updated`
      })
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update tag'
      uiStore.showNotification({
        id: Date.now().toString(),
        type: 'error',
        message: error.value
      })
      return null
    } finally {
      loading.value = false
    }
  }

  async function removeTag(tagName: string): Promise<void> {
    const selectedId = fileStore.selectedId
    if (!selectedId) return
    loading.value = true
    try {
      const file = currentFile.value
      if (!file) return
      await clearTag(file.file, tagName)
      exifStore.removeTag(selectedId, tagName)
      uiStore.showNotification({
        id: Date.now().toString(),
        type: 'success',
        message: `Tag "${tagName}" removed`
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to remove tag'
      uiStore.showNotification({
        id: Date.now().toString(),
        type: 'error',
        message: error.value
      })
    } finally {
      loading.value = false
    }
  }

  async function clearAllTags(): Promise<void> {
    const selectedId = fileStore.selectedId
    if (!selectedId) return
    loading.value = true
    try {
      const file = currentFile.value
      if (!file) return
      await clearAllExif(file.file)
      const currentData = exifStore.data[selectedId]
      if (currentData) {
        Object.keys(currentData).forEach(key => {
          if (key !== 'fileName' && key !== 'fileSize' && key !== 'mimeType') {
            exifStore.removeTag(selectedId, key)
          }
        })
      }
      uiStore.showNotification({
        id: Date.now().toString(),
        type: 'success',
        message: 'All EXIF tags cleared'
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to clear tags'
      uiStore.showNotification({
        id: Date.now().toString(),
        type: 'error',
        message: error.value
      })
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    currentFile,
    currentExifData,
    loadExifData,
    updateTag,
    removeTag,
    clearAllTags
  }
}
