import type { FileItem } from '@/types'

export function adaptFile(file: File): Partial<FileItem> {
  return {
    id: generateId(),
    file,
    name: file.name,
    size: file.size,
    type: file.type
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}
