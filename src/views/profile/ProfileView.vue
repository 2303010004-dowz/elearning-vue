<template>
  <DashboardLayout>
    <div class="w-full px-4 mx-auto mt-4 mb-5">
      <h4 class="text-xl font-bold mb-4 text-gray-900">Profile Saya</h4>

      <!-- Card Utama Pembungkus Profile -->
      <div class="bg-[#EBEBEB] p-6 rounded-[15px] shadow-sm max-w-2xl">
        
        <!-- Bagian Foto / Inisial & Informasi Ringkas Atas -->
        <div class="flex flex-col items-center sm:flex-row sm:items-start gap-4 border-b border-gray-300 pb-5 mb-5">
          <!-- PERBAIKAN (Ganti 'justify-content-center' menjadi 'justify-center'): -->
        <div class="bg-gray-400 text-white font-bold flex items-center justify-center w-[100px] h-[100px] rounded-full text-2xl shrink-0 uppercase shadow-inner">
          {{ getInisial(userProfile.nama) }}
        </div>
          
          <div class="text-center sm:text-left pt-2">
            <h5 class="text-xl font-bold text-gray-900 mb-1">{{ userProfile.nama }}</h5>
            <p class="text-gray-600 text-sm mb-2">NIP/Nomor Induk: {{ userProfile.nomorInduk }}</p>
            <!-- Badge Role -->
            <span class="inline-block bg-[#3B6A96] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {{ userProfile.role }}
            </span>
          </div>
        </div>

        <!-- Bagian Form Informasi Pribadi (Dirapikan agar tidak tabrakan/overlap) -->
        <div>
          <h6 class="text-md font-bold text-gray-800 mb-4">Informasi Pribadi</h6>
          
          <div class="space-y-4">
            <!-- Row Nama Lengkap -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label class="w-full sm:w-1/3 text-gray-700 font-medium text-sm sm:text-base">Nama Lengkap</label>
              <div class="w-full sm:w-2/3">
                <input 
                  type="text" 
                  :value="userProfile.nama" 
                  disabled 
                  class="w-full rounded-full bg-white border border-gray-300 py-2.5 px-5 text-gray-700 outline-none cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <!-- Row NIP / Nomor Induk -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label class="w-full sm:w-1/3 text-gray-700 font-medium text-sm sm:text-base">NIP / Nomor Induk</label>
              <div class="w-full sm:w-2/3">
                <input 
                  type="text" 
                  :value="userProfile.nomorInduk" 
                  disabled 
                  class="w-full rounded-full bg-white border border-gray-300 py-2.5 px-5 text-gray-700 outline-none cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <!-- Row Email Sekolah / User -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label class="w-full sm:w-1/3 text-gray-700 font-medium text-sm sm:text-base">Email Sekolah</label>
              <div class="w-full sm:w-2/3">
                <input 
                  type="text" 
                  :value="userProfile.email" 
                  disabled 
                  class="w-full rounded-full bg-white border border-gray-300 py-2.5 px-5 text-gray-700 outline-none cursor-not-allowed font-medium"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { reactive } from 'vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

// Mengambil data secara dinamis dari localStorage hasil login Lumen sebelumnya
const userProfile = reactive({
  nama: localStorage.getItem('user_name') || 'Nama Pengguna',
  role: localStorage.getItem('user_role') || 'GURU',
  // Sebagai cadangan jika data nomor_induk / email belum sempat Anda simpan di Login.vue:
  nomorInduk: localStorage.getItem('user_nomor_induk') || '198701022015031002',
  email: localStorage.getItem('user_email') || 'budi.guru@sdngalunggung.sch.id'
})

// Fungsi pembuat inisial huruf otomatis (Contoh: "Budi, S.Pd" -> "BS")
const getInisial = (nama) => {
  if (!nama) return ''
  return nama.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}
</script>

<style scoped>
/* Menghilangkan style default tombol/input jika ada tabrakan global */
input:disabled {
  opacity: 0.9;
}
</style>