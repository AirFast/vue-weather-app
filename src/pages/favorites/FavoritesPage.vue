<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowLongLeftIcon } from '@heroicons/vue/24/outline'

import { WeatherFavoriteItem } from '~/components'
import { useUserStorage } from '~/composables'

const { t } = useI18n()
const userStorage = useUserStorage()
</script>

<template>
  <div class="container">
    <WeatherFavoriteItem
      v-if="userStorage.favorites.length !== 0"
      v-for="city in userStorage.favorites"
      :key="city"
      :city="city"
    />
    <div v-else class="item" :class="{'center': userStorage.favorites.length === 0}">
      <h2>{{ t('noFavorites') }}</h2>
      <RouterLink :to="{ name: 'home' }" class="link">
        <ArrowLongLeftIcon class="icon" />
        {{ t('returnToHome') }}
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.center {
  text-align: center;
}

.link {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.icon {
  width: 24px;
}
</style>
