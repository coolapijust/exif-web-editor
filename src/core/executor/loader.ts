import { logger } from '@/infrastructure/logger'

const WASM_URL = '/exiftool.wasm'

export async function loadWasm(): Promise<ArrayBuffer> {
  logger.info('Loading WASM...')
  const response = await fetch(WASM_URL)
  if (!response.ok) {
    throw new Error(`Failed to load WASM: ${response.statusText}`)
  }
  const buffer = await response.arrayBuffer()
  logger.info('WASM loaded successfully')
  return buffer
}
