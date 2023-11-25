<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fromUnixTime } from 'date-fns'
import { XMarkIcon } from '@heroicons/vue/24/solid'

import { Loader, WeatherCard, Modal } from '~/components'

import { useFetchWeather, useUserStorage } from '~/composables'
import { WeatherDayData } from '~/types'
import { useRouter } from 'vue-router'

const { city } = defineProps<{
  city: string
}>()

const { push } = useRouter()
const { t } = useI18n()
const userStorage = useUserStorage()

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const onFavoriteItem = () => {
  userStorage.value.city = weatherData.value.name
  userStorage.value.countryCode = weatherData.value.sys.country
  push({ name: 'home' })
}

const removeFavoriteItem = () => {
  userStorage.value.favorites = userStorage.value.favorites.filter((item) => item !== weatherData.value.name)
}

const { data } = useFetchWeather(import.meta.env.VITE_WEATHER_DAY_API_URL, city)
const weatherData = computed<WeatherDayData>(() => JSON.parse(data.value as string))
</script>

<template>
  <div class="item">
    <div v-if="weatherData">
      <div class="favorite-header">
        <h4>{{ weatherData.name }}, {{ weatherData.sys.country }}</h4>

        <div>
          <button class="remove-btn" @click="openModal">
            <XMarkIcon />
          </button>
        </div>
      </div>

      <WeatherCard
        class="favorite-card"
        :class="{ 'is-active': userStorage.city === weatherData.name }"
        @click="onFavoriteItem"
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

      <Teleport to="body">
        <Modal :isOpen="isModalOpen" @close="closeModal" name="first-modal">
          <template #header>
            {{ t('note') }}
          </template>
          <template #content>
            <p>{{ t('favoritesRemove') }}</p>
          </template>
          <template #footer>
            <div class="modal-btn-group">
              <button @click="removeFavoriteItem">{{ t('yes') }}</button>
              <button @click="closeModal">{{ t('no') }}</button>
            </div>
          </template>
        </Modal>
      </Teleport>
    </div>
    <Loader v-else />
  </div>
</template>

<style scoped>
.favorite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.favorite-header h4 {
  margin-left: 28px;
}

.favorite-card {
  position: relative;
  cursor: pointer;
}

.favorite-card::after {
  content: '';
  position: absolute;
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  left: 0;
  top: 0;
  border: 2px solid transparent;
  border-radius: 14px;
  transition: all 0.2s ease-in-out;
}

.favorite-card.is-active::after,
.favorite-card:hover::after {
  border-color: var(--main-active-color);
}

.remove-btn {
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 100%;
}

.modal-btn-group {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.modal-btn-group button {
  font-weight: 600;
}
</style>
