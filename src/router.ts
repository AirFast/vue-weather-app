import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('~/pages/home'),
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('~/pages/favorites'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
