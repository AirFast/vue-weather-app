import { RemovableRef, useStorage } from '@vueuse/core'

type UserStorage = {
  city: string
  countryCode: string
  lang: string
}

export const useUserStorage = () => {
  const user: RemovableRef<UserStorage> = useStorage('user', {
    city: '',
    countryCode: '',
    lang: 'uk',
  })

  return user
}
