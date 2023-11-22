<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, addDays } from 'date-fns'

import { useUserStorage } from '~/composables'
import { setDefaultGeolocationData } from '~/helpers'

import { WeatherCardCurrentDay, WeatherCurrentWeek } from '~/components'

const { t } = useI18n()

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
  const todayFormatted = format(today, 'MMMM dd, yyyy')

  if (isTodayWeatherView.value) {
    return todayFormatted
  }

  return `${todayFormatted} - ${format(addDays(today, 4), 'MMMM dd, yyyy')}`
})

const setDayWeatherView = () => (isTodayWeatherView.value = true)
const setWeekWeatherView = () => (isTodayWeatherView.value = false)
</script>

<template>
  <section class="main-data">
    <article>
      <span class="period">{{ period }}</span>
      <h2>{{ userStorage.city }}, {{ userStorage.countryCode }}</h2>
    </article>
    <div class="weather-view-switcher">
      <button :class="{ 'is-active': isTodayWeatherView }" @click="setDayWeatherView">{{ t('today') }}</button>
      <button :class="{ 'is-active': !isTodayWeatherView }" @click="setWeekWeatherView">{{ t('next5Days') }}</button>
    </div>
  </section>

  <section class="weather-data">
    <WeatherCardCurrentDay v-if="isTodayWeatherView" />
    <WeatherCurrentWeek v-else />
  </section>
</template>

<style scoped>
.main-data {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
}

.period {
  font-size: 14px;
  font-weight: 600;
}

.main-data h2 {
  margin-bottom: 0;
}

.weather-view-switcher {
  display: flex;
  gap: 10px;
}

.weather-view-switcher button {
  font-weight: 600;
  padding: 14px 28px;
  text-transform: uppercase;
}

.weather-data .container {
  align-items: center;
}

@media screen and (max-width: 992px) {
  .weather-data .container {
    flex-direction: column;
    align-items: start;
  }
}

@media screen and (max-width: 600px) {
  .main-data {
    flex-direction: column;
    align-items: start;
  }
}
</style>
