import { parseMetadata, writeMetadata } from '@uswriting/exiftool'
import { logger } from '@/infrastructure/logger'
import { createError, ErrorCode } from '@/infrastructure/error'
import type { ExifData } from '@/types'
import type { ExifToolOutput } from '@uswriting/exiftool'

export interface ExifToolOutput<T> =
  | {
      success: true
      data: T
      error: string
      exitCode: 0
    }
  | {
      success: false
      data: undefined
      error: string
      exitCode: number | undefined
    }

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

  const result = await parseMetadata<Record<string, unknown>>(file, {
    args: ['-json', '-n']
  })

  if (!result.success) {
    throw createError(ErrorCode.ERR_PARSE, `Failed to parse EXIF: ${result.error}`)
  }

  if (result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
    const data = result.data as Record<string, unknown>
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
}

export async function callWrite(file: File, tags: Record<string, unknown>): Promise<ArrayBuffer> {
  initialize()
  logger.debug('Writing EXIF to file:', file.name)

  const result = await writeMetadata(file, tags)

  if (!result.success) {
    throw createError(ErrorCode.ERR_WRITE, `Failed to write EXIF: ${result.error}`)
  }

  return result.data as ArrayBuffer
}

export async function callClearAll(file: File): Promise<ArrayBuffer> {
  initialize()
  logger.debug('Clearing all EXIF from file:', file.name)

  const clearTags: Record<string, unknown> = {}
  const allTagNames = [
    '-Make', '-Model', '-DateTime', '-CreateDate', '-ModifyDate',
    '-Artist', '-Copyright', '-Software', '-ImageDescription',
    '-GPSLatitude', '-GPSLongitude', '-ExposureTime', '-FNumber',
    '-ISOSpeedRatings', '-FocalLength', '-ImageWidth', '-ImageHeight',
    '-Orientation', '-ColorSpace', '-Flash', '-WhiteBalance'
  ]

  for (const tag of allTagNames) {
    clearTags[tag.replace('-', '')] = ''
  }

  const result = await writeMetadata(file, clearTags)

  if (!result.success) {
    throw createError(ErrorCode.ERR_WRITE, `Failed to clear EXIF: ${result.error}`)
  }

  return result.data as ArrayBuffer
}

export async function callClearTag(file: File, tagName: string): Promise<ArrayBuffer> {
  initialize()
  logger.debug('Clearing EXIF tag:', tagName, 'from file:', file.name)

  const result = await writeMetadata(file, { [tagName]: '' })

  if (!result.success) {
    throw createError(ErrorCode.ERR_WRITE, `Failed to clear tag: ${result.error}`)
  }

  return result.data as ArrayBuffer
}
