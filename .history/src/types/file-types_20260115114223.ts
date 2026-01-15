export interface FileItem {
  id: string
  file: File
  name: string
  size: number
  type: string
  preview?: string
  exifData?: ExifData
}

export interface FileResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface FormatInfo {
  mimeType: string
  extension: string
  supported: boolean
}
