import { callRead } from '@/core/executor'
import type { ExifData } from '@/types'

export async function readImage(file: File): Promise<ExifData> {
  return await callRead(file)
}
