<script setup lang="ts">
import { ref, onMounted, Ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { addDays, format, parseISO, isAfter, addHours, getHours } from 'date-fns'
import Chart, { ChartOptions, ChartData } from 'chart.js/auto'

import { useFetchWeather, useTheme } from '~/composables'
import { WeatherForecastData } from '~/types'
import { toCelsius } from '~/helpers'

const props = defineProps<{
  isTodayWeatherView: boolean
}>()

const { t } = useI18n()

const { data } = useFetchWeather(import.meta.env.VITE_WEATHER_WEEK_API_URL)

const weatherData = computed(() => {
  const weatherData: WeatherForecastData = JSON.parse(data.value as string)
  const startTime = parseISO(weatherData?.list[0]?.dt_txt as string)
  const endTime = addDays(addHours(startTime, 6), 1)
  const hourForComparison = getHours(startTime)

  if (props.isTodayWeatherView) {
    return weatherData?.list
      .filter((item) => isAfter(parseISO(item.dt_txt), startTime) && isAfter(endTime, parseISO(item.dt_txt)))
      .map((item) => ({
        data: Number(toCelsius(item.main.temp).toFixed(0)),
        labels: format(parseISO(item.dt_txt), 'eee, dd / HH:mm'),
      }))
  } else {
    return weatherData?.list
      .filter((item) => hourForComparison === getHours(parseISO(item.dt_txt)))
      .map((item) => ({
        data: Number(toCelsius(item.main.temp).toFixed(0)),
        labels: format(parseISO(item.dt_txt), 'MMMM, dd'),
      }))
  }
})

const LIGHT_COLOR = '#fff'
const ACTIVE_COLOR = '#4ade80'
const DARK_COLOR = '#0f172e'
const DARK_GRAY_COLOR = '#334155'
const GRAY_COLOR = '#f8fafc'

const { isDark } = useTheme()

let ChartInstance: Chart | null = null
const lineChart: Ref<HTMLCanvasElement | undefined> = ref()
const context: Ref<CanvasRenderingContext2D | undefined> = ref()

const chartData: ChartData = {
  labels: [],
  datasets: [
    {
      label: '',
      borderColor: ACTIVE_COLOR,
      borderWidth: 2,
      data: [],
      pointBackgroundColor: ACTIVE_COLOR,
      fill: true,
      backgroundColor: isDark.value ? DARK_GRAY_COLOR : GRAY_COLOR,
    },
  ],
}

const options: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: isDark.value ? LIGHT_COLOR : DARK_COLOR,
      },
      border: {
        width: 2,
        color: GRAY_COLOR,
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {},
      border: {
        width: 2,
        color: GRAY_COLOR,
      },
      title: {
        display: true,
        text: 'Degrees Celsius, °C',
      },
    },
  },
}

const render = () => {
  if (!context.value) {
    return
  }

  const ctx = context.value

  ChartInstance = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options,
  })
}

const updateChartData = () => {
  if (ChartInstance) {
    ChartInstance.data.labels = weatherData.value?.map(({ labels }) => labels)
    ChartInstance.data.datasets = ChartInstance.data.datasets.map((item) => ({
      ...item,
      label: props.isTodayWeatherView ? t('today') : t('next5Days'),
      data: weatherData.value?.map(({ data }) => data),
    }))

    ChartInstance.update()
  }
}

const updateChart = () => {
  if (ChartInstance) {
    ChartInstance.data.datasets = chartData.datasets.map((item) => ({
      ...item,
      backgroundColor: isDark.value ? DARK_GRAY_COLOR : GRAY_COLOR,
    }))

    ChartInstance.options.scales = {
      x: {
        ...ChartInstance.options.scales?.x,
        ticks: {
          color: isDark.value ? LIGHT_COLOR : DARK_COLOR,
        },
      },
      y: {
        ...ChartInstance.options.scales?.y,
        ticks: {
          color: isDark.value ? LIGHT_COLOR : DARK_COLOR,
        },
      },
    }

    ChartInstance.update()
  }
}

onMounted(() => {
  context.value = lineChart.value?.getContext('2d') || undefined
  render()
})

watch(
  () => weatherData.value,
  () => {
    updateChartData()
  }
)

watch(
  () => isDark.value,
  () => {
    updateChart()
  }
)
</script>

<template>
  <canvas ref="lineChart" class="canvas" height="300"></canvas>
</template>

<style scoped>
.canvas {
  margin-left: -55px;
}
</style>
