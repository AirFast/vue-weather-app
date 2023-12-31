import { computed } from 'vue'
import { useFetch } from '@vueuse/core'
import { useUserStorage } from '~/composables'
import { GeolocationData } from '~/types'

const userStorage = useUserStorage()

export const setDefaultGeolocationData = async () => {
  const { data: ip } = await useFetch('https://ipinfo.io/ip')
  const { data } = await useFetch(`https://ipinfo.io/${ip.value}?token=${import.meta.env.VITE_IP_INFO_TOKEN}`)

  const geolocationData = computed<GeolocationData>(() => JSON.parse(data.value as string))

  userStorage.value.city = geolocationData.value.city
  userStorage.value.countryCode = geolocationData.value.country
}
