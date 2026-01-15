import { writeImage } from './image-writer'
import type { ExifData, FileItem } from '@/types'

export async function batchWrite(
  files: FileItem[],
  tags: Partial<ExifData>
): Promise<ArrayBuffer[]> {
  const results: ArrayBuffer[] = []
  for (const item of files) {
    const result = await writeImage(item.file, tags)
    results.push(result)
  }
  return results
}
