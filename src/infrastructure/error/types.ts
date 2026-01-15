export const ErrorCode = {
  ERR_WASM_INIT: 'ERR_WASM_INIT',
  ERR_FILE_READ: 'ERR_FILE_READ',
  ERR_PARSE: 'ERR_PARSE',
  ERR_VALIDATE: 'ERR_VALIDATE',
  ERR_WRITE: 'ERR_WRITE',
  ERR_FORMAT_UNSUPPORTED: 'ERR_FORMAT_UNSUPPORTED',
  ERR_UNKNOWN: 'ERR_UNKNOWN'
} as const

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode]

export interface ExifError extends Error {
  code: ErrorCode
  details?: unknown
}
