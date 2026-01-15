import type { ExifTag } from '@/types'

export function parseTag(name: string, value: unknown): ExifTag {
  return {
    name,
    value,
    type: typeof value,
    group: getTagGroup(name)
  }
}

function getTagGroup(name: string): string {
  if (name.startsWith('GPS')) return 'GPS'
  if (name.startsWith('Image')) return 'Image'
  if (name.startsWith('Photo')) return 'Photo'
  return 'Other'
}
