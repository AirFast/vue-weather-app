<script setup lang="ts">
import { WeatherFavoriteItem } from '~/components'
import { useUserStorage } from '~/composables'

const userStorage = useUserStorage()
</script>

<template>
  <div class="container">
    <WeatherFavoriteItem v-for="city in userStorage.favorites" :key="city" :city="city" />
  </div>
</template>
