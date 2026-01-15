<script setup lang="ts">
import { useExif, useI18n } from '@/composables'

const { clearAllTags } = useExif()
const { t } = useI18n()

async function handleClearAll(): Promise<void> {
  if (confirm(t('editor.clearAllConfirm'))) {
    await clearAllTags()
  }
}
</script>

<template>
  <button
    @click="handleClearAll"
    class="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
  >
    {{ t('editor.clearAll') }}
  </button>
</template>
