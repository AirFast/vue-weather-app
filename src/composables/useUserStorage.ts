import { RemovableRef, useStorage } from '@vueuse/core'

type UserStorage = {
  city: string
  lang: string
}

export const useUserStorage = () => {
  const user: RemovableRef<UserStorage> = useStorage('user', {
    city: 'Lviv',
    lang: 'uk',
  })

  return user
}
