<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { format, addDays } from 'date-fns'

import { useUserStorage } from '~/composables'
import { setDefaultGeolocationData } from '~/helpers'

import { WeatherCardCurrentDay } from '~/components'

const userStorage = useUserStorage()
const isSetDefaultGeolocationData = computed(
  () => userStorage.value.city === '' && userStorage.value.countryCode === ''
)

onMounted(() => {
  if (isSetDefaultGeolocationData.value) {
    setDefaultGeolocationData()
  }
})

const today = new Date()

const isTodayWeatherView = ref(true)
const period = computed(() => {
  const todayFormatted = format(today, 'PP')

  if (isTodayWeatherView.value) {
    return todayFormatted
  }

  return `${todayFormatted} - ${format(addDays(today, 5), 'PP')}`
})

const setDayWeatherView = () => (isTodayWeatherView.value = true)
const setWeekWeatherView = () => (isTodayWeatherView.value = false)
</script>

<template>
  <section class="main-data">
    <article>
      <span>{{ period }}</span>
      <h2>{{ userStorage.city }}, {{ userStorage.countryCode }}</h2>
    </article>
    <div class="weather-view-switcher">
      <button :class="{ 'is-active': isTodayWeatherView }" @click="setDayWeatherView">Today</button>
      <button :class="{ 'is-active': !isTodayWeatherView }" @click="setWeekWeatherView">The next 5 days</button>
    </div>
  </section>

  <section>
    <WeatherCardCurrentDay />
  </section>
</template>

<style scoped>
.main-data {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.weather-view-switcher {
  display: flex;
  gap: 10px;
}

.weather-view-switcher button {
  font-weight: 600;
  letter-spacing: 1px;
  padding: 14px 28px;
  text-transform: uppercase;
}
</style>
