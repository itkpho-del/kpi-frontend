<template>
  <div class="p-6 bg-[#f8fafc] flex flex-col gap-6 h-full overflow-y-auto font-sans">
    
    <!-- Top Bar Control -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-4">
      <div class="flex flex-col gap-1">
        <h1 class="text-xl font-black text-slate-900 tracking-tight">
          Dashboard Utama
        </h1>
        <p class="text-xs text-slate-400">
          Ringkasan performa kerja karyawan CV. Kencanaprint.
        </p>
      </div>

      <div class="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-xl shadow-3xs w-fit">
        <select
          v-model="bulanSelected"
          class="bg-transparent text-xs font-bold text-slate-700 outline-none px-2 py-1 cursor-pointer"
        >
          <option v-for="bulan in daftarBulan" :key="bulan.value" :value="bulan.value">
            {{ bulan.text }}
          </option>
        </select>
        <span class="text-slate-300">|</span>
        <select
          v-model="tahunSelected"
          class="bg-transparent text-xs font-bold text-slate-700 outline-none px-2 py-1 cursor-pointer"
        >
          <option v-for="tahun in opsiTahun" :key="tahun" :value="tahun">
            {{ tahun }}
          </option>
        </select>
      </div>
    </div>

    <!-- Ringkasan Angka Utama -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-3xs">
        <div class="flex flex-col gap-1">
          <span class="text-xs font-bold text-slate-400 tracking-wider uppercase">Total Karyawan</span>
          <h2 class="text-3xl font-black text-slate-900 mt-1">
            <template v-if="isLoading">
              <span class="text-slate-300 animate-pulse">...</span>
            </template>
            <template v-else>
              {{ dataDashboard.total_karyawan }}
              <span class="text-xs font-normal text-slate-400">Orang</span>
            </template>
          </h2>
          <span class="text-[10px] text-slate-500 font-medium mt-1">Staf Non-Management</span>
        </div>
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
          👥
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-3xs">
        <div class="flex flex-col gap-1">
          <span class="text-xs font-bold text-slate-400 tracking-wider uppercase">Rata-Rata Kedisiplinan</span>
          <h2 class="text-3xl font-black text-slate-900 mt-1">
            <template v-if="isLoading">
              <span class="text-slate-300 animate-pulse">...</span>
            </template>
            <template v-else>
              {{ Number(dataDashboard.ratarata || 0).toFixed(2) }}
              <span class="text-xs font-normal text-slate-400">/ 4.00</span>
            </template>
          </h2>
          <span
            v-if="!isLoading"
            class="text-[10px] font-bold mt-1"
            :class="Number(dataDashboard.ratarata) >= 3.0 ? 'text-emerald-600' : 'text-amber-600'"
          >
            {{ Number(dataDashboard.ratarata) >= 3.0 ? "🏆 Performa Bagus" : "⚠️ Perlu Pengawasan Presensi" }}
          </span>
        </div>
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
          ⌚
        </div>
      </div>
    </div>

    <!-- MAIN CHART: Distribusi Nilai Global -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-slate-800">
          Visualisasi Distribusi Nilai Karyawan (Global)
        </h3>
        <span class="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-500">
          Total: {{ dataDashboard.total_karyawan }} Orang
        </span>
      </div>

      <div class="w-full h-5 bg-slate-100 rounded-full overflow-hidden flex mb-6 shadow-inner">
        <template v-if="!isLoading && dataDashboard.total_karyawan > 0">
          <div
            class="bg-emerald-500 h-full transition-all duration-500 ease-out flex items-center justify-center text-[10px] font-bold text-white shadow-2xs"
            :style="{ width: `${(dataDashboard.nilai4 / dataDashboard.total_karyawan) * 100}%` }"
            v-if="dataDashboard.nilai4 > 0"
          >
            {{ ((dataDashboard.nilai4 / dataDashboard.total_karyawan) * 100).toFixed(0) }}%
          </div>
          <div
            class="bg-blue-500 h-full transition-all duration-500 ease-out flex items-center justify-center text-[10px] font-bold text-white shadow-2xs"
            :style="{ width: `${(dataDashboard.nilai3 / dataDashboard.total_karyawan) * 100}%` }"
            v-if="dataDashboard.nilai3 > 0"
          >
            {{ ((dataDashboard.nilai3 / dataDashboard.total_karyawan) * 100).toFixed(0) }}%
          </div>
          <div
            class="bg-amber-500 h-full transition-all duration-500 ease-out flex items-center justify-center text-[10px] font-bold text-white shadow-2xs"
            :style="{ width: `${(dataDashboard.nilai2 / dataDashboard.total_karyawan) * 100}%` }"
            v-if="dataDashboard.nilai2 > 0"
          >
            {{ ((dataDashboard.nilai2 / dataDashboard.total_karyawan) * 100).toFixed(0) }}%
          </div>
          <div
            class="bg-red-500 h-full transition-all duration-500 ease-out flex items-center justify-center text-[10px] font-bold text-white shadow-2xs"
            :style="{ width: `${(dataDashboard.nilai1 / dataDashboard.total_karyawan) * 100}%` }"
            v-if="dataDashboard.nilai1 > 0"
          >
            {{ ((dataDashboard.nilai1 / dataDashboard.total_karyawan) * 100).toFixed(0) }}%
          </div>
        </template>

        <div
          v-else
          class="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-medium"
        >
          {{ isLoading ? "Memetakan Grafik..." : "Belum Ada Data Distribusi" }}
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/70 flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></div>
          <div class="flex flex-col">
            <span class="text-[11px] font-bold text-emerald-800">Nilai 4 (Sempurna)</span>
            <span class="text-sm font-black text-slate-800 mt-0.5">
              {{ dataDashboard.total_karyawan > 0 ? ((dataDashboard.nilai4 / dataDashboard.total_karyawan) * 100).toFixed(1) : "0" }}%
              <span class="text-xs font-normal text-slate-400">({{ isLoading ? "-" : dataDashboard.nilai4 }} Karyawan)</span>
            </span>
          </div>
        </div>

        <div class="p-3 bg-blue-50/50 rounded-xl border border-blue-100/70 flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></div>
          <div class="flex flex-col">
            <span class="text-[11px] font-bold text-blue-800">Nilai 3 (Baik)</span>
            <span class="text-sm font-black text-slate-800 mt-0.5">
              {{ dataDashboard.total_karyawan > 0 ? ((dataDashboard.nilai3 / dataDashboard.total_karyawan) * 100).toFixed(1) : "0" }}%
              <span class="text-xs font-normal text-slate-400">({{ isLoading ? "-" : dataDashboard.nilai3 }} Karyawan)</span>
            </span>
          </div>
        </div>

        <div class="p-3 bg-amber-50/50 rounded-xl border border-amber-100/70 flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></div>
          <div class="flex flex-col">
            <span class="text-[11px] font-bold text-amber-800">Nilai 2 (Cukup)</span>
            <span class="text-sm font-black text-slate-800 mt-0.5">
              {{ dataDashboard.total_karyawan > 0 ? ((dataDashboard.nilai2 / dataDashboard.total_karyawan) * 100).toFixed(1) : "0" }}%
              <span class="text-xs font-normal text-slate-400">({{ isLoading ? "-" : dataDashboard.nilai2 }} Karyawan)</span>
            </span>
          </div>
        </div>

        <div class="p-3 bg-red-50/50 rounded-xl border border-red-100/70 flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></div>
          <div class="flex flex-col">
            <span class="text-[11px] font-bold text-red-800">Nilai 1 (Kurang)</span>
            <span class="text-sm font-black text-slate-800 mt-0.5">
              {{ dataDashboard.total_karyawan > 0 ? ((dataDashboard.nilai1 / dataDashboard.total_karyawan) * 100).toFixed(1) : "0" }}%
              <span class="text-xs font-normal text-slate-400">({{ isLoading ? "-" : dataDashboard.nilai1 }} Karyawan)</span>
            </span>
          </div>
        </div>
      </div>
    </div>



  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import apiClient from "../services/api";
