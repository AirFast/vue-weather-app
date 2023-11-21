import { RemovableRef, useStorage } from '@vueuse/core'

type UserStorage = {
  lang: string
}

export const useUserStorage = () => {
  const user: RemovableRef<UserStorage> = useStorage('user', {
    lang: 'uk',
  })

  return user
}
