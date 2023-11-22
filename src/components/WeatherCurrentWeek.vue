<script setup lang="ts">
import { computed } from 'vue'
import { addDays, startOfDay, addHours, format } from 'date-fns'

import { WeatherForecastData } from '~/types'
import { useFetchWeather } from '~/composables'
import { toUpperCaseFirst } from '~/helpers'

const { data } = useFetchWeather(import.meta.env.VITE_WEATHER_WEEK_API_URL)
const weatherData = computed<WeatherForecastData | {}>(() => {
  if (data.value) {
    const weatherData: WeatherForecastData = JSON.parse(data.value as string)
    const dateForComparison = weatherData.list.at(0)?.dt_txt

    const startDate = new Date(dateForComparison as string)
    const datesForComparison = Array.from({ length: 5 }, (_, index) => {
      const nextDate = addDays(startOfDay(startDate), index)
      const nextDateWithSameHour = addHours(nextDate, startDate.getHours())
      return format(nextDateWithSameHour, 'yyyy-MM-dd HH:mm:ss')
    })

    const weatherDataList = weatherData.list.filter((item) => datesForComparison.includes(item.dt_txt))

    return {
      ...weatherData,
      list: weatherDataList,
    }
  } else {
    return {}
  }
})

const weatherDataList = computed(() => (weatherData.value as WeatherForecastData).list)
</script>

<template>
  <div v-if="weatherDataList" class="weather-list container">
    <div class="item" v-for="item in weatherDataList" :key="item.dt">
      <article class="weather-card">
        <div class="weather-icon">
          <span>{{ format(new Date(item.dt_txt), 'PP') }}</span>
          <img
            :src="`https://openweathermap.org/img/wn/${item.weather.at(0)?.icon}@2x.png`"
            :alt="item.weather.at(0)?.main"
          />
          <span class="description">{{ toUpperCaseFirst(item.weather.at(0)?.description as string) }}</span>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.weather-list {
  align-items: normal !important;
}

.weather-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.weather-card {
  padding: 28px 30px;
  background: var(--main-gray-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}
</style>
