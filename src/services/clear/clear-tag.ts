import { callClearTag } from '@/core/executor'

export async function clearTag(file: File, tagName: string): Promise<ArrayBuffer> {
  return await callClearTag(file, tagName)
}
