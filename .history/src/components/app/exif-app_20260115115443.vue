<script setup lang="ts">
import { onMounted } from 'vue'
import { useUI } from '@/composables'
import AppHeader from './app-header.vue'
import AppFooter from './app-footer.vue'

const { initTheme } = useUI()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
