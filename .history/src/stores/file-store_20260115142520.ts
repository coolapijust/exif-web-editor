import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { FileItem } from '@/types'
import * as fileDb from '@/infrastructure/file-db'

export const useFileStore = defineStore('file', () => {
  const files = ref<FileItem[]>([])
  const selectedId = ref<string | null>(null)
  const loading = ref(false)
  const dbReady = ref(false)

  async function addFiles(newFiles: FileItem[], exifDataMap?: Record<string, ExifData>): Promise<void> {
    files.value.push(...newFiles)
    for (const file of newFiles) {
      const fileData = file.file
      if (fileData) {
        const content = await fileData.arrayBuffer()
        await fileDb.saveFile({
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          content,
          preview: file.preview || null,
          exifData: exifDataMap?.[file.id]
        })
      }
    }
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
    fileDb.deleteFile(id)
  }

  function clearAll(): void {
    files.value = []
    selectedId.value = null
    fileDb.clearAllFiles()
  }

  function clearAllData(): void {
    files.value = []
    selectedId.value = null
  }

  async function loadFromStorage(): Promise<Record<string, ExifData> | null> {
    if (dbReady.value) return null
    try {
      const storedFiles = await fileDb.getAllFiles()
      if (storedFiles.length > 0) {
        const items: FileItem[] = []
        const exifDataMap: Record<string, ExifData> = {}
        for (const sf of storedFiles) {
          const blob = new Blob([sf.content], { type: sf.type })
          const file = new File([blob], sf.name, { type: sf.type, lastModified: sf.lastModified })
          items.push({
            id: sf.id,
            name: sf.name,
            size: sf.size,
            type: sf.type,
            lastModified: sf.lastModified,
            file,
            preview: sf.preview
          })
          if (sf.exifData) {
            exifDataMap[sf.id] = sf.exifData as ExifData
          }
        }
        files.value = items
        if (items.length > 0) {
          selectedId.value = items[0].id
        }
        dbReady.value = true
        return exifDataMap
      }
    } catch (e) {
      console.warn('Failed to load files from IndexedDB:', e)
    }
    dbReady.value = true
    return null
  }

  async function refreshFileContent(id: string): Promise<void> {
    const file = files.value.find(f => f.id === id)
    if (!file || !file.file) return
    const content = await file.file.arrayBuffer()
    await fileDb.saveFile({
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      content,
      preview: file.preview || null
    })
  }

  return {
    files,
    selectedId,
    loading,
    addFiles,
    selectFile,
    setLoading,
    removeFile,
    clearAll,
    clearAllData,
    loadFromStorage,
    refreshFileContent
  }
})
