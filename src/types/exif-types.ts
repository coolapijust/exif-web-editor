export interface ExifData {
  fileName: string
  fileSize: number
  mimeType: string
  width?: number
  height?: number
  make?: string
  model?: string
  dateTime?: string
  gpsLatitude?: number
  gpsLongitude?: number
  [key: string]: unknown
}

export interface ExifTag {
  name: string
  value: unknown
  type: string
  group: string
}

export interface ExifGroup {
  name: string
  tags: ExifTag[]
}

export interface EditingTag {
  originalName: string
  currentName: string
  value: unknown
}

export interface ClearOptions {
  removeAll?: boolean
  tags?: string[]
}

export interface WriteOptions {
  overwriteOriginal?: boolean
  backup?: boolean
}
