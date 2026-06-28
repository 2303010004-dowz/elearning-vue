<template>
  <DashboardLayout :hideSidebar="true">
    
    <!-- ========================================================================= -->
    <!-- SUB-HEADER BARU -->
    <!-- ========================================================================= -->
    <div class="w-full flex items-center justify-between px-6 text-white bg-[#4A86A8]" style="height: 65px;">
      
      <!-- Sisi Kiri: Tombol Back & Navigasi Breadcrumb -->
      <div class="flex items-center gap-3">
        <!-- Tombol Back Chevron -->
        <button 
          type="button" 
          @click="kembaliKeTugas" 
          class="p-0 bg-transparent border-0 text-white flex items-center opacity-75 hover:opacity-100 transition-opacity focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
        
        <!-- Teks Breadcrumb Navigasi -->
        <div class="flex items-center gap-2 text-[0.95rem] whitespace-nowrap">
          <span class="opacity-50 cursor-pointer hover:opacity-80" @click="kembaliKeTugas">Tugas</span>
          <span class="opacity-50">/</span>
          <span class="font-bold text-white">Nilai Kiriman - Makalah Teks Deskripsi</span>
        </div>
      </div>

      <!-- Sisi Kanan: Avatar Profil User (Inisial Nama) -->
      <div class="flex items-center">
        <div 
          class="bg-white text-gray-900 font-bold flex items-center justify-center rounded-full shadow-sm w-[35px] h-[35px] text-[0.85rem]"
        >
          {{ getInisial(userName).substring(0, 1) }}
        </div>
      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- KONTEN UTAMA: GRID DATA TABEL DAN FORM PENILAIAN                         -->
    <!-- ========================================================================= -->
    <div class="w-full px-6 mx-auto mt-4 mb-5">
      <div 
        class="grid gap-8 items-start"
        :class="selectedSiswa ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'"
      >
        
        <!-- ================= KOLOM KIRI: DAFTAR SISWA ================= -->
        <div :class="!selectedSiswa ? 'w-full max-w-[650px]' : 'w-full'">
          <h6 class="text-base font-bold mb-3 ml-1 text-[#333]">Daftar Kiriman Siswa</h6>
          
          <div class="bg-[#EBEBEB] rounded-[15px] shadow-sm overflow-hidden">
            <table class="w-full text-left border-collapse">
              
              <!-- Header Tabel -->
              <thead class="border-b-2 border-[#DEDEDE]">
                <tr class="text-gray-500 text-[0.95rem]">
                  <th class="pl-6 py-3 font-semibold">Siswa</th>
                  <th class="font-semibold px-2">Nilai</th>
                  <th class="font-semibold px-2">Aksi</th>
                </tr>
              </thead>
              
              <!-- Body Tabel -->
              <tbody>
                <tr 
                  v-for="siswa in daftarSiswa" 
                  :key="siswa.id" 
                  class="border-b border-[#DEDEDE] last:border-0 transition-colors"
                  :class="selectedSiswa?.id === siswa.id ? 'bg-[#B5C6D4]' : 'bg-transparent'"
                >
                  
                  <!-- Profil Siswa (Avatar & Nama) -->
                  <td class="flex items-center py-3 pl-6">
                    <div 
                      class="flex items-center justify-center text-center font-bold mr-3 w-[40px] h-[40px] rounded-full shrink-0 text-[0.9rem]"
                      :style="{ backgroundColor: getWarna(siswa.nama) + '40', color: getWarna(siswa.nama) }"
                    >
                      {{ getInisial(siswa.nama) }}
                    </div>
                    <div class="font-bold text-gray-900 text-[0.95rem] leading-tight">
                      <span class="block">{{ siswa.nama.split(' ').slice(0, 2).join(' ') }}</span>
                      <span class="block font-medium text-gray-700" v-if="siswa.nama.split(' ').length > 2">
                        {{ siswa.nama.split(' ').slice(2).join(' ') }}
                      </span>
                    </div>
                  </td>
                  
                  <!-- Kolom Nilai -->
                  <td class="px-2 text-[0.95rem]" :class="siswa.nilai ? 'font-bold text-gray-900' : 'text-gray-500'">
                    {{ siswa.nilai || 'Belum' }}
                  </td>
                  
                  <!-- Tombol Aksi -->
                  <td class="px-2">
                    <button 
                      type="button" 
                      class="text-xs px-5 py-1.5 rounded-full bg-[#929292] text-white font-medium hover:bg-gray-600 transition-colors"
                      @click.stop="pilihSiswa(siswa)"
                    >
                      Nilai
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ================= KOLOM KANAN: FORM PENILAIAN ================= -->
        <div v-if="selectedSiswa" class="w-full">
          <div class="flex justify-between items-center mb-3">
            <h6 class="text-base font-bold ml-1 text-[#333]">Form Penilaian</h6>
            <button 
              type="button" 
              class="text-gray-400 hover:text-gray-700 font-bold text-xl px-2 focus:outline-none" 
              @click="selectedSiswa = null"
            >
              &times;
            </button>
          </div>
          
          <div class="bg-[#F1F1F1] p-6 rounded-[15px] shadow-sm">
            
            <!-- Profil Siswa Terpilih -->
            <div class="flex items-center mb-3">
              <div 
                class="flex items-center justify-center text-center font-bold mr-3 w-[40px] h-[40px] rounded-full text-[0.9rem]"
                :style="{ backgroundColor: getWarna(selectedSiswa.nama) + '40', color: getWarna(selectedSiswa.nama) }"
              >
                {{ getInisial(selectedSiswa.nama) }}
              </div>
              <span class="font-bold text-gray-900 text-[1.05rem]">{{ selectedSiswa.nama }}</span>
            </div>
            
            <hr class="mb-4 border-[#DEDEDE] opacity-100">
            
            <!-- Card File Kiriman -->
            <div class="p-3 mb-4 bg-[#E2E2E2] rounded-[10px]">
              <small class="text-gray-500 font-semibold text-xs">File kiriman</small>
              <div class="flex items-center mt-2">
                <div class="text-white font-bold bg-[#6C757D] rounded-[6px] text-[0.75rem] w-[35px] h-[35px] flex items-center justify-center shrink-0 mr-3">
                  PDF
                </div>
                <div>
                  <div class="font-bold text-gray-900 text-[1rem]">Makalah Teks Deskripsi</div>
                  <small class="text-gray-500 text-[0.8rem]">1.2 MB</small>
                </div>
              </div>
            </div>

            <!-- Input Nilai -->
            <label class="text-gray-500 font-semibold mb-2 block text-[0.9rem]">Nilai (0-100)</label>
            <input 
              type="number" 
              class="w-full mb-4 px-4 py-2 border border-[#A9A9A9] rounded-full text-center font-bold text-gray-900 text-[1.1rem] bg-transparent focus:outline-none focus:border-blue-500 h-[45px]" 
              v-model="inputNilai"
            >
            
            <!-- Input Komentar -->
            <label class="text-gray-500 font-semibold mb-2 block text-[0.9rem]">Komentar</label>
            <textarea 
              class="w-full mb-4 p-3 border border-[#A9A9A9] rounded-[10px] text-gray-900 font-semibold bg-transparent focus:outline-none focus:border-blue-500" 
              rows="3" 
              v-model="inputKomentar"
            ></textarea>
            
            <!-- Tombol Kirim Nilai -->
            <div class="text-end">
              <button 
                type="button" 
                @click="simpanNilai" 
                class="px-5 py-2 font-semibold bg-[#467FB3] text-white rounded-full text-[0.9rem] hover:bg-blue-600 transition-colors shadow-none border-0"
              >
                Kirim Nilai
              </button>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

