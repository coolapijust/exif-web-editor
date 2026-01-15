<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from '@/i18n'
import zhTags from '@/data/exif-tags-zh.json'

const props = defineProps<{
  open: boolean
  tagName: string
  currentValue: unknown
}>()

const emit = defineEmits<{
  close: []
  save: [tagName: string, value: string]
}>()

const { t, locale } = useI18n()

const inputValue = ref('')
const error = ref<string | null>(null)

const displayTagName = computed(() => {
  if (locale.value === 'zh-CN' && zhTags[props.tagName as keyof typeof zhTags]) {
    return zhTags[props.tagName as keyof typeof zhTags]
  }
  return t(`info.tags.${props.tagName}`) || props.tagName
})

const isArrayValue = computed(() => Array.isArray(props.currentValue))

watch(() => [props.open, props.currentValue], ([isOpen, currentValue]) => {
  if (isOpen) {
    if (Array.isArray(currentValue)) {
      inputValue.value = currentValue.join(', ')
    } else {
      inputValue.value = String(currentValue ?? '')
    }
    error.value = null
  }
}, { immediate: true })

function handleSave(): void {
  if (!inputValue.value.trim()) {
    error.value = t('editor.valueRequired')
    return
  }

  let finalValue: string | string[]
  if (inputValue.value.includes(',')) {
    finalValue = inputValue.value.split(',').map(v => v.trim()).filter(v => v)
  } else {
    finalValue = inputValue.value.trim()
  }

  emit('save', props.tagName, finalValue as string)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="emit('close')"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          leave-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="open"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4"
          >
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t('editor.editTag') }}
              </h3>
            </div>

            <div class="p-6">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ displayTagName }}
                </label>
                <input
                  v-model="inputValue"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="t('editor.enterValue')"
                  @keyup.enter="handleSave"
                />
                <p v-if="isArrayValue" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ t('editor.arrayHint') }}
                </p>
              </div>

              <p v-if="error" class="text-sm text-red-600 dark:text-red-400 mb-4">
                {{ error }}
              </p>
            </div>

            <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                @click="emit('close')"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {{ t('common.cancel') }}
              </button>
              <button
                @click="handleSave"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {{ t('common.save') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
