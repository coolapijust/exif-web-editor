import type { ErrorCode, ExifError } from './types'

export function createError(code: ErrorCode, message: string, details?: unknown): ExifError {
  const error = new Error(message) as ExifError
  error.code = code
  error.details = details
  return error
}

export function handleError(error: unknown): ExifError {
  if (isExifError(error)) {
    return error
  }
  return createError(
    ErrorCode.ERR_UNKNOWN,
    error instanceof Error ? error.message : 'Unknown error',
    error
  )
}

function isExifError(error: unknown): error is ExifError {
  return error instanceof Error && 'code' in error
}
