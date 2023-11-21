import { createI18n } from 'vue-i18n'
import { useUserStorage } from '~/composables'

import { en, uk } from '~/locales'

const userStorage = useUserStorage()

export const i18n = createI18n({
  legacy: false,
  locale: userStorage.value.lang,
  messages: {
    en,
    uk,
  },
})
