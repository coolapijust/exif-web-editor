import { callClearAll } from '@/core/executor'

export async function clearAllExif(file: File): Promise<ArrayBuffer> {
  return await callClearAll(file)
}
