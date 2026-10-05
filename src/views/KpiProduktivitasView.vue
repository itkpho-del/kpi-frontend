<template>
  <div class="flex flex-col h-full w-full bg-white p-4 box-border font-sans text-xs overflow-hidden text-[#213547]">
    
    <!-- Top Bar Control -->
    <div class="bg-[#f9f9f9] p-3 rounded-t-lg border border-[#e2e8f0] flex flex-wrap items-center justify-between gap-4 shrink-0">
      <div class="flex items-center gap-4 flex-wrap">
        <h2 class="text-xs font-bold text-[#213547] m-0 uppercase tracking-wider flex items-center gap-1">
          📊 KPI Produktivitas Karyawan
        </h2>

        <div class="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-[#e2e8f0]">
          <span class="font-semibold text-slate-500">Periode:</span>
          
          <select 
            v-model="filterBulan" 
            @change="fetchKpiData" 
            class="bg-white text-[#213547] border border-[#cbd5e1] px-1 py-0.5 rounded focus:outline-none focus:border-[#646cff] cursor-pointer font-medium"
          >
            <option v-for="bulan in daftarBulan" :key="bulan.value" :value="bulan.value">
              {{ bulan.text }}
            </option>
          </select>

          <select 
            v-model="filterTahun" 
            @change="fetchKpiData" 
            class="bg-white text-[#213547] border border-[#cbd5e1] px-1 py-0.5 rounded focus:outline-none focus:border-[#646cff] cursor-pointer font-medium"
          >
            <option v-for="tahun in opsiTahun" :key="tahun" :value="tahun">
              {{ tahun }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-3 bg-white px-3 py-1 rounded border border-[#e2e8f0] flex-wrap">
          <span class="text-slate-400 font-semibold text-[10px]">Indikator:</span>
          <div class="flex items-center gap-1 font-medium"><span class="w-2.5 h-2.5 rounded-sm bg-red-600 block shadow-xs"></span> <span>0</span></div>
          <div class="flex items-center gap-1 font-medium"><span class="w-2.5 h-2.5 rounded-sm bg-purple-600 block shadow-xs"></span> <span>1</span></div>
          <div class="flex items-center gap-1 font-medium"><span class="w-2.5 h-2.5 rounded-sm bg-yellow-400 block shadow-xs"></span> <span>2</span></div>
          <div class="flex items-center gap-1 font-medium"><span class="w-2.5 h-2.5 rounded-sm bg-cyan-400 block shadow-xs"></span> <span>3</span></div>
          <div class="flex items-center gap-1 font-medium"><span class="w-2.5 h-2.5 rounded-sm bg-gray-300 block shadow-xs"></span> <span>4</span></div>
        </div>
      </div>

      <div class="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-[#e2e8f0]">
        <span class="font-semibold text-slate-500">Cari:</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Ketik nik, nama, bagian, dll.." 
          class="bg-white text-[#213547] border border-[#cbd5e1] px-2 py-0.5 rounded focus:outline-none focus:border-[#646cff] font-medium w-48 text-xs"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="text-slate-400 hover:text-slate-600 text-[10px] font-bold px-1">✕</button>
      </div>

      <button 
        @click="fetchKpiData" 
        :disabled="isLoading"
        class="bg-white hover:bg-[#f1f1f1] text-[#646cff] border border-[#646cff]/40 px-3 py-1 rounded font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span :class="{ 'animate-spin': isLoading }">🔄</span>
        {{ isLoading ? 'Memuat...' : 'Refresh' }}
      </button>
    </div>

    <!-- 🌟 PERBAIKAN: TABLE CONTAINER PREMIUM DESIGN & STICKY ACTIONS -->
    <div class="flex-grow overflow-auto border border-slate-200 rounded-lg bg-white shadow-xs">
      <table class="w-full border-collapse min-w-[1650px] table-fixed text-left">
        
        <!-- HEADER TABEL (DARK MODE STYLE & BOLD) -->
        <thead class="sticky top-0 z-20 shadow-md">
          <tr class="bg-slate-700 text-white font-extrabold uppercase tracking-wider text-[10px] divide-x divide-slate-800">
            <th @click="setSort('tahun')" class="p-3 w-14 cursor-pointer hover:bg-slate-800 transition-colors select-none text-center">
              Tahun <span class="text-slate-400 ml-0.5">{{ renderSortIcon('tahun') }}</span>
            </th>          
            <th @click="setSort('bulan')" class="p-3 w-14 cursor-pointer hover:bg-slate-800 transition-colors select-none text-center">
              Bulan <span class="text-slate-400 ml-0.5">{{ renderSortIcon('bulan') }}</span>
            </th>          
            <th @click="setSort('nilai')" class="p-3 w-16 cursor-pointer hover:bg-slate-800 transition-colors select-none text-center">
              Indikator <span class="text-slate-400 ml-0.5">{{ renderSortIcon('nilai') }}</span>
            </th>      
            <th @click="setSort('nik')" class="p-3 w-16 cursor-pointer hover:bg-slate-800 transition-colors select-none">
              NIK <span class="text-slate-400 ml-0.5">{{ renderSortIcon('nik') }}</span>
            </th>          
            <th @click="setSort('nama')" class="p-3 w-36 cursor-pointer hover:bg-slate-800 transition-colors select-none">
              Nama Karyawan <span class="text-slate-400 ml-0.5">{{ renderSortIcon('nama') }}</span>
            </th>          
            <th @click="setSort('jabatan')" class="p-3 w-20 cursor-pointer hover:bg-slate-800 transition-colors select-none">
              Jabatan <span class="text-slate-400 ml-0.5">{{ renderSortIcon('jabatan') }}</span>
            </th>       
            <th @click="setSort('pabrik')" class="p-3 w-14 cursor-pointer hover:bg-slate-800 transition-colors select-none text-center">
              Pabrik <span class="text-slate-400 ml-0.5">{{ renderSortIcon('pabrik') }}</span>
            </th>        
            <th @click="setSort('bagian')" class="p-3 w-20 cursor-pointer hover:bg-slate-800 transition-colors select-none">
              Bagian <span class="text-slate-400 ml-0.5">{{ renderSortIcon('bagian') }}</span>
            </th>        
            <th @click="setSort('departemen')" class="p-3 w-20 cursor-pointer hover:bg-slate-800 transition-colors select-none">
              Dept <span class="text-slate-400 ml-0.5">{{ renderSortIcon('departemen') }}</span>
            </th>    
            <th @click="setSort('tgl_keluar')" class="p-3 w-16 cursor-pointer hover:bg-slate-800 transition-colors select-none text-center">
              Tgl Keluar <span class="text-slate-400 ml-0.5">{{ renderSortIcon('tgl_keluar') }}</span>
            </th>  
            <th @click="setSort('target')" class="p-3 w-16 cursor-pointer hover:bg-slate-800 transition-colors select-none text-center">
              Target <span class="text-slate-400 ml-0.5">{{ renderSortIcon('target') }}</span>
            </th>   
            <th @click="setSort('realisasi')" class="p-3 w-16 cursor-pointer hover:bg-slate-800 transition-colors select-none text-center">
              Realisasi <span class="text-slate-400 ml-0.5">{{ renderSortIcon('realisasi') }}</span>
            </th>     
            <th @click="setSort('ach')" class="p-3 w-16 cursor-pointer hover:bg-slate-800 transition-colors select-none text-center">
              Ach <span class="text-slate-400 ml-0.5">{{ renderSortIcon('ach') }}</span>
            </th>  
            <th @click="setSort('nilai')" class="p-3 w-14 cursor-pointer hover:bg-slate-800 transition-colors select-none text-center">
              Nilai <span class="text-slate-400 ml-0.5">{{ renderSortIcon('nilai') }}</span>
            </th>       
            <th class="p-3 w-18 text-center bg-slate-700 sticky right-0 shadow-[-4px_0_10px_rgba(0,0,0,0.15)]">Aksi</th>
          </tr>
        </thead>

        <!-- BODY TABEL (STRIPED ROW & HOVER EFFECT) -->
        <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
          <tr 
            v-for="item in filteredDataKpi"  
            :key="item.nik"
            class="divide-x divide-slate-100 hover:bg-indigo-50/40 odd:bg-white even:bg-slate-50/50 transition-colors duration-100"
          >
            <td class="p-2 text-center font-mono text-slate-600 select-all">{{ item.tahun }}</td>
            <td class="p-2 text-center font-bold text-slate-800 uppercase tracking-wide">{{ item.bulan }}</td>
            <td class="p-2">
              <div class="flex items-center justify-center">
                <span 
                  class="w-3.5 h-3.5 rounded-full shadow-inner border border-white block" 
                  :class="getIndicatorColor(item.nilai)"
                  :title="'Kategori Nilai: ' + item.nilai"
                ></span>
              </div>
            </td>
            <td class="p-2 font-mono select-all text-slate-600 font-semibold">{{ item.nik }}</td>
            <td class="p-2 font-bold text-slate-900 uppercase select-all tracking-tight">{{ item.nama }}</td>
            <td class="p-2 uppercase text-slate-600 text-[11px]">{{ item.jabatan }}</td>
            <td class="p-2 text-center uppercase font-mono text-slate-600">{{ item.pabrik }}</td>
            <td class="p-2 uppercase text-slate-600 text-[11px]">{{ item.bagian }}</td>
            <td class="p-2 uppercase text-slate-600 text-[11px]">{{ item.departemen }}</td>
            <td class="p-2 text-center font-mono text-slate-400">{{ item.tgl_keluar ? formatTanggalLokal(item.tgl_keluar) : '-' }}</td>
            <td class="p-2 text-center font-mono font-medium text-slate-600">{{ formatDesimal(item.target) }}</td>
            <td class="p-2 text-center font-mono font-bold text-slate-800">{{ formatDesimal(item.realisasi) }}</td>
            <td class="p-2 text-center font-mono font-bold" :class="Number(item.ach) >= 100 ? 'text-green-600' : 'text-amber-600'">
              {{ item.ach }}%
            </td>
            
            <!-- Skor Akhir High-Contrast -->
            <td class="p-2 text-center font-black text-slate-900 bg-slate-100/60 font-mono text-xs shadow-inner">
              {{ item.nilai !== null && item.nilai !== undefined ? Number(item.nilai).toFixed(2) : '0.00' }}
            </td>
            
            <!-- Kolom Tombol Aksi Premium (Sticky Right) -->
            <td class="p-2 text-center bg-white shadow-[-4px_0_10px_rgba(0,0,0,0.04)] z-10 sticky right-0">
              <button 
                @click="bukaDetail(item)"
                class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded border border-indigo-100 font-bold shadow-xs transition duration-150 cursor-pointer text-[10px] flex items-center justify-center gap-1 mx-auto"
              >
                📋 Detail
              </button>
            </td>
          </tr>
        </tbody>        
      </table>
    </div>

    <!-- Bottom Actions -->
    <div class="bg-[#f9f9f9] p-3 rounded-b-lg border-x border-b border-[#e2e8f0] flex justify-between items-center shrink-0">
      <button @click="exportExcel" class="bg-white hover:bg-[#f1f1f1] border border-[#cbd5e1] px-4 py-1.5 rounded-lg flex items-center gap-1 font-bold text-[#213547] cursor-pointer transition shadow-xs">
        📥 Export Excel
      </button>
      <button @click="tutupLaporan" class="bg-white hover:bg-[#f1f1f1] border border-[#cbd5e1] px-4 py-1.5 rounded-lg flex items-center gap-1 font-bold text-slate-600 cursor-pointer transition shadow-xs">
        🚪 Tutup
      </button>
    </div>

    <!-- MODAL POPUP: FORM DETAIL KPI PRODUKTIVITAS -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Modal Header -->
        <div class="bg-slate-900 text-white p-4 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-sm">📋</span>
            <div class="flex flex-col">
              <span class="font-extrabold text-xs uppercase tracking-wide">Rincian Form Produktivitas</span>
              <span class="text-[10px] text-slate-400 font-mono">Periode: {{ detailItem?.bulan }}/{{ detailItem?.tahun }}</span>
            </div>
          </div>
          <button @click="isModalOpen = false" class="text-slate-400 hover:text-white transition cursor-pointer text-sm font-bold">✕</button>
        </div>

        <!-- Modal Content -->
        <div class="p-5 overflow-y-auto space-y-5 bg-slate-50/50">
          <!-- Identitas Karyawan -->
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs space-y-3">
            <div class="border-b border-slate-100 pb-1.5">
              <span class="text-[10px] font-bold text-[#646cff] uppercase tracking-wider">Identitas Karyawan</span>
            </div>
            <div class="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-slate-700">
              <div>
                <label class="text-[10px] text-slate-400 block font-medium">Nama Karyawan</label>
                <span class="font-bold text-slate-800 uppercase">{{ detailItem?.nama }}</span>
              </div>
              <div>
                <label class="text-[10px] text-slate-400 block font-medium">Nomor Induk Karyawan (NIK)</label>
                <span class="font-mono font-bold text-slate-600">{{ detailItem?.nik }}</span>
              </div>
              <div>
                <label class="text-[10px] text-slate-400 block font-medium">Jabatan / Bagian</label>
                <span class="font-semibold uppercase">{{ detailItem?.jabatan }} — <span class="text-slate-500">{{ detailItem?.bagian }}</span></span>
              </div>
              <div>
                <label class="text-[10px] text-slate-400 block font-medium">Departemen / Pabrik</label>
                <span class="font-semibold uppercase text-slate-700">{{ detailItem?.departemen }} (<span class="font-mono">{{ detailItem?.pabrik }}</span>)</span>
              </div>
            </div>
          </div>

          <!-- Target vs Achievement -->
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs space-y-3">
            <div class="border-b border-slate-100 pb-1.5 flex justify-between items-center">
              <span class="text-[10px] font-bold text-[#646cff] uppercase tracking-wider">Target vs Achievement</span>
            </div>
            
            <div class="grid grid-cols-3 gap-3">
              <div class="p-2.5 rounded-lg bg-orange-50/50 border border-orange-100 text-center">
                <span class="text-[10px] text-orange-700 font-semibold block mb-0.5">Target</span>
                <span class="text-sm font-black text-orange-600 font-mono">{{ formatDesimal(detailItem?.target) }}</span>
              </div>
              <div class="p-2.5 rounded-lg bg-orange-50/50 border border-orange-100 text-center">
                <span class="text-[10px] text-orange-700 font-semibold block mb-0.5">Realisasi</span>
                <span class="text-sm font-black text-orange-600 font-mono">{{ formatDesimal(detailItem?.realisasi) }}</span>
              </div>
              <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-center">
                <span class="text-[10px] text-emerald-700 font-semibold block mb-0.5">Achievement</span>
                <span class="text-sm font-black text-emerald-600 font-mono">{{ detailItem?.ach }}%</span>
              </div>
            </div>
          </div>

          <!-- Skor Akhir -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between items-center text-center">
              <span class="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Skor Akhir Produktivitas</span>
              <div class="text-xl font-black font-mono text-[#213547] bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200 shadow-inner">
                {{ detailItem?.nilai !== null && detailItem?.nilai !== undefined ? Number(detailItem?.nilai).toFixed(2) : '0.00' }}
              </div>
              <div class="flex items-center gap-1.5 mt-2">
                <span class="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-xs" :class="getIndicatorColor(detailItem?.nilai || 0)"></span>
                <span class="text-[10px] text-slate-500 font-semibold font-mono">Status Indikator</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-slate-100 p-3 border-t border-slate-200 flex justify-end">
          <button 
            @click="isModalOpen = false" 
            class="px-5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-bold transition duration-150 text-xs cursor-pointer"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import apiClient from '../services/api'
import type { KpiProduktivitas, KpiProduktivitasResponse } from '../types/api'
import * as XLSX from 'xlsx'

// State Modal Pop-up Detail
const isModalOpen = ref<boolean>(false)
const detailItem = ref<KpiProduktivitas | null>(null)

// 🌟 STATE MANAGEMENT SORTING
const sortKey = ref<string>('nama')
const sortOrder = ref<'asc' | 'desc'>('asc')

const daftarBulan = [
  { text: 'Januari', value: '01' },
  { text: 'Februari', value: '02' },
  { text: 'Maret', value: '03' },
  { text: 'April', value: '04' },
  { text: 'Mei', value: '05' },
  { text: 'Juni', value: '06' },
  { text: 'Juli', value: '07' },
  { text: 'Agustus', value: '08' },
  { text: 'September', value: '09' },
  { text: 'Oktober', value: '10' },
  { text: 'November', value: '11' },
  { text: 'Desember', value: '12' }
]

const bulanSekarang = String(new Date().getMonth() + 1).padStart(2, '0')
const filterBulan = ref<string>(bulanSekarang)

const tahunSekarang = new Date().getFullYear()
const opsiTahun = ref<number[]>([
  tahunSekarang,     
  tahunSekarang - 1, 
  tahunSekarang - 2  
])
const filterTahun = ref<string>(String(tahunSekarang))
const dataKpi = ref<KpiProduktivitas[]>([])
const isLoading = ref<boolean>(false)
const searchQuery = ref<string>('')

const getIndicatorColor = (nilai: number): string => {
  const numNilai = Number(nilai);
  if (isNaN(numNilai)) return 'bg-gray-300';

  const floorNilai = Math.floor(numNilai);
  if (floorNilai === 0) return 'bg-red-600';
  if (floorNilai === 1) return 'bg-purple-600';
  if (floorNilai === 2) return 'bg-yellow-400';
  if (floorNilai === 3) return 'bg-cyan-400';
  return 'bg-gray-300';
}

const bukaDetail = (item: KpiProduktivitas) => {
  detailItem.value = item
  isModalOpen.value = true
}

// 🌟 FUNGSI BARU: Mengatur arah sortir saat judul kolom diklik
const setSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

// 🌟 FUNGSI BARU: Indikator tanda panah aktif di header
const renderSortIcon = (key: string): string => {
  if (sortKey.value !== key) return '↕️'
  return sortOrder.value === 'asc' ? '▲' : '▼'
}

// 🌟 FILTERED & SORTED COMPUTED DATA
const filteredDataKpi = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  let hasilData = [...dataKpi.value]

  if (query) {
    hasilData = hasilData.filter((item) => {
      return (
        (item.nik?.toLowerCase().includes(query)) ||
        (item.nama?.toLowerCase().includes(query)) ||
        (item.jabatan?.toLowerCase().includes(query)) ||
        (item.pabrik?.toLowerCase().includes(query)) ||
        (item.bagian?.toLowerCase().includes(query)) ||
        (item.departemen?.toLowerCase().includes(query)) 
      )
    })
  }

  // Pengurutan Data (Sorting)
  return hasilData.sort((a, b) => {
    let valA = a[sortKey.value as keyof KpiProduktivitas]
    let valB = b[sortKey.value as keyof KpiProduktivitas]

    if (valA === null || valA === undefined) valA = ''
    if (valB === null || valB === undefined) valB = ''

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder.value === 'asc' ? valA - valB : valB - valA
    }

    const strA = String(valA).toLowerCase()
    const strB = String(valB).toLowerCase()

    if (sortOrder.value === 'asc') {
      return strA.localeCompare(strB, 'id', { numeric: true })
    } else {
      return strB.localeCompare(strA, 'id', { numeric: true })
    }
  })
})

