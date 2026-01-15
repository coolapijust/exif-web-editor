import type { FileItem } from '@/types'
import { adaptFile } from '@/infrastructure/file'

export async function batchRead(files: File[]): Promise<FileItem[]> {
  const results: FileItem[] = []
  for (const file of files) {
    const fileItem: FileItem = {
      ...adaptFile(file) as FileItem,
      exifData: undefined
    }
    results.push(fileItem)
  }
  return results
}
