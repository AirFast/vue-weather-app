<script setup lang="ts">
import { computed } from 'vue'
import { addDays, startOfDay, addHours, format } from 'date-fns'

import { WeatherForecastData } from '~/types'
import { useFetchWeather } from '~/composables'

import { Loader, WeatherCard } from '.'

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
      <WeatherCard
        :dt="new Date(item.dt_txt)"
        :icon="item.weather.at(0)?.icon"
        :description="item.weather.at(0)?.description"
        :temp="item.main.temp"
        :feelsLike="item.main.feels_like"
        :tempMin="item.main.temp_min"
        :tempMax="item.main.temp_max"
        :clouds="item.clouds.all"
        :visibility="item.visibility"
        :windSpeed="item.wind.speed"
        :humidity="item.main.humidity"
        :pressure="item.main.pressure"
      />
    </div>
  </div>
  <Loader v-else />
</template>

<style scoped>
.weather-list {
  align-items: normal !important;
}
</style>
