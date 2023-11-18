import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('~/pages/home') },
  { path: '/favorites', component: () => import('~/pages/favorites') },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
