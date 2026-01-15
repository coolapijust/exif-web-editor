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

  try {
    const result = await writeMetadata(file, tagValues)
    logger.debug('writeMetadata result:', result)
    return result as ArrayBuffer
  } catch (error) {
    logger.error('Failed to write EXIF:', error)
    throw createError(ErrorCode.ERR_WRITE, `Failed to write EXIF: ${error}`)
  }
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

  try {
    const result = await writeMetadata(file, clearTags)
    logger.debug('clearAll result:', result)
    return result as ArrayBuffer
  } catch (error) {
    logger.error('Failed to clear EXIF:', error)
    throw createError(ErrorCode.ERR_WRITE, `Failed to clear EXIF: ${error}`)
  }
}

export async function callClearTag(file: File, tagName: string): Promise<ArrayBuffer> {
  initialize()
  logger.debug('Clearing EXIF tag:', tagName, 'from file:', file.name)

  try {
    const result = await writeMetadata(file, { [tagName]: '' })
    logger.debug('clearTag result:', result)
    return result as ArrayBuffer
  } catch (error) {
    logger.error('Failed to clear tag:', error)
    throw createError(ErrorCode.ERR_WRITE, `Failed to clear tag: ${error}`)
  }
}
