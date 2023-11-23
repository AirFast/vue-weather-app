<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { fromUnixTime, getHours, getMinutes } from 'date-fns'

import { WeatherDayData } from '~/types'
import { useFetchWeather } from '~/composables'
import { toCelsius, toUpperCaseFirst } from '~/helpers'
import { Loader } from '.'

const { t } = useI18n()

const { data } = useFetchWeather(import.meta.env.VITE_WEATHER_DAY_API_URL)
const weatherData = computed<WeatherDayData>(() => JSON.parse(data.value as string))

const getTimeFromUnix = (value: number) => {
  const time = fromUnixTime(value)
  return `${getHours(time)}:${getMinutes(time)}`
}
</script>

<template>
  <article v-if="weatherData" class="container">
    <div class="item weather-main-data">
      <div class="weather-icon">
        <img
          :src="`https://openweathermap.org/img/wn/${weatherData.weather.at(0)?.icon}@4x.png`"
          :alt="weatherData.weather.at(0)?.description"
        />
        <span class="description">{{ toUpperCaseFirst(weatherData.weather.at(0)?.description as string) }}</span>
      </div>

      <div class="temperature">
        <span class="current">
          {{ toCelsius(weatherData.main.temp).toFixed(0) }}
          <span>&deg;C</span>
        </span>
        <span class="feels-like">
          {{ t('feelsLike') }}:
          {{ toCelsius(weatherData.main.feels_like).toFixed(0) }}
          <span>&deg;C</span>
        </span>
      </div>
    </div>

    <div class="item weather-lists">
      <ul class="weather-data-list">
        <li>
          <span class="list-item-description">{{ t('minT') }}:</span>
          {{ toCelsius(weatherData.main.temp_min).toFixed(0) }}
          <span>&deg;C</span>
        </li>
        <li>
          <span class="list-item-description">{{ t('maxT') }}:</span>
          {{ toCelsius(weatherData.main.temp_max).toFixed(0) }}
          <span>&deg;C</span>
        </li>
        <li>
          <span class="list-item-description">{{ t('cloudiness') }}:</span>
          {{ weatherData.clouds.all }} %
        </li>
      </ul>

      <ul class="weather-data-list">
        <li>
          <span class="list-item-description">{{ t('visibility') }}:</span>
          {{ weatherData.visibility / 1000 }}
          {{ t('km') }}
        </li>
        <li>
          <span class="list-item-description">{{ t('wind') }}:</span>
          {{ weatherData.wind.speed }}
          {{ t('ms') }}
        </li>
        <li>
          <span class="list-item-description">{{ t('humidity') }}:</span>
          {{ weatherData.main.humidity }} %
        </li>
      </ul>

      <ul class="weather-data-list">
        <li>
          <span class="list-item-description">{{ t('pressure') }}:</span>
          {{ weatherData.main.pressure }}
          {{ t('hPa') }}
        </li>
        <li>
          <span class="list-item-description">{{ t('sunrise') }}:</span>
          {{ getTimeFromUnix(weatherData.sys.sunrise) }}
        </li>
        <li>
          <span class="list-item-description">{{ t('sunset') }}:</span>
          {{ getTimeFromUnix(weatherData.sys.sunset) }}
        </li>
      </ul>
    </div>
  </article>
  <Loader v-else />
</template>

<style scoped>
.weather-main-data {
  display: flex;
  align-items: center;
}

.weather-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.temperature {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.temperature .current {
  font-size: 32px;
  font-weight: 600;
}

.temperature .feels-like {
  font-weight: 600;
}

.weather-lists {
  display: flex;
  justify-content: flex-end;
  gap: 30px;
}

.weather-data-list {
  font-size: 14px;
  list-style-type: none;
  padding: 28px 30px;
  background: var(--main-gray-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: auto;
}

.list-item-description {
  font-weight: 600;
  margin-right: 8px;
}

@media screen and (max-width: 992px) {
  .weather-lists {
    justify-content: space-around;
    gap: 20px;
    width: 100%;
  }
}

@media screen and (max-width: 600px) {
  .weather-lists {
    flex-direction: column;
    gap: 0;
  }

  .weather-data-list {
    border-radius: 0;
    padding: 4px 30px;
  }

  .weather-data-list:first-child {
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    padding-top: 28px;
  }

  .weather-data-list:last-child {
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    padding-bottom: 28px;
  }
}
</style>
