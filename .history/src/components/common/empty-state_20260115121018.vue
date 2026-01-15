<script setup lang="ts">
import { useI18n } from '@/i18n'

const { t } = useI18n()

defineProps<{
  icon?: string
  title?: string
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div v-if="icon" class="text-6xl mb-4">
      {{ icon }}
    </div>
    <div v-else class="text-6xl mb-4">
      <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    <h3 v-if="title" class="text-lg font-medium text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>
    <p v-else class="text-lg font-medium text-gray-900 dark:text-white mb-2">
      {{ t('upload.title') }}
    </p>
    <p v-if="message" class="text-sm text-gray-500 dark:text-gray-400">
      {{ message }}
    </p>
    <p v-else class="text-sm text-gray-500 dark:text-gray-400">
      {{ t('upload.subtitle') }}
    </p>
    <slot />
  </div>
</template>