import type { DashboardSummary } from "../types/api";

const bulanSekarang = String(new Date().getMonth() + 1).padStart(2, "0");
const bulanSelected = ref<string>(bulanSekarang);
const tahunSelected = ref<string>("2026");
const isLoading = ref<boolean>(false);

// 🌟 VARIABEL DATA KPI MENTAH (Untuk menghitung sebaran pabrik di frontend)
const dataKpiRaw = ref<any[]>([]);

const dataDashboard = ref<DashboardSummary>({
  total_karyawan: 0,
  nilai1: 0,
  nilai2: 0,
  nilai3: 0,
  nilai4: 0,
  ratarata: 0,
});

// 🌟 PROSES PENGELOMPOKAN DATA PABRIK SECARA DINAMIS (1 CARD UNTUK SEMUA)
const dataPabrikDinamis = computed(() => {
  if (!dataKpiRaw.value || dataKpiRaw.value.length === 0) return [];

  const pengelompokan = dataKpiRaw.value.reduce((acc, item) => {
    // Normalisasi nama pabrik agar seragam (misal: P1, P2)
    const namaPabrik = item.pabrik ? String(item.pabrik).toUpperCase().trim() : "LAINNYA";
    
    if (!acc[namaPabrik]) {
      acc[namaPabrik] = { nama: namaPabrik, total: 0, nilai1: 0, nilai2: 0, nilai3: 0, nilai4: 0, total_nilai: 0 };
    }
    
    acc[namaPabrik].total += 1;
    acc[namaPabrik].total_nilai += Number(item.nilai || 0);
    
    const floorNilai = Math.floor(Number(item.nilai || 0));
    if (floorNilai === 1) acc[namaPabrik].nilai1++;
    else if (floorNilai === 2) acc[namaPabrik].nilai2++;
    else if (floorNilai === 3) acc[namaPabrik].nilai3++;
    else if (floorNilai >= 4) acc[namaPabrik].nilai4++;
    else acc[namaPabrik].nilai1++; // Default jika di bawah angka 1
    
    return acc;
  }, {} as any);

  return Object.values(pengelompokan).map((p: any) => ({
    nama: p.nama,
    total_karyawan: p.total,
    ratarata: p.total_nilai / p.total,
    nilai1: p.nilai1, nilai2: p.nilai2, nilai3: p.nilai3, nilai4: p.nilai4,
    persen1: (p.nilai1 / p.total) * 100,
    persen2: (p.nilai2 / p.total) * 100,
    persen3: (p.nilai3 / p.total) * 100,
    persen4: (p.nilai4 / p.total) * 100,
  }));
});

