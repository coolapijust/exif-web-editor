export function truncate(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength) + '...'
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function slugToTitle(slug: string): string {
  return slug
    .split(/[_-]/)
    .map(word => capitalizeFirst(word))
    .join(' ')
}

export function formatTagName(name: string): string {
  const displayNames: Record<string, string> = {
    Make: 'Camera Make',
    Model: 'Camera Model',
    DateTime: 'Date Taken',
    GPSLatitude: 'GPS Latitude',
    GPSLongitude: 'GPS Longitude',
    ExposureTime: 'Exposure Time',
    FNumber: 'F-Number',
    ISOSpeedRatings: 'ISO',
    FocalLength: 'Focal Length',
    ImageWidth: 'Width',
    ImageHeight: 'Height',
    Orientation: 'Orientation'
  }
  return displayNames[name] || slugToTitle(name)
}

export function parseFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
