// main.ts

import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "tailwindcss"
import axios from 'axios'

// 🌟 BIND INTERCEPTOR SECARA GLOBAL PADA INSTANCE UTAMA AXIOS
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Jika backend membalas dengan status 401 (Token Habis)
    if (error.response && error.response.status === 401) {
      console.warn("Token habis! Membersihkan sesi...");
      
      // Hapus sesi di localStorage
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('user_nama');
      localStorage.removeItem('user_akses');
      
      alert("Sesi Anda telah berakhir. Silakan login kembali.");

      // 🌟 PERBAIKAN 1: Gunakan router internal Vue agar pengalihan dipaksa sukses
      router.push('/login').catch(err => {
        // Fallback jika router crash/terkunci oleh Navigation Guard
        window.location.href = '/login';
      });
    }
    
    return Promise.reject(error);
  }
);

const app = createApp(App)

app.use(router)
app.mount('#app')