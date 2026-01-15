import { format, parseISO } from 'date-fns'

export function formatDate(dateString: string, formatStr: string = 'yyyy-MM-dd HH:mm:ss'): string {
  try {
    const date = parseISO(dateString)
    return format(date, formatStr)
  } catch {
    return dateString
  }
}

export function formatDateTime(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}

export function formatExifDate(exifDate: string): string {
  const match = exifDate.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/)
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]} ${match[4]}:${match[5]}:${match[6]}`
  }
  return exifDate
}
