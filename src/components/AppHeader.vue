<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { router } from '~/router'
import { SunIcon, CloudIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const routes = router.options.routes
</script>

<template>
  <header class="app-header">
    <RouterLink class="logo" :to="{ name: 'home' }">
      <span class="icons">
        <SunIcon class="sun-icon" />
        <CloudIcon class="cloud-icon" />
      </span>
    </RouterLink>
    <nav class="app-nav">
      <ul>
        <li v-for="{ name, path } in routes" :key="name">
          <RouterLink :to="path">{{ t(name as string) }}</RouterLink>
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
  margin: 20px 0;
}

.logo:hover {
  color: inherit;
}

.logo .icons {
  position: relative;
}

.logo .icons .sun-icon {
  position: absolute;
  width: 3rem;
  height: 3rem;
  transform: translate(5px, 10px);
  transition: all 0.4s ease-in-out;
  z-index: -1;
}

.logo span .cloud-icon {
  fill: #fff;
  width: 4rem;
  height: 4rem;
  transition: all 0.5s ease-in-out;
}

.logo:hover .icons .sun-icon {
  transform: translate(-3px, -3px);
}

.logo:hover .icons .cloud-icon {
  transform: translateX(10px);
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

.app-nav li a:hover {
  color: var(--main-active-color);
}

.app-nav li a.router-link-active {
  color: var(--main-active-color);
}
</style>
