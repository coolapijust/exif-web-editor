import { initialize } from './initializer'
import { logger } from '@/infrastructure/logger'
import type { ExifData } from '@/types'

export async function callRead(file: File): Promise<ExifData> {
  await initialize()
  logger.debug('Reading EXIF from file:', file.name)
  return {} as ExifData
}

export async function callWrite(_file: File, _tags: Record<string, unknown>): Promise<ArrayBuffer> {
  await initialize()
  logger.debug('Writing EXIF to file:', _file.name)
  return new ArrayBuffer(0)
}

export async function callClearAll(file: File): Promise<ArrayBuffer> {
  await initialize()
  logger.debug('Clearing all EXIF from file:', file.name)
  return new ArrayBuffer(0)
}

export async function callClearTag(file: File, tagName: string): Promise<ArrayBuffer> {
  await initialize()
  logger.debug('Clearing EXIF tag:', tagName, 'from file:', file.name)
  return new ArrayBuffer(0)
}
