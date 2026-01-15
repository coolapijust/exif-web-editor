import { ref, computed } from 'vue'
import { translations, getNestedValue, type Locale, type TranslationDict } from './locales'

const currentLocale = ref<Locale>('zh-CN')

export function useI18n() {
  const locale = computed(() => currentLocale.value)
  
  const t = ((key: string): string) => {
    const langData = translations[currentLocale.value]
    return getNestedValue(langData as Record<string, unknown>, key)
  }

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
