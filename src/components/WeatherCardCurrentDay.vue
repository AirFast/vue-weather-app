<script setup lang="ts">
import { useFetchWeather } from '~/composables'

const { isFetching, error, data } = useFetchWeather(import.meta.env.VITE_WEATHER_DAY_API_URL)

console.log(isFetching, error, data)
</script>

<template>
  <article>
    <span>November 21, 2023</span>
    <h2>Lviv, Ukraine</h2>
  </article>
</template>