// Ambil data nama user login dari localStorage secara dinamis untuk inisial avatar kanan
const userName = localStorage.getItem('user_name') || 'User'

// State Pengendali Utama
const selectedSiswa = ref(null) 
const inputNilai = ref('')
const inputKomentar = ref('')

// Mock Data
const daftarSiswa = ref([
  { id: 1, nama: 'Ahmad Suaib', nilai: null },
  { id: 2, nama: 'Ari Putra', nilai: null },
  { id: 3, nama: 'Muhammad Ridho', nilai: 86 },
  { id: 4, nama: 'Nabit Sidiq Amarullah', nilai: 100 },
  { id: 5, nama: 'Ega Patria Anggara Y', nilai: null },
  { id: 6, nama: 'Akmal Randi Setiabudin', nilai: 60 },
  { id: 7, nama: 'Aisyah', nilai: null },
])

// Navigasi tombol back kembali ke halaman detail tugas sebelumnya
const kembaliKeTugas = () => {
  window.history.back()
}

// Aksi memilih siswa
const pilihSiswa = (siswa) => { 
  if (selectedSiswa.value?.id === siswa.id) {
    selectedSiswa.value = null 
  } else {
    selectedSiswa.value = siswa 
  }
}

// Mengisi form secara otomatis sewaktu baris siswa diklik
watch(selectedSiswa, (newSiswa) => {
  if (newSiswa) {
    inputNilai.value = newSiswa.nilai !== null ? newSiswa.nilai : '100'
    inputKomentar.value = 'Nice'
  }
})

// Menyimpan nilai ke array lokal & menutup form kanan agar layout kembali lebar penuh
const simpanNilai = () => {
  if (selectedSiswa.value) {
    const idx = daftarSiswa.value.findIndex(s => s.id === selectedSiswa.value.id)
    if (idx !== -1) {
      daftarSiswa.value[idx].nilai = parseInt(inputNilai.value) || null
      selectedSiswa.value = null 
    }
  }
}

// Utilitas Pembuat Avatar
const getInisial = (nama) => nama.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)

const getWarna = (nama) => {
  const warna = ['#5A8DDF', '#82B974', '#C36881', '#7A7A7A', '#A3B46D', '#A172B5', '#D28F5A']
  let hash = 0
  for (let i = 0; i < nama.length; i++) hash = nama.charCodeAt(i) + ((hash << 5) - hash)
  return warna[Math.abs(hash) % warna.length]
}
</script>

<style scoped>
/* Menghilangkan tombol arrow spin bawaan input type=number */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>