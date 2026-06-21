<template>
  <DashboardLayout>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Kelas saya</h1>
      </div>
      <button 
        @click="router.push('/manage-class/create')" 
        class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition"
      >
        + Buat Kelas
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="kelas in kelasList" 
        :key="kelas.id" 
        class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm hover:shadow-md transition"
      >
        <span class="inline-block bg-gray-500 text-white text-xs px-2 py-1 rounded mb-4">
          {{ kelas.mapel }}
        </span>
        
        <h3 class="text-xl font-bold text-gray-800 mb-2">{{ kelas.nama }}</h3>
        <p class="text-sm text-gray-600 mb-1">👤 {{ kelas.jumlahSiswa }} Siswa</p>
        <p class="text-sm text-gray-600 mb-6"> Kode: <span class="font-bold text-gray-800">{{ kelas.kode }}</span></p>

        <hr class="border-gray-400 mb-4">

        <div class="text-sm text-gray-600 space-y-2">
          <p>☰ {{ kelas.materi }} Materi tersedia</p>
          <p>🕒 {{ kelas.tugas || 'Tidak ada tugas' }}</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

const router = useRouter()

// Data dummy (nanti ini bisa diganti dengan API call)
const kelasList = ref([
  { id: 1, mapel: 'BIN', nama: 'Bahasa Indonesia - 7A', jumlahSiswa: 23, kode: 'MNJH10', materi: 1, tugas: null },
  { id: 2, mapel: 'BIN', nama: 'Bahasa Indonesia - 7B', jumlahSiswa: 23, kode: 'IOGT67', materi: 2, tugas: 'Makalah Bahasa Indonesia' },
  { id: 3, mapel: 'BIN', nama: 'Bahasa Indonesia - 7C', jumlahSiswa: 23, kode: '7HKLAW', materi: 1, tugas: null },
])
</script>