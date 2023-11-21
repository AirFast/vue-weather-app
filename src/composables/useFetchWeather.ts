import { computed } from 'vue'

import { useFetch } from '@vueuse/core'
import { useUserStorage } from '~/composables'

const userStorage = useUserStorage()

export const useFetchWeather = <T>(baseUrl: string) => {
  const url = computed(
    () =>
      `${baseUrl}?appid=${import.meta.env.VITE_WEATHER_API_KEY}&q=${userStorage.value.city}&lang=${
        userStorage.value.lang
      }`
  )

  return useFetch<T>(url, { refetch: true })
}
