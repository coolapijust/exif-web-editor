import { loadWasm } from './loader'
import { logger } from '@/infrastructure/logger'
import { createError, ErrorCode } from '@/infrastructure/error'

let instance: unknown = null
let initialized = false

export async function initialize(): Promise<void> {
  if (initialized) {
    return
  }
  try {
    const wasmBuffer = await loadWasm()
    instance = await initExifTool(wasmBuffer)
    initialized = true
    logger.info('ExifTool initialized successfully')
  } catch (error) {
    throw createError(
      ErrorCode.ERR_WASM_INIT,
      'Failed to initialize ExifTool',
      error
    )
  }
}

async function initExifTool(buffer: ArrayBuffer): Promise<unknown> {
  return {}
}

export function getInstance(): unknown {
  return instance
}
