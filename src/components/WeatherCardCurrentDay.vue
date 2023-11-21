<script setup lang="ts">
import { computed } from 'vue'
import { format, fromUnixTime } from 'date-fns'

import { WeatherDayData } from '~/types'
import { useFetchWeather } from '~/composables'
import { toCelsius } from '~/helpers'

const { data } = useFetchWeather(import.meta.env.VITE_WEATHER_DAY_API_URL)
const weatherData = computed<WeatherDayData>(() => JSON.parse(data.value as string))
</script>

<template>
  <article v-if="weatherData">
    <span>{{ format(fromUnixTime(weatherData.dt), 'PPPP') }}</span>
    <h2>
      {{ weatherData.name }}, {{ weatherData.sys.country }}, {{ toCelsius(weatherData.main.temp).toFixed(0) }}
      <span>&deg;C</span>
    </h2>
    <img
      :src="`https://openweathermap.org/img/wn/${weatherData.weather.at(0)?.icon}@4x.png`"
      :alt="weatherData.weather.at(0)?.main"
    />
  </article>
</template>
