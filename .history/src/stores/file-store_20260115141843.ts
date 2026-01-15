import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { FileItem } from '@/types'

const STORAGE_KEY = 'exif-editor-files'

export const useFileStore = defineStore('file', () => {
  const files = ref<FileItem[]>([])
  const selectedId = ref<string | null>(null)
  const loading = ref(false)

  function addFiles(newFiles: FileItem[]): void {
    files.value.push(...newFiles)
  }

  function selectFile(id: string | null): void {
    selectedId.value = id
  }

  function setLoading(value: boolean): void {
    loading.value = value
  }

  function removeFile(id: string): void {
    const index = files.value.findIndex(f => f.id === id)
    if (index > -1) {
      files.value.splice(index, 1)
    }
    if (selectedId.value === id) {
      selectedId.value = files.value[0]?.id || null
    }
  }

  function clearAll(): void {
    files.value = []
    selectedId.value = null
  }

  function saveToStorage(): void {
    const data = files.value.map(f => ({
      id: f.id,
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
      preview: f.preview
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      files: data,
      selectedId: selectedId.value
    }))
  }

  function loadFromStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        if (parsed.files && Array.isArray(parsed.files)) {
          files.value = parsed.files
          selectedId.value = parsed.selectedId || null
        }
      }
    } catch (e) {
      console.warn('Failed to load files from storage:', e)
    }
  }

  function clearStorage(): void {
    localStorage.removeItem(STORAGE_KEY)
  }

  watch([files, selectedId], () => {
    if (files.value.length > 0) {
      saveToStorage()
    }
  }, { deep: true })

  return {
    files,
    selectedId,
    loading,
    addFiles,
    selectFile,
    setLoading,
    removeFile,
    clearAll,
    saveToStorage,
    loadFromStorage,
    clearStorage
  }
})
