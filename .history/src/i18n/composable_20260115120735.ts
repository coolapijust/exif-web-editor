import { ref, computed, watch } from 'vue'
import { translations, getNestedValue, type Locale } from './locales'

const currentLocale = ref<Locale>('zh-CN')

export function useI18n() {
  const locale = computed(() => currentLocale.value)
  const t = computed(() => {
    const langData = translations[currentLocale.value]
    return (key: string): string => {
      return getNestedValue(langData as Record<string, unknown>, key)
    }
  })

  function setLocale(newLocale: Locale): void {
    currentLocale.value = newLocale
    localStorage.setItem('locale', newLocale)
    document.documentElement.lang = newLocale
  }

  function toggleLocale(): void {
    const newLocale = currentLocale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
    setLocale(newLocale)
  }

  function initLocale(): void {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale | null
      if (savedLocale && translations[savedLocale]) {
        setLocale(savedLocale)
      } else {
        const browserLang = navigator.language
        if (browserLang.startsWith('zh')) {
          setLocale('zh-CN')
        } else {
          setLocale('en-US')
        }
      }
    }
  }

  return {
    locale,
    t,
    setLocale,
    toggleLocale,
    initLocale
  }
}
