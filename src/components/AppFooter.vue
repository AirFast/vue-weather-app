<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useTheme, useUserStorage } from '~/composables'
import { LanguageIcon } from '@heroicons/vue/24/outline'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/solid'

const { locale, availableLocales, t } = useI18n()
const userStorage = useUserStorage()
const { isDark, toggleDark } = useTheme()

const year = new Date().getFullYear()

const nextLangCode = computed(() => {
  userStorage.value.lang = locale.value
  document.documentElement.setAttribute('lang', locale.value)

  return availableLocales[
    availableLocales.indexOf(locale.value) + 1 === availableLocales.length
      ? 0
      : availableLocales.indexOf(locale.value) + 1
  ]
})

const toggleLang = () => {
  locale.value = nextLangCode.value
}
</script>

<template>
  <footer class="app-footer">
    <p class="copyright">&copy; The Weather App, {{ year }}</p>
    <div class="switchers-group">
      <span class="language-name">{{ t(locale) }}</span>
      <div class="buttons-group">
        <button class="language-switcher" @click="toggleLang" :title="`${t('switchTo')} ${t(nextLangCode)}`">
          <LanguageIcon />
        </button>
        <button
          class="theme-switcher"
          @click="toggleDark()"
          :title="`${$t('switchTo')} ${isDark ? $t('lightMode') : $t('darkMode')}`"
        >
          <MoonIcon v-if="!isDark" />
          <SunIcon v-else />
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.copyright {
  font-size: 12px;
}

.switchers-group,
.buttons-group {
  display: flex;
  align-items: center;
  gap: 20px;
}

.language-name {
  font-size: 14px;
  font-weight: 500;
}

.language-switcher,
.theme-switcher {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 100%;
}

@media screen and (max-width: 600px) {
  .app-footer {
    flex-direction: column-reverse;
    gap: 20px;
  }

  .switchers-group {
    flex-direction: column;
  }
}
</style>
