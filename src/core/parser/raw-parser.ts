import type { ExifData } from '@/types'

export function parseRawData(raw: unknown): ExifData {
  return raw as ExifData
}
