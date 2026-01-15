<script setup lang="ts">
import { useI18n } from '@/i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <p>
          {{ t('app.footer.pureFrontend') }}
        </p>
        <p>
          {{ t('app.footer.poweredBy') }}
          <a
            href="https://github.com/uswriting/exiftool"
            target="_blank"
            class="text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            @uswriting/exiftool
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>
