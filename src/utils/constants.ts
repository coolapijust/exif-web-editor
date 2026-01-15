export const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/tiff'] as const

export const EXIF_GROUPS = {
  IMAGE: 'Image',
  PHOTO: 'Photo',
  GPS: 'GPS',
  INTEROP: 'Interoperability',
  OTHER: 'Other'
} as const

export const COMMON_TAGS = [
  'Make',
  'Model',
  'DateTime',
  'ExposureTime',
  'FNumber',
  'ISOSpeedRatings',
  'FocalLength',
  'ImageWidth',
  'ImageHeight',
  'GPSLatitude',
  'GPSLongitude',
  'Software',
  'Orientation'
] as const

export const MAX_FILE_SIZE = 100 * 1024 * 1024

export const DEFAULT_THEME = 'light' as const
export const DEFAULT_PAGE_SIZE = 20 as const
