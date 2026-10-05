// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import KpiKedisiplinanView from '@/views/KpiKedisiplinanView.vue'
import KpiProduktivitasView from '@/views/KpiProduktivitasView.vue'

// 🔑 Import Layout Induk yang baru saja kita buat
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  // 🔑 BUNGKUS KEDUA HALAMAN DI DALAM MAINLAYOUT
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true }, // Semua yang di dalam layout ini wajib login
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView // Isi grafik/angka dashboard kamu yang lama
      },
      {
        path: 'kpi-kedisiplinan',
        name: 'kpi-kedisiplinan',
        component: KpiKedisiplinanView // Tabel KPI Kedisiplinan dengan kotak warna
      },
      {
        path: 'kpi-produktivitas',
        name: 'kpi-produktivitas',
        component: KpiProduktivitasView // Tabel KPI Kedisiplinan dengan kotak warna
      }

    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user_token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router