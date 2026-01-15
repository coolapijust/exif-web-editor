<script setup lang="ts">
import { useI18n } from '@/i18n'
import zhTags from '@/data/exif-tags-zh.json'

const props = defineProps<{
  tags: Record<string, unknown>
  readonlyTags?: Set<string>
}>()

const emit = defineEmits<{
  edit: [key: string, value: unknown]
}>()

const { t, locale } = useI18n()

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
  if (locale.value === 'zh-CN' && zhTags[key as keyof typeof zhTags]) {
    return zhTags[key as keyof typeof zhTags]
  }
  const i18nKey = `info.tags.${key}`
  const i18nLabel = t(i18nKey)
  if (i18nLabel !== i18nKey) {
    return i18nLabel
  }
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').trim()
}

function isEditable(key: string): boolean {
  if (props.readonlyTags) {
    return !props.readonlyTags.has(key)
  }
  return true
}

function handleEdit(key: string, value: unknown): void {
  emit('edit', key, value)
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="(value, key) in tags"
      :key="key"
      class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 rounded px-2 -mx-2 transition-colors"
      :class="isEditable(key) ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''"
      @click="isEditable(key) && handleEdit(key, value)"
    >
      <span class="text-sm text-gray-600 dark:text-gray-400">
        {{ getTagLabel(key) }}
      </span>
      <span class="text-sm font-mono text-gray-900 dark:text-white ml-4 break-all flex-1 text-right">
        {{ formatValue(value) }}
      </span>
      <svg v-if="isEditable(key)" class="w-4 h-4 ml-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </div>
  </div>
</template>
