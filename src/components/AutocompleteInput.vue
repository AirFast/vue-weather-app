<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useUserStorage } from '~/composables'

import { Modal } from '~/components'

type CityData = {
  adminName1: string
  countryCode: string
  countryName: string
  name: string
}

const { t } = useI18n()
const userStorage = useUserStorage()

const isModalOpen = ref(false)

const isOpenList = ref(false)
const query = ref('')
const cities = ref<CityData[]>([])

const fetchCities = async () => {
  const response = await fetch(`http://api.geonames.org/searchJSON?q=${query.value}&maxRows=5&username=airfast`)
  const data = await response.json()

  const geoNames: CityData[] = data.geonames

  if (geoNames.length === 0) {
    return
  }

  isOpenList.value = true
  cities.value = geoNames
}

const onCitySelected = (city: CityData) => {
  query.value = city.name

  userStorage.value.city = city.name
  userStorage.value.countryCode = city.countryCode

  isOpenList.value = false
}

const addToFavorites = () => {
  if (userStorage.value.favorites.length >= 5) {
    console.log('favorites переповнений')

    openModal()

    query.value = ''
    return
  }

  userStorage.value.favorites.push(query.value)
  query.value = ''
}

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div class="autocomplete-container">
    <div class="autocomplete">
      <input class="autocomplete-input" v-model="query" @input="fetchCities" :placeholder="t('typeCity')" />
      <ul v-if="isOpenList" class="autocomplete-list">
        <li class="autocomplete-item" v-for="city in cities" @click="onCitySelected(city)">
          {{ city.name }}, {{ city.countryName }}
        </li>
      </ul>
    </div>

    <button v-if="query" class="favorites-btn" @click="addToFavorites">{{ t('favoritesBtn') }}</button>
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
}

.dark .autocomplete-list {
  background: var(--main-dark-gray-color);
}

.autocomplete-item {
  cursor: pointer;
  padding: 8px 22px;
  transition: all 0.15s ease-in-out;
}

.autocomplete-item:hover {
  color: var(--main-active-color);
}

.favorites-btn {
  font-weight: 600;
  padding: 14px 28px;
  text-transform: uppercase;
}
</style>
