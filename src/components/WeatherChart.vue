<script setup lang="ts">
import { ref, onMounted, Ref, watch } from 'vue'
import Chart, { ChartOptions, ChartData } from 'chart.js/auto'

import { useTheme } from '~/composables'

const { chartLabels, chartData } = defineProps<{
  chartLabels: string[]
  chartData: number[]
}>()

const LIGHT_COLOR = '#fff'
const ACTIVE_COLOR = '#4ade80'
const DARK_COLOR = '#0f172e'
const DARK_GRAY_COLOR = '#334155'
const GRAY_COLOR = '#f8fafc'

const { isDark } = useTheme()

let ChartInstance: Chart | null = null
const lineChart: Ref<HTMLCanvasElement | undefined> = ref()
const context: Ref<CanvasRenderingContext2D | undefined> = ref()

const data: ChartData = {
  labels: chartLabels,
  datasets: [
    {
      label: 'My Dataset',
      borderColor: ACTIVE_COLOR,
      borderWidth: 2,
      data: chartData,
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
    data,
    options,
  })
}

const updateChart = () => {
  if (ChartInstance) {
    ChartInstance.data.datasets = data.datasets.map((item) => ({
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
  () => isDark.value,
  () => {
    updateChart()
  }
)
</script>

<template>
  <canvas ref="lineChart" class="canvas" height="500"></canvas>
</template>

<style scoped>
.canvas {
  margin-left: -25px;
}
</style>
