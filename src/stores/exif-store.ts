import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ExifData } from '@/types'

export const useExifStore = defineStore('exif', () => {
  const data = ref<Record<string, ExifData>>({})
  const editing = ref<Record<string, unknown> | null>(null)

  function setExifData(fileId: string, exifData: ExifData): void {
    data.value[fileId] = exifData
  }

  function updateTag(fileId: string, tagName: string, value: unknown): void {
    if (data.value[fileId]) {
      data.value[fileId][tagName] = value
    }
  }

  function removeTag(fileId: string, tagName: string): void {
    if (data.value[fileId]) {
      delete data.value[fileId][tagName]
    }
  }

  function setEditing(tags: Record<string, unknown> | null): void {
    editing.value = tags
  }

  function clearEditing(): void {
    editing.value = null
  }

  function clearFileData(fileId: string): void {
    delete data.value[fileId]
  }

  function clearAllData(): void {
    data.value = {}
  }

  function restoreAllData(exifDataMap: Record<string, ExifData>): void {
    data.value = { ...exifDataMap }
  }

  return {
    data,
    editing,
    setExifData,
    updateTag,
    removeTag,
    setEditing,
    clearEditing,
    clearFileData,
    clearAllData,
    restoreAllData
  }
})