const fetchKpiData = async () => {
  isLoading.value = true 
  try {
    const response = await apiClient.get<KpiProduktivitasResponse>('/api/kpi-produktivitas', {
      params: { 
        bulan: filterBulan.value, 
        tahun: filterTahun.value 
      }
    })
    
    if (response.data && response.data.success) {
      dataKpi.value = response.data.data
    } else {
      if (Array.isArray(response.data)) {
        dataKpi.value = response.data
      }
    }
  } catch (error) {
    console.error('Gagal memuat data KPI Produktivitas dari API:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchKpiData()
})

const exportExcel = () => {
  const dataToExport = filteredDataKpi.value.map(item => ({
    'Tahun': item.tahun,
    'Bulan': item.bulan,
    'NIK': item.nik,
    'Nama Lengkap Karyawan': item.nama,
    'Jabatan': item.jabatan,
    'Pabrik': item.pabrik,
    'Bagian': item.bagian,
    'Departemen': item.departemen,
    'Tgl Keluar': item.tgl_keluar ? formatTanggalLokal(item.tgl_keluar) : '-',
    'Target': item.target,
    'Realisasi': item.realisasi,
    'Ach': item.ach,
    'Nilai KPI': item.nilai !== null && item.nilai !== undefined ? Number(item.nilai).toFixed(2) : '0.00'
  }))

  const worksheet = XLSX.utils.json_to_sheet(dataToExport)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan KPI')
  
  worksheet['!cols'] = [
    { wch: 8 }, { wch: 10 }, { wch: 15 }, { wch: 25 }, { wch: 18 },
    { wch: 10 }, { wch: 18 }, { wch: 18 }, { wch: 12 }, { wch: 15 },
    { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
    { wch: 12 }, { wch: 12 }, { wch: 8 }, { wch: 12 }
  ]

  const sekarang = new Date();
  const tahun = sekarang.getFullYear();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, '0');
  const tanggal = String(sekarang.getDate()).padStart(2, '0');
  const jam = String(sekarang.getHours()).padStart(2, '0');
  const menit = String(sekarang.getMinutes()).padStart(2, '0');
  const detik = String(sekarang.getSeconds()).padStart(2, '0');

  const formatWaktuLokal = `${tahun}${bulan}${tanggal}_${jam}${menit}${detik}`;
  XLSX.writeFile(workbook, `Laporan_KPI_Produktivitas_${formatWaktuLokal}.xlsx`);
}

const tutupLaporan = () => {
  window.history.back()
}

const formatTanggalLokal = (tanggalRaw: string | null | undefined): string => {
  if (!tanggalRaw) return '-'
  const dateObj = new Date(tanggalRaw)
  if (isNaN(dateObj.getTime())) return tanggalRaw
  return dateObj.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatDesimal = (value: any) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0';
  }
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(value));
}
</script>

<style scoped>
table, th, td {
  border-color: #e2e8f0 !important;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}
</style>