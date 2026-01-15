import { parseMetadata, writeMetadata } from '@uswriting/exiftool'
import { logger } from '@/infrastructure/logger'
import { createError, ErrorCode } from '@/infrastructure/error'
import type { ExifData } from '@/types'

let initialized = false

export function initialize(): void {
  if (initialized) {
    return
  }
  initialized = true
  logger.info('ExifTool initialized')
}

export async function callRead(file: File): Promise<ExifData> {
  initialize()
  logger.debug('Reading EXIF from file:', file.name)

  try {
    const result = await parseMetadata<Record<string, unknown>>(file, {
      args: ['-json', '-n']
    })
    
    logger.debug('parseMetadata result:', result)

    if (Array.isArray(result) && result.length > 0) {
      const data = result[0] as Record<string, unknown>
      return {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        ...data
      } as ExifData
    }

    if (result && typeof result === 'object' && !Array.isArray(result)) {
      const data = result as Record<string, unknown>
      return {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        ...data
      } as ExifData
    }

    return {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    }
  } catch (error) {
    logger.error('Failed to parse EXIF:', error)
    return {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    }
  }
}

export async function callWrite(file: File, tags: Record<string, unknown>): Promise<ArrayBuffer> {
  initialize()
  logger.debug('Writing EXIF to file:', file.name)

  const tagValues: Record<string, string | number | boolean | (string | number | boolean)[]> = {}
  Object.entries(tags).forEach(([key, value]) => {
    tagValues[key] = String(value)
  })

  const result = await writeMetadata(file, tagValues) as ExifToolResult<ArrayBuffer>

  if (!result.success) {
    throw createError(ErrorCode.ERR_WRITE, `Failed to write EXIF: ${result.error}`)
  }

  return result.data as ArrayBuffer
}

export async function callClearAll(file: File): Promise<ArrayBuffer> {
  initialize()
  logger.debug('Clearing all EXIF from file:', file.name)

  const clearTags: Record<string, string> = {}
  const allTagNames = [
    'Make', 'Model', 'DateTime', 'CreateDate', 'ModifyDate',
    'Artist', 'Copyright', 'Software', 'ImageDescription',
    'GPSLatitude', 'GPSLongitude', 'ExposureTime', 'FNumber',
    'ISOSpeedRatings', 'FocalLength', 'ImageWidth', 'ImageHeight',
    'Orientation', 'ColorSpace', 'Flash', 'WhiteBalance'
  ]

  for (const tag of allTagNames) {
    clearTags[tag] = ''
  }

  const result = await writeMetadata(file, clearTags) as ExifToolResult<ArrayBuffer>

  if (!result.success) {
    throw createError(ErrorCode.ERR_WRITE, `Failed to clear EXIF: ${result.error}`)
  }

  return result.data as ArrayBuffer
}

export async function callClearTag(file: File, tagName: string): Promise<ArrayBuffer> {
  initialize()
  logger.debug('Clearing EXIF tag:', tagName, 'from file:', file.name)

  const result = await writeMetadata(file, { [tagName]: '' }) as ExifToolResult<ArrayBuffer>

  if (!result.success) {
    throw createError(ErrorCode.ERR_WRITE, `Failed to clear tag: ${result.error}`)
  }

  return result.data as ArrayBuffer
}
