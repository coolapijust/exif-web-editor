import type { FormatInfo } from '@/types'

const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/tiff'
]

export function detectFormat(file: File): FormatInfo {
  const extension = getExtension(file.name)
  const mimeType = file.type
  const supported = SUPPORTED_FORMATS.includes(mimeType)
  return { mimeType, extension, supported }
}

function getExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || ''
}
