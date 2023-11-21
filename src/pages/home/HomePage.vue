<script setup lang="ts">
import { ref } from 'vue'
import { WeatherCardCurrentDay } from '~/components';

// import { useFetch } from '@vueuse/core'

// 188.163.113.182
// const { isFetching, error, data } = await useFetch('https://ipinfo.io/ip')
// const { isFetching, error, data } = await useFetch('http://ip-api.com/json/188.163.113.182')

// console.log(data.value)
const isDayWeatherView = ref(true)

const setDayWeatherView = () => (isDayWeatherView.value = true)
const setWeekWeatherView = () => (isDayWeatherView.value = false)
</script>

<template>
  <section>
    <div class="weather-view-switcher">
      <button :class="{ 'is-active': isDayWeatherView }" @click="setDayWeatherView">Day</button>
      <button :class="{ 'is-active': !isDayWeatherView }" @click="setWeekWeatherView">Week</button>
    </div>
  </section>

  <section>
    <WeatherCardCurrentDay />
  </section>
</template>

<style scoped>
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
