<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useUserStorage } from '~/composables'

import { XMarkIcon } from '@heroicons/vue/24/solid'
import { Modal } from '~/components'

type WeatherFindData = {
  name: string
  sys: { country: string }
}

const { t } = useI18n()
const userStorage = useUserStorage()

const isModalOpen = ref(false)

const isOpenList = ref(false)
const query = ref('')
const cities = ref<WeatherFindData[]>([])

const fetchCities = async () => {
  if (query.value.length < 3) return

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/find?q=${query.value}&type=like&sort=population&cnt=5&appid=${
      import.meta.env.VITE_WEATHER_API_KEY
    }`
  )
  const data = await response.json()

  if (data.cod === 400) {
    return
  }

  const list: WeatherFindData[] = data.list

  isOpenList.value = list.length !== 0
  cities.value = list
}

const onCitySelected = (location: WeatherFindData) => {
  query.value = location.name

  userStorage.value.city = location.name
  userStorage.value.countryCode = location.sys.country

  isOpenList.value = false

  if (userStorage.value.searchHistory.map(({ city }) => city).includes(location.name)) {
    return
  }

  if (userStorage.value.searchHistory.length >= 5) {
    userStorage.value.searchHistory.pop()
  }

  userStorage.value.searchHistory = [
    {
      city: location.name,
      countryCode: location.sys.country,
    },
    ...userStorage.value.searchHistory,
  ]
}

const addToFavorites = () => {
  if (userStorage.value.favorites.length >= 5) {
    openModal()
    query.value = ''
    return
  }

  if (userStorage.value.favorites.includes(query.value)) {
    query.value = ''
    return
  }

  userStorage.value.favorites = [query.value, ...userStorage.value.favorites]
  query.value = ''
}

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const onHistoryItem = ({ city, countryCode }: { city: string; countryCode: string }) => {
  userStorage.value.city = city
  userStorage.value.countryCode = countryCode
  query.value = ''
}

const deleteHistoryItem = (value: string) => {
  userStorage.value.searchHistory = userStorage.value.searchHistory.filter(({ city }) => city !== value)
}
</script>

<template>
  <div class="autocomplete-container">
    <div class="autocomplete">
      <input class="autocomplete-input" v-model="query" @input="fetchCities" :placeholder="t('typeCity')" />
      <span v-if="query" class="clear" @click="() => (query = '')">
        <XMarkIcon />
      </span>
      <ul v-if="isOpenList" class="autocomplete-list">
        <li class="autocomplete-item" v-for="city in cities" @click="onCitySelected(city)">
          {{ city.name }}, {{ city.sys.country }}
        </li>
      </ul>
    </div>

    <button v-if="query" class="favorites-btn" @click="addToFavorites">{{ t('favoritesBtn') }}</button>
  </div>

  <div v-if="userStorage.searchHistory.length !== 0" class="search-history">
    <span class="title">{{ t('searchHistory') }}:</span>
    <div class="history-item" v-for="{ city, countryCode } in userStorage.searchHistory" :key="city">
      <button
        class="history-item"
        :class="{ active: city === userStorage.city }"
        @click="onHistoryItem({ city, countryCode })"
      >
        {{ city }}, {{ countryCode }}
      </button>
      <span class="clear" @click="deleteHistoryItem(city)">
        <XMarkIcon />
      </span>
    </div>
  </div>

  <Teleport to="body">
    <Modal :isOpen="isModalOpen" @close="closeModal" name="first-modal">
      <template #header>
        {{ t('note') }}
      </template>
      <template #content>
        <p>{{ t('favoritesNote') }}</p>
      </template>
      <template #footer>
        <RouterLink :to="{ name: 'favorites' }">{{ t('viewFavorites') }}</RouterLink>
      </template>
    </Modal>
  </Teleport>
</template>

<style scoped>
.autocomplete-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.autocomplete {
  position: relative;
  display: inline-block;
}

.autocomplete .clear {
  position: absolute;
  top: 50%;
  right: 0;
  width: 30px;
  height: 30px;
  padding: 10px;
  transform: translateY(-50%);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.autocomplete .clear:hover {
  color: var(--main-active-color);
}

.autocomplete-input {
  border-radius: 8px;
  font-size: 18px;
  padding: 16px 22px 14px;
}

.autocomplete-list {
  list-style-type: none;
  position: absolute;
  margin-top: 4px;
  width: 100%;
  padding: 8px 0;
  background: var(--main-gray-color);
  border-radius: 8px;
  z-index: 1;
}

.dark .autocomplete-list,
.dark .search-history button .clear {
  background: var(--main-dark-gray-color);
}

.autocomplete-item {
  cursor: pointer;
  padding: 8px 22px;
  transition: all 0.15s ease-in-out;
}

.search-history .clear:hover,
.autocomplete-item:hover {
  color: var(--main-active-color);
}

.search-history {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.search-history {
  position: relative;
}

.search-history .clear {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: var(--main-gray-color);
  width: 16px;
  height: 16px;
  padding: 4px;
  border-radius: 100%;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  z-index: 1;
  top: -10px;
  right: -10px;
}

.history-item {
  position: relative;
  font-weight: 600;
}

.history-item button::after {
  content: '';
  position: absolute;
  width: calc(100%);
  height: calc(100%);
  left: -1px;
  top: -1px;
  border: 1px solid transparent;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
}

.history-item button.active {
  cursor: auto;
  color: inherit;
}

.history-item button.active::after,
.history-item:hover button::after {
  border-color: var(--main-active-color);
}

.search-history .title {
  font-size: 18px;
  font-weight: 600;
  margin-right: 40px;
}

.favorites-btn {
  font-weight: 600;
  padding: 14px 28px;
  text-transform: uppercase;
}
</style>
