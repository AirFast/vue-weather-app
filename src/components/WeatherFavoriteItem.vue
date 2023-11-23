<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fromUnixTime } from 'date-fns'

import { Loader, WeatherCard, Modal } from '~/components'

import { useFetchWeather } from '~/composables'
import { WeatherDayData } from '~/types'

const { t } = useI18n()

const { city } = defineProps<{
  city: string
}>()

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const { data } = useFetchWeather(import.meta.env.VITE_WEATHER_DAY_API_URL, city)
const weatherData = computed<WeatherDayData>(() => JSON.parse(data.value as string))
</script>

<template>
  <div class="item">
    <div v-if="weatherData">
      <h3 class="favorite-city">{{ weatherData.name }}, {{ weatherData.sys.country }}</h3>

      <WeatherCard
        :dt="fromUnixTime(weatherData.dt)"
        :icon="weatherData.weather.at(0)?.icon"
        :description="weatherData.weather.at(0)?.description"
        :temp="weatherData.main.temp"
        :feelsLike="weatherData.main.feels_like"
        :tempMin="weatherData.main.temp_min"
        :tempMax="weatherData.main.temp_max"
        :clouds="weatherData.clouds.all"
        :visibility="weatherData.visibility"
        :windSpeed="weatherData.wind.speed"
        :humidity="weatherData.main.humidity"
        :pressure="weatherData.main.pressure"
      />

      <button @click="openModal">Remove</button>

      <Teleport to="body">
        <Modal :isOpen="isModalOpen" @close="closeModal" name="first-modal">
          <template #header>
            {{ t('note') }}
          </template>
          <template #content>
            <p>{{ t('favoritesNote') }}</p>
          </template>
          <template #footer>
            <RouterLink :to="{ name: 'favorites' }">{{ t('viewFavorites') }}</RouterLink>
          </template>
        </Modal>
      </Teleport>
    </div>
    <Loader v-else />
  </div>
</template>

<style scoped>
.item {
  flex: 0 0 auto;
  width: 18.126%;
}

.favorite-city {
  text-align: center;
}
</style>
