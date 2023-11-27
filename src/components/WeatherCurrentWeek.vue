<script setup lang="ts">
import { computed } from 'vue'
import { parseISO, getHours } from 'date-fns'

import { WeatherForecastData } from '~/types'
import { useFetchWeather } from '~/composables'

import { WeatherCard } from '.'

const { data } = await useFetchWeather(import.meta.env.VITE_WEATHER_WEEK_API_URL).json<WeatherForecastData>()

const weatherDataList = computed(() => {
  const weatherDataList = data.value?.list
  const startTime = parseISO(weatherDataList?.at(0)?.dt_txt as string)
  const hourForComparison = getHours(startTime)

  return weatherDataList?.filter((item) => hourForComparison === getHours(parseISO(item.dt_txt)))
})
</script>

<template>
  <div class="weather-list container">
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
</template>

<style scoped>
.weather-list {
  align-items: normal !important;
}
</style>
