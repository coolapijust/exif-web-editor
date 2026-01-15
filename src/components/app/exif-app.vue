<script setup lang="ts">
import { onMounted } from 'vue'
import { useUI, useI18n } from '@/composables'
import AppHeader from './app-header.vue'
import AppFooter from './app-footer.vue'

const { initTheme } = useUI()
const { initLocale } = useI18n()

onMounted(() => {
  initTheme()
  initLocale()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    <main class="flex-1 container mx-auto px-4 py-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
