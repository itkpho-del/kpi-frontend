// src/types/api.ts

// Struktur data user dari backend
export interface UserData {
  user_kode: string;
  user_nama: string;
  user_cab?: string;
  user_jabatan?: string;
}

// Struktur respon saat Login Sukses
export interface LoginResponse {
  success: boolean;
  message?: string;
  token: string;
  user: UserData;
}

// Struktur respon data Ringkasan Dashboard
export interface DashboardSummary {
  total_karyawan: number;
  nilai1: number;
  nilai2: number;
  nilai3: number;
  nilai4: number;
  ratarata: number;
}

export interface DashboardSummaryResponse {
  success: boolean;
  data: DashboardSummary;
}

// src/types/api.ts

export interface KpiKedisiplinan {
  tahun: string;
  bulan: string;
  nik: string;
  nama: string;
  jabatan: string;
  pabrik: string;
  bagian: string;
  departemen: string;
  sistem_gaji: string;
  tgl_masuk: string;
  tgl_keluar: string | null;
  terlambat: number;
  adaform: number;
  tanpa_form: number;
  alpha: number;
  setengah_hari: number;
  meninggalkan: number;
  sp: number;
  nilai: number;

}

// Ganti juga nama objek response-nya agar serasi
export interface KpiKedisiplinanResponse {
  success: boolean;
  data: KpiKedisiplinan[];
}

export interface KpiProduktivitas {
  tahun: string;
  bulan: string;
  nik: string;
  nama: string;
  jabatan: string;
  pabrik: string;
  bagian: string;
  departemen: string;
  tgl_keluar: string | null;
  target: number;
  realisasi: number;
  ach: number;
  nilai: number;

}

export interface KpiProduktivitasResponse {
  success: boolean;
  data: KpiProduktivitas[];
}
