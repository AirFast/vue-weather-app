<script setup lang="ts">
import { router } from '~/router'
import { toUpperCaseFirst } from '~/helpers'

const routes = router.options.routes
</script>

<template>
  <header class="app-header">
    <RouterLink :to="{ name: 'home' }">Weather App</RouterLink>
    <nav class="app-nav">
      <ul>
        <li v-for="{ name, path } in routes" :key="name">
          <RouterLink :to="path">{{ toUpperCaseFirst(name as string) }}</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-nav ul {
  display: flex;
  list-style-type: none;
  margin-left: -1rem;
  margin-right: -1rem;
}

.app-nav li a {
  padding: 10px 1rem;
}
</style>
