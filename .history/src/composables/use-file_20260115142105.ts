import { ref, computed } from 'vue'
import { useFileStore, useUIStore, useExifStore } from '@/stores'
import { detectFormat } from '@/services/format-detector'
import { readAsDataURL } from '@/infrastructure/file'
import { batchRead } from '@/services/reader'
import type { FileItem, FormatInfo } from '@/types'

export function useFile() {
  const fileStore = useFileStore()
  const uiStore = useUIStore()
  const exifStore = useExifStore()
  const dragOver = ref(false)

  const hasFiles = computed(() => fileStore.files.length > 0)
  const selectedFile = computed(() => {
    if (!fileStore.selectedId) return null
    return fileStore.files.find((f: FileItem) => f.id === fileStore.selectedId) || null
  })

  function handleFileSelect(fileList: FileList | null): void {
    if (!fileList || fileList.length === 0) return
    const files = Array.from(fileList)
    const validFiles = files.filter(f => {
      const format = detectFormat(f)
      if (!format.supported) {
        uiStore.showNotification({
          id: Date.now().toString(),
          type: 'warning',
          message: `Format not supported: ${f.name}`
        })
        return false
      }
      return true
    })
    if (validFiles.length > 0) {
      processFiles(validFiles)
    }
  }

  async function processFiles(files: File[]): Promise<void> {
    fileStore.setLoading(true)
    try {
      const results = await batchRead(files)
      const newItems: FileItem[] = []
      for (const item of results) {
        console.log('[use-file] Processing file:', item.name)
        console.log('[use-file] exifData before preview:', item.exifData)
        
        const format = detectFormat(item.file)
        console.log('[use-file] format:', format)
        
        if (format.mimeType.startsWith('image/')) {
          const dataUrl = await readAsDataURL(item.file)
          console.log('[use-file] preview generated, length:', dataUrl.length)
          item.preview = dataUrl
        }
        
        console.log('[use-file] exifData after preview:', item.exifData)
        
        newItems.push(item)
        if (item.exifData) {
          console.log('[use-file] Setting exifData for:', item.id)
          exifStore.setExifData(item.id, item.exifData)
        }
      }
      await fileStore.addFiles(newItems)
      const firstItem = results[0]
      if (firstItem) {
        fileStore.selectFile(firstItem.id)
      }
    } catch (error) {
      console.error('[use-file] Error processing files:', error)
      uiStore.showNotification({
        id: Date.now().toString(),
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to process files'
      })
    } finally {
      fileStore.setLoading(false)
    }
  }

  function selectFile(id: string | null): void {
    fileStore.selectFile(id)
  }

  function removeFile(id: string): void {
    fileStore.removeFile(id)
    if (fileStore.selectedId === id) {
      const files = fileStore.files
      const firstFile = files[0]
      fileStore.selectFile(firstFile ? firstFile.id : null)
    }
  }

  function clearAll(): void {
    fileStore.clearAll()
  }

  function onDragOver(e: DragEvent): void {
    e.preventDefault()
    dragOver.value = true
  }

  function onDragLeave(): void {
    dragOver.value = false
  }

  function onDrop(e: DragEvent): void {
    e.preventDefault()
    dragOver.value = false
    if (e.dataTransfer?.files) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  function getFileFormat(file: File): FormatInfo {
    return detectFormat(file)
  }

  return {
    dragOver,
    hasFiles,
    selectedFile,
    handleFileSelect,
    processFiles,
    selectFile,
    removeFile,
    clearAll,
    onDragOver,
    onDragLeave,
    onDrop,
    formatFileSize,
    getFileFormat
  }
}
