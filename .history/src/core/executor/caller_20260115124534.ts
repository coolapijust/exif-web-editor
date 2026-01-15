import { parseMetadata, writeMetadata } from '@uswriting/exiftool'
import { logger } from '@/infrastructure/logger'
import type { ExifData } from '@/types'

let initialized = false
let wasmModule: ArrayBuffer | null = null

async function loadWasmModule(): Promise<ArrayBuffer> {
  if (wasmModule) return wasmModule
  const response = await fetch('/zeroperl.wasm')
  if (!response.ok) {
    throw new Error(`Failed to load WASM: ${response.statusText}`)
  }
  wasmModule = await response.arrayBuffer()
  return wasmModule
}

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
    const wasmBuffer = await loadWasmModule()
    const result = await parseMetadata<Record<string, unknown>>(file, {
      args: ['-json', '-n'],
      fetch: () => Promise.resolve(new Response(wasmBuffer))
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
    const result = await writeMetadata(file, tagValues) as { success: boolean; data: ArrayBuffer; error?: string }
    logger.debug('writeMetadata result:', result)
    if (result.success && result.data) {
      return result.data
    }
    throw new Error(result.error || 'Failed to write EXIF')
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
    const result = await writeMetadata(file, clearTags) as { success: boolean; data: ArrayBuffer; error?: string }
    logger.debug('clearAll result:', result)
    if (result.success && result.data) {
      return result.data
    }
    throw new Error(result.error || 'Failed to clear EXIF')
  } catch (error) {
    logger.error('Failed to clear EXIF:', error)
    throw createError(ErrorCode.ERR_WRITE, `Failed to clear EXIF: ${error}`)
  }
}

export async function callClearTag(file: File, tagName: string): Promise<ArrayBuffer> {
  initialize()
  logger.debug('Clearing EXIF tag:', tagName, 'from file:', file.name)

  try {
    const result = await writeMetadata(file, { [tagName]: '' }) as { success: boolean; data: ArrayBuffer; error?: string }
    logger.debug('clearTag result:', result)
    if (result.success && result.data) {
      return result.data
    }
    throw new Error(result.error || 'Failed to clear tag')
  } catch (error) {
    logger.error('Failed to clear tag:', error)
    throw createError(ErrorCode.ERR_WRITE, `Failed to clear tag: ${error}`)
  }
}