const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    // A. TARIK DATA SUMMARY UTAMA
    const responseSummary = await apiClient.get<any>("/api/dashboard-summary", {
      params: {
        bulan: bulanSelected.value,
        tahun: tahunSelected.value,
      },
    });

    if (responseSummary.data && responseSummary.data.success && responseSummary.data.data) {
      dataDashboard.value = Array.isArray(responseSummary.data.data)
        ? responseSummary.data.data[0]
        : responseSummary.data.data;
    } else if (Array.isArray(responseSummary.data) && responseSummary.data.length > 0) {
      dataDashboard.value = responseSummary.data[0];
    }

    // B. TARIK DATA KPI KEDISIPLINAN SEBAGAI SUMBER PEMETAAN PABRIK SECARA PARALEL
    const responseKpi = await apiClient.get<any>("/api/kpi-kedisiplinan", {
      params: {
        bulan: bulanSelected.value,
        tahun: tahunSelected.value,
      },
    });

    if (responseKpi.data && responseKpi.data.success && responseKpi.data.data) {
      dataKpiRaw.value = responseKpi.data.data;
    } else if (Array.isArray(responseKpi.data)) {
      dataKpiRaw.value = responseKpi.data;
    } else {
      dataKpiRaw.value = [];
    }

  } catch (error) {
    console.error("Gagal memuat data dashboard summary:", error);
    dataKpiRaw.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});

watch([bulanSelected, tahunSelected], () => {
  fetchDashboardData();
});

const daftarBulan = [
  { text: "Januari", value: "01" },
  { text: "Februari", value: "02" },
  { text: "Maret", value: "03" },
  { text: "April", value: "04" },
  { text: "Mei", value: "05" },
  { text: "Juni", value: "06" },
  { text: "Juli", value: "07" },
  { text: "Agustus", value: "08" },
  { text: "September", value: "09" },
  { text: "Oktober", value: "10" },
  { text: "November", value: "11" },
  { text: "Desember", value: "12" },
];

const tahunSekarang = new Date().getFullYear();
const opsiTahun = ref<number[]>([
  tahunSekarang,
  tahunSekarang - 1,
  tahunSekarang - 2,
]);
</script>