<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-slate-900 p-6 box-border font-sans antialiased text-slate-200">
    
    <div class="bg-slate-800 p-10 md:p-12 rounded-2xl w-full max-w-[420px] shadow-2xl border border-slate-700/50 text-center relative overflow-hidden">
      
      <div class="absolute -top-10 -right-10 w-28 h-28 bg-[#646cff]/10 rounded-full blur-xl pointer-events-none"></div>
      
      
      <h2 class="text-2xl md:text-3xl font-black text-white m-0 mb-2 tracking-tight">KPI</h2>
      <h2>&nbsp; </h2>
      <p class="text-xs md:text-sm text-slate-400 m-0 mb-10 leading-relaxed"> </p>
      
      <form @submit.prevent="handleLogin" class="text-left space-y-6">
        
        <div class="flex flex-col gap-2">
          <label class="block text-xs md:text-[13px] font-bold text-slate-300 uppercase tracking-wider">User Kode</label>
          <div class="relative">
            <input 
              v-model="username" 
              type="text" 
              placeholder="Masukkan kode user (NIK)..." 
              class="w-full p-3.5 pl-11 rounded-xl bg-slate-900 border border-slate-700 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#646cff] focus:bg-slate-900 transition-all duration-200 box-border"
              required 
            />
            <span class="absolute left-4 top-4 text-slate-500 text-xs md:text-sm">👤</span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="block text-xs md:text-[13px] font-bold text-slate-300 uppercase tracking-wider">Password</label>
          <div class="relative">
            <input 
              v-model="password" 
              type="password" 
              placeholder="Masukkan password akun..." 
              class="w-full p-3.5 pl-11 rounded-xl bg-slate-900 border border-slate-700 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#646cff] focus:bg-slate-900 transition-all duration-200 box-border"
              required 
            />
            <span class="absolute left-4 top-4 text-slate-500 text-xs md:text-sm">🔒</span>
          </div>
        </div>

        <div class="pt-4">
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full p-4 bg-[#646cff] text-white border-none rounded-xl font-bold text-xs md:text-sm cursor-pointer tracking-widest transition-all duration-200 hover:bg-[#535bf2] hover:shadow-[0_0_20px_rgba(100,108,255,0.4)] disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed uppercase flex items-center justify-center gap-2"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <span class="animate-spin text-sm">🔄</span> Memproses...
            </span>
            <span v-else>Login ➔</span>
          </button>
        </div>
      </form>
      
      <p v-if="errorMessage" class="text-xs md:text-sm text-rose-400 font-semibold m-0 mt-6 bg-rose-950/40 p-4 rounded-xl border border-rose-900/40 text-left flex items-start gap-2.5 animate-fade-in leading-relaxed">
        <span class="shrink-0">⚠️</span>
        <span>{{ errorMessage }}</span>
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../services/api'
import type { LoginResponse } from '../types/api' 

const router = useRouter()
const username = ref<string>('')
const password = ref<string>('')
const isLoading = ref<boolean>(false)
const errorMessage = ref<string>('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await apiClient.post<LoginResponse>('/api/login', {
      user_kode: username.value,
      user_password: password.value
    })

    const data = response.data

    if (data.success) {
      localStorage.setItem('user_token', data.token)
      localStorage.setItem('user_info', JSON.stringify(data.user))
      localStorage.setItem('user_nama', data.user.user_nama)
      localStorage.setItem('user_akses', data.user.user_cab ?? 'HO')
      
      router.push('/dashboard')
    } else {
      errorMessage.value = data.message || 'Gagal masuk!'
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || 'Kredensial salah!'
    } else {
      errorMessage.value = 'Tidak dapat terhubung ke server backend.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>