export interface EventMap {
  'file:selected': { fileId: string }
  'file:removed': { fileId: string }
  'file:added': { fileId: string }
  'exif:updated': { fileId: string; tag: string; value: unknown }
  'exif:removed': { fileId: string; tag: string }
  'exif:cleared': { fileId: string }
  'ui:notification': { type: 'success' | 'error' | 'warning' | 'info'; message: string }
  'ui:theme-changed': { theme: 'light' | 'dark' }
  'dialog:opened': { type: string; fileId?: string }
  'dialog:closed': void
}

type EventKey = keyof EventMap
type EventCallback<T> = T extends void ? () => void : (data: T) => void

class EventEmitter {
  private listeners: Map<EventKey, Set<Function>> = new Map()

  on<K extends EventKey>(event: K, callback: EventCallback<EventMap[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
    return () => this.off(event, callback)
  }

  off<K extends EventKey>(event: K, callback: EventCallback<EventMap[K]>): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }

  emit<K extends EventKey>(event: K, data?: EventMap[K]): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          if (data !== undefined) {
            callback(data)
          } else {
            (callback as () => void)()
          }
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error)
        }
      })
    }
  }

  once<K extends EventKey>(event: K, callback: EventCallback<EventMap[K]>): void {
    const wrapper = ((data: EventMap[K]) => {
      callback(data)
      this.off(event, wrapper as EventCallback<EventMap[K]>)
    }) as EventCallback<EventMap[K]>
    this.on(event, wrapper)
  }

  removeAll(event?: EventKey): void {
    if (event) {
      this.listeners.delete(event as EventKey)
    } else {
      this.listeners.clear()
    }
  }
}

export const eventBus = new EventEmitter()
