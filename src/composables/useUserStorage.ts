import { RemovableRef, useStorage } from '@vueuse/core'

type HistoryData = {
  city: string
  countryCode: string
}

type UserStorage = {
  city: string
  countryCode: string
  favorites: string[]
  searchHistory: HistoryData[]
  lang: string
}

export const useUserStorage = () => {
  const user: RemovableRef<UserStorage> = useStorage('user', {
    city: '',
    countryCode: '',
    favorites: [],
    searchHistory: [],
    lang: 'uk',
  })

  return user
}
