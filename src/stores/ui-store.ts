import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Theme, Notification, DialogState } from '@/types'

export const useUIStore = defineStore('ui', () => {
  const theme = ref<Theme>('light')
  const dialog = ref<DialogState>({ open: false, type: null })
  const notification = ref<Notification | null>(null)

  function setTheme(newTheme: Theme): void {
    theme.value = newTheme
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  function openDialog(type: DialogState['type'], fileId?: string): void {
    dialog.value = { open: true, type, fileId }
  }

  function closeDialog(): void {
    dialog.value = { open: false, type: null }
  }

  function showNotification(notificationData: Notification): void {
    notification.value = notificationData
    if (notificationData.duration) {
      setTimeout(() => {
        notification.value = null
      }, notificationData.duration)
    }
  }

  function clearNotification(): void {
    notification.value = null
  }

  return {
    theme,
    dialog,
    notification,
    setTheme,
    openDialog,
    closeDialog,
    showNotification,
    clearNotification
  }
})
