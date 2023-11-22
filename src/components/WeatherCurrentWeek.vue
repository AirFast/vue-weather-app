<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { addDays, startOfDay, addHours, format } from 'date-fns'

import { WeatherForecastData } from '~/types'
import { useFetchWeather } from '~/composables'
import { toUpperCaseFirst, toCelsius } from '~/helpers'

import { Loader } from '.'

const { t } = useI18n()

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
          <span class="date">{{ format(new Date(item.dt_txt), 'EEEE, PP') }}</span>
          <img
            :src="`https://openweathermap.org/img/wn/${item.weather.at(0)?.icon}@2x.png`"
            :alt="item.weather.at(0)?.main"
          />
          <span class="description">{{ toUpperCaseFirst(item.weather.at(0)?.description as string) }}</span>
        </div>

        <div class="temperature">
          <span class="current">
            {{ toCelsius(item.main.temp).toFixed(0) }}
            <span>&deg;C</span>
          </span>
          <span class="feels-like">
            {{ t('feelsLike') }}:
            {{ toCelsius(item.main.feels_like).toFixed(0) }}
            <span>&deg;C</span>
          </span>
        </div>

        <div class="item weather-lists">
          <ul class="weather-data-list">
            <li>
              <span class="list-item-description">{{ t('minT') }}:</span>
              {{ toCelsius(item.main.temp_min).toFixed(0) }}
              <span>&deg;C</span>
            </li>
            <li>
              <span class="list-item-description">{{ t('maxT') }}:</span>
              {{ toCelsius(item.main.temp_max).toFixed(0) }}
              <span>&deg;C</span>
            </li>
            <li>
              <span class="list-item-description">{{ t('cloudiness') }}:</span>
              {{ item.clouds.all }} %
            </li>
            <li>
              <span class="list-item-description">{{ t('visibility') }}:</span>
              {{ item.visibility / 1000 }}
              {{ t('km') }}
            </li>
            <li>
              <span class="list-item-description">{{ t('wind') }}:</span>
              {{ item.wind.speed }}
              {{ t('ms') }}
            </li>
            <li>
              <span class="list-item-description">{{ t('humidity') }}:</span>
              {{ item.main.humidity }} %
            </li>
            <li>
              <span class="list-item-description">{{ t('pressure') }}:</span>
              {{ item.main.pressure }}
              {{ t('hPa') }}
            </li>
          </ul>
        </div>
      </article>
    </div>
  </div>
  <Loader v-else />
</template>

<style scoped>
.weather-list {
  align-items: normal !important;
}

.date {
  font-size: 14px;
  font-weight: 600;
}

.weather-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.weather-card {
  padding: 28px;
  background: var(--main-gray-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.temperature {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.temperature .current {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
}

.temperature .feels-like {
  font-weight: 600;
}

.weather-data-list {
  font-size: 14px;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: auto;
}

.list-item-description {
  font-weight: 600;
  margin-right: 8px;
}
</style>
