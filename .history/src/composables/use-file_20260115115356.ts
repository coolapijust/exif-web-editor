import { ref, computed } from 'vue'
import { useFileStore, useUIStore } from '@/stores'
import { detectFormat } from '@/services/format-detector'
import { readAsDataURL } from '@/infrastructure/file'
import type { FileItem, FormatInfo } from '@/types'

export function useFile() {
  const fileStore = useFileStore()
  const uiStore = useUIStore()
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
      const items: FileItem[] = []
      for (const file of files) {
        const format = detectFormat(file)
        const item: FileItem = {
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: undefined
        }
        if (format.mimeType.startsWith('image/')) {
          item.preview = await readAsDataURL(file)
        }
        items.push(item)
      }
      fileStore.addFiles(items)
      const firstItem = items[0]
      if (firstItem && !fileStore.selectedId) {
        fileStore.selectFile(firstItem.id)
      }
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

  function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
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
