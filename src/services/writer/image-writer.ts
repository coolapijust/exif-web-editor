import { callWrite } from '@/core/executor'
import type { ExifData } from '@/types'

export async function writeImage(
  file: File,
  tags: Partial<ExifData>
): Promise<ArrayBuffer> {
  return await callWrite(file, tags as Record<string, unknown>)
}
