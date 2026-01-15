import { ref, computed } from 'vue'
import { useUIStore } from '@/stores'
import type { Theme, Notification, DialogState } from '@/types'

export function useUI() {
  const uiStore = useUIStore()
  const sidebarOpen = ref(true)

  const theme = computed(() => uiStore.theme)
  const notification = computed(() => uiStore.notification)
  const dialog = computed(() => uiStore.dialog)
  const isDarkMode = computed(() => theme.value === 'dark')

  function toggleTheme(): void {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    uiStore.setTheme(newTheme)
  }

  function setTheme(theme: Theme): void {
    uiStore.setTheme(theme)
  }

  function showSuccess(message: string, duration?: number): void {
    uiStore.showNotification({
      id: Date.now().toString(),
      type: 'success',
      message,
      duration: duration || 3000
    })
  }

  function showError(message: string, duration?: number): void {
    uiStore.showNotification({
      id: Date.now().toString(),
      type: 'error',
      message,
      duration: duration || 5000
    })
  }

  function showWarning(message: string, duration?: number): void {
    uiStore.showNotification({
      id: Date.now().toString(),
      type: 'warning',
      message,
      duration: duration || 4000
    })
  }

  function showInfo(message: string, duration?: number): void {
    uiStore.showNotification({
      id: Date.now().toString(),
      type: 'info',
      message,
      duration: duration || 3000
    })
  }

  function clearNotification(): void {
    uiStore.clearNotification()
  }

  function openEditDialog(fileId?: string): void {
    uiStore.openDialog('edit', fileId)
  }

  function openBatchDialog(): void {
    uiStore.openDialog('batch')
  }

  function closeDialog(): void {
    uiStore.closeDialog()
  }

  function toggleSidebar(): void {
    sidebarOpen.value = !sidebarOpen.value
  }

  function initTheme(): void {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null
      if (savedTheme) {
        uiStore.setTheme(savedTheme)
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        uiStore.setTheme('dark')
      }
    }
  }

  return {
    sidebarOpen,
    theme,
    notification,
    dialog,
    isDarkMode,
    toggleTheme,
    setTheme,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearNotification,
    openEditDialog,
    openBatchDialog,
    closeDialog,
    toggleSidebar,
    initTheme
  }
}
