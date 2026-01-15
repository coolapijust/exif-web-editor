export type Theme = 'light' | 'dark'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface DialogState {
  open: boolean
  type: 'edit' | 'batch' | null
  fileId?: string
}

export interface LoadingState {
  loading: boolean
  message?: string
}

export interface PaginationState {
  current: number
  pageSize: number
  total: number
}
