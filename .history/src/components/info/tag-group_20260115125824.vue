<script setup lang="ts">
import { useI18n } from '@/i18n'

const props = defineProps<{
  name: string
  tags: Record<string, unknown>
}>()

const emit = defineEmits<{
  edit: [key: string, value: unknown]
}>()

const { t } = useI18n()

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (typeof value === 'number') {
    if (value > 1000) {
      return value.toLocaleString()
    }
    return String(value)
  }
  return String(value)
}

function getTagLabel(key: string): string {
  const label = t(`info.tags.${key}`)
  return label !== `info.tags.${key}` ? label : key.replace(/([A-Z])/g, ' $1').trim()
}

function handleEdit(key: string, value: unknown): void {
  emit('edit', key, value)
}
</script>

<template>
  <div class="mb-6">
    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
      {{ name }}
    </h3>
    <div class="space-y-2">
      <div
        v-for="(value, key) in tags"
        :key="key"
        class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded px-2 -mx-2 transition-colors"
        @click="handleEdit(key, value)"
      >
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ getTagLabel(key) }}
        </span>
        <span class="text-sm font-mono text-gray-900 dark:text-white ml-4 break-all flex-1 text-right">
          {{ formatValue(value) }}
        </span>
        <svg class="w-4 h-4 ml-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </div>
    </div>
  </div>
</template>
