<script setup lang="ts">
import { useI18n } from '@/i18n'

const props = defineProps<{
  name: string
  tags: Record<string, unknown>
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
  return t(`info.tags.${key}`) || key
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
        class="flex items-start justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
      >
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ getTagLabel(key) }}
        </span>
        <span class="text-sm font-mono text-gray-900 dark:text-white ml-4 break-all">
          {{ formatValue(value) }}
        </span>
      </div>
    </div>
  </div>
</template>
