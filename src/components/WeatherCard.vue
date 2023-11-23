<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'

import { toUpperCaseFirst, toCelsius } from '~/helpers'

const { t } = useI18n()

const {
  dt,
  icon,
  description,
  temp,
  feelsLike,
  tempMin,
  tempMax,
  clouds,
  visibility,
  windSpeed,
  humidity,
  pressure,
} = defineProps<{
  dt: Date
  icon?: string
  description?: string
  temp: number
  feelsLike: number
  tempMin: number
  tempMax: number
  clouds: number
  visibility: number
  windSpeed: number
  humidity: number
  pressure: number
}>()
</script>

<template>
  <article class="weather-card">
    <div class="weather-icon">
      <span class="date">{{ format(dt, 'EEEE, PP') }}</span>
      <img :src="`https://openweathermap.org/img/wn/${icon}@2x.png`" :alt="description" />
      <span class="description">{{ toUpperCaseFirst(description as string) }}</span>
    </div>

    <div class="temperature">
      <span class="current">
        {{ toCelsius(temp).toFixed(0) }}
        <span>&deg;C</span>
      </span>
      <span class="feels-like">
        {{ t('feelsLike') }}:
        {{ toCelsius(feelsLike).toFixed(0) }}
        <span>&deg;C</span>
      </span>
    </div>

    <div class="item weather-lists">
      <ul class="weather-data-list">
        <li>
          <span class="list-item-description">{{ t('minT') }}:</span>
          {{ toCelsius(tempMin).toFixed(0) }}
          <span>&deg;C</span>
        </li>
        <li>
          <span class="list-item-description">{{ t('maxT') }}:</span>
          {{ toCelsius(tempMax).toFixed(0) }}
          <span>&deg;C</span>
        </li>
        <li>
          <span class="list-item-description">{{ t('cloudiness') }}:</span>
          {{ clouds }} %
        </li>
        <li>
          <span class="list-item-description">{{ t('visibility') }}:</span>
          {{ visibility / 1000 }}
          {{ t('km') }}
        </li>
        <li>
          <span class="list-item-description">{{ t('wind') }}:</span>
          {{ windSpeed }}
          {{ t('ms') }}
        </li>
        <li>
          <span class="list-item-description">{{ t('humidity') }}:</span>
          {{ humidity }} %
        </li>
        <li>
          <span class="list-item-description">{{ t('pressure') }}:</span>
          {{ pressure }}
          {{ t('hPa') }}
        </li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
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
