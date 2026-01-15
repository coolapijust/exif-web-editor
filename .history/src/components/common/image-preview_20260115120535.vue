<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  src?: string
  alt?: string
  file?: File
}>()

const imageSrc = ref<string>('')
const loading = ref(true)
const error = ref<string | null>(null)

watch(() => props.src, (newSrc) => {
  loadImage(newSrc)
})

watch(() => props.file, async (newFile) => {
  if (newFile) {
    await loadFromFile(newFile)
  }
})

async function loadFromFile(file: File): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageSrc.value = e.target?.result as string
      loading.value = false
    }
    reader.onerror = () => {
      error.value = 'Failed to load image'
      loading.value = false
    }
    reader.readAsDataURL(file)
  } catch (e) {
    error.value = 'Failed to load image'
    loading.value = false
  }
}

function loadImage(src: string | undefined): void {
  if (!src) {
    loading.value = false
    return
  }
  loading.value = true
  error.value = null
  const img = new Image()
  img.onload = () => {
    imageSrc.value = src
    loading.value = false
  }
  img.onerror = () => {
    error.value = 'Failed to load image'
    loading.value = false
  }
  img.src = src
}

const aspectRatio = computed(() => {
  if (imageSrc.value) {
    return 'aspect-video'
  }
  return 'aspect-square'
})
</script>

<template>
  <div
    class="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
    :class="aspectRatio"
  >
    <template v-if="loading">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </template>

    <template v-else-if="error">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-sm text-gray-500">{{ error }}</p>
        </div>
      </div>
    </template>

    <template v-else-if="imageSrc">
      <img
        :src="imageSrc"
        :alt="alt || 'Preview'"
        class="w-full h-full object-contain"
      />
    </template>

    <template v-else>
      <div class="absolute inset-0 flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </template>
  </div>
</template>
