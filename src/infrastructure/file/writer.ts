export function writeAsBlob(data: ArrayBuffer, mimeType: string): Blob {
  return new Blob([data], { type: mimeType })
}

export function createDownloadLink(blob: Blob, fileName: string): string {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return url
}
