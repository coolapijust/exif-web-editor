import { readImage } from './image-reader'
import type { ExifData, FileItem } from '@/types'
import { adaptFile } from '@/infrastructure/file'

export async function batchRead(files: File[]): Promise<FileItem[]> {
  const results: FileItem[] = []
  for (const file of files) {
    const exifData = await readImage(file)
    const fileItem: FileItem = {
      ...adaptFile(file) as FileItem,
      exifData
    }
    results.push(fileItem)
  }
  return results
}
