<template>
  <div
    class="flex h-screen w-screen overflow-hidden bg-[#f8fafc] font-sans antialiased text-slate-800"
  >
    <!-- ========================================== -->
    <!-- SIDEBAR NAVIGATION (Warna & Border Diperbarui ke Dark Premium) -->
    <!-- ========================================== -->
    <aside
      class="w-64 bg-slate-800 text-slate-400 p-5 shrink-0 flex flex-col justify-between border-r border-slate-700/50 z-20 shadow-xl"
    >
      <div class="flex flex-col gap-6">
        <!-- Brand Logo / Identity (Mengubah border & warna teks ke putih) -->
        <div class="flex flex-col gap-2 border-b border-slate-700/60 pb-5">
          <div class="flex items-center gap-3 px-2">
            <div
              class="w-9 h-9 rounded-xl bg-[#646cff]/20 flex items-center justify-center text-lg text-[#646cff] font-bold border border-[#646cff]/30 shadow-inner"
            >
              📶
            </div>
            <div class="flex flex-col">
              <span
                class="font-black text-sm tracking-wider text-white uppercase leading-none"
              >
                KPI Panel
              </span>
              <span
                class="text-xs text-slate-400 font-medium tracking-tight mt-1"
                >CV. Kencanaprint</span
              >
            </div>
          </div>

          <!-- Badge Hak Akses (Warna disesuaikan tema gelap) -->
          <div
            v-if="userAkses"
            class="mx-2 mt-2 text-[10px] text-[#646cff] bg-[#646cff]/15 px-2.5 py-1 rounded-md border border-[#646cff]/30 w-fit font-mono font-bold tracking-wide uppercase"
          >
            🛡️ {{ userAkses }}
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex flex-col gap-1.5">
          <div
            class="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-2 px-3"
          >
            Main Menu
          </div>

          <!-- Menu: Dashboard Utama -->
          <RouterLink
            to="/dashboard"
            class="group relative px-4 py-3 rounded-xl transition-all duration-200 text-slate-400 flex items-center gap-3.5 hover:bg-slate-700/50 hover:text-white font-semibold text-xs tracking-wide"
            active-class="bg-[#646cff]/20 text-white font-bold! shadow-inner"
          >
            <!-- Indikator Bar Vertikal saat Aktif -->
            <div
              class="absolute left-0 top-3 bottom-3 w-1 bg-[#646cff] rounded-r-full hidden group-has-[.router-link-active]:block"
            ></div>
            <span
              class="text-sm filter drop-shadow-xs transition-transform group-hover:scale-110 duration-150"
              >📉</span
            >
            <span>Dashboard Utama</span>
          </RouterLink>

          <!-- Menu: KPI Kedisiplinan -->
          <RouterLink
            to="/kpi-kedisiplinan"
            class="group relative px-4 py-3 rounded-xl transition-all duration-200 text-slate-400 flex items-center gap-3.5 hover:bg-slate-700/50 hover:text-white font-semibold text-xs tracking-wide"
            active-class="bg-[#646cff]/20 text-white font-bold! shadow-inner"
          >
            <div
              class="absolute left-0 top-3 bottom-3 w-1 bg-[#646cff] rounded-r-full hidden group-has-[.router-link-active]:block"
            ></div>
            <span
              class="text-sm filter drop-shadow-xs transition-transform group-hover:scale-110 duration-150"
              >⌚</span
            >
            <span>KPI Kedisiplinan</span>
          </RouterLink>

          <!-- Menu: KPI Produktivitas -->
          <RouterLink
            to="/kpi-produktivitas"
            class="group relative px-4 py-3 rounded-xl transition-all duration-200 text-slate-400 flex items-center gap-3.5 hover:bg-slate-700/50 hover:text-white font-semibold text-xs tracking-wide"
            active-class="bg-[#646cff]/20 text-white font-bold! shadow-inner"
          >
            <div
              class="absolute left-0 top-3 bottom-3 w-1 bg-[#646cff] rounded-r-full hidden group-has-[.router-link-active]:block"
            ></div>
            <span
              class="text-sm filter drop-shadow-xs transition-transform group-hover:scale-110 duration-150"
              >📦</span
            >
            <span>KPI Produktivitas</span>
          </RouterLink>
        </nav>
      </div>

      <!-- Sidebar Footer -->
      <div
        class="text-[10px] text-slate-500 text-center border-t border-slate-700/60 pt-4 font-mono tracking-tight"
      >
        v1.0.0 • Powered by Vite
      </div>
    </aside>

    <!-- ========================================== -->
    <!-- MAIN CONTENT CONTAINER -->
    <!-- ========================================== -->
    <div class="flex-grow flex flex-col overflow-hidden">
      <!-- Top App Header -->
      <header
        class="h-16 bg-white border-b border-slate-200/80 flex items-center px-8 shrink-0 justify-between z-10 shadow-3xs"
      >
        <div class="flex flex-col">
          <span
            class="text-slate-400 text-[9px] font-mono uppercase tracking-widest font-bold"
          >
            Key Performance Indicator
          </span>
          <span class="text-slate-900 font-black text-sm mt-0.5 tracking-tight">
            Sistem Informasi Kinerja Karyawan
          </span>
        </div>

        <!-- User Profile Actions -->
        <div class="flex items-center gap-5">
          <div class="flex items-center gap-3 pr-2">
            <!-- Avatar Bulat Statis -->
            <div
              class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#646cff] to-[#7c3aed] text-white flex items-center justify-center font-black text-xs uppercase shadow-sm tracking-wider"
            >
              {{ userNama.substring(0, 2) }}
            </div>
            <div class="flex flex-col">
              <span
                class="font-bold text-slate-900 uppercase text-xs tracking-wide leading-tight"
                >{{ userNama }}</span
              >
              <span
                class="text-slate-400 text-[10px] font-mono mt-0.5 font-semibold"
                >NIK: {{ userKode }}</span
              >
            </div>
          </div>

          <!-- Tombol Logout Minimalis -->
          <div class="border-l border-slate-200 pl-4 h-8 flex items-center">
            <button
              @click="handleLogout"
              class="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 font-bold cursor-pointer text-xs flex items-center gap-2 border border-transparent hover:border-rose-100"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Router Render Space -->
      <main class="flex-grow overflow-hidden bg-[#f8fafc]">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userNama = ref<string>("Admin");
const userKode = ref<string>("-");
const userAkses = ref<string | null>(null);

onMounted(() => {
  const savedUser = localStorage.getItem("user_info");
  if (savedUser) {
    try {
      const userObj = JSON.parse(savedUser);
      userNama.value = userObj.user_nama || "User";
      userKode.value = userObj.user_kode || "-";
      userAkses.value = userObj.user_akses || null;
    } catch (e) {
      console.error(e);
    }
  }
});

const handleLogout = () => {
  if (confirm("Apakah Anda yakin ingin keluar dari aplikasi?")) {
    localStorage.clear();
    router.push("/login");
  }
};
</script>
