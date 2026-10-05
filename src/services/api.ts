// src/services/api.ts
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// Interceptor Request dengan Type Safety untuk Token JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('user_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ==========================================
// AXIOS GLOBAL INTERCEPTOR
// ==========================================
axios.interceptors.response.use(
  (response) => {
    // Jika request sukses (kode 200-299), biarkan lewat
    return response;
  },
  (error) => {
    // Tangkap error dari backend
    if (error.response && error.response.status === 401) {
      console.warn("Token kedaluwarsa atau tidak valid. Melakukan auto-logout...");

      // 1. Bersihkan semua data sesi di browser
      // Sesuaikan nama key-nya ('token', 'user', dll) dengan yang kamu pakai saat login
      localStorage.removeItem('token'); 
      localStorage.removeItem('absen_terakhir'); // Hapus state lain jika perlu
      sessionStorage.clear(); 

      // 2. Arahkan paksa kembali ke halaman login
      // Sesuaikan '/login' dengan path router aplikasi kamu
      window.location.href = '/login'; 
      
      // Jika pakai Vue Router dan kode ini ada di dalam file yang punya akses ke router, 
      // kamu juga bisa pakai: router.push('/login');
    }

    // Lemparkan kembali errornya agar bisa ditangkap oleh blok catch() di komponen
    return Promise.reject(error);
  }
);
export default apiClient