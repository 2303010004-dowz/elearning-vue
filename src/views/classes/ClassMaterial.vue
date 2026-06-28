<template>
  <div class="flex min-h-screen bg-[#F3F3F3] font-sans text-gray-800">
    <main class="flex-1 p-8">
      <!-- Header Navigasi -->
      <div class="mb-8">
        <button @click="$router.back()" class="flex items-center text-gray-600 mb-4 hover:text-gray-900">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Kembali
        </button>
        <!-- Nama kelas dinamis diambil dari state detailKelas -->
        <h1 class="text-2xl font-bold text-gray-800">
          Kelas saya <span class="text-gray-500 font-normal">{{ detailKelas.nama_kelas || 'Memuat...' }}</span>
        </h1>
      </div>

      <!-- Tabs Navigasi Dinamis -->
      <div class="border-b border-gray-300 mb-6 flex gap-8">
        <button 
          @click="activeTab = 'materi'" 
          :class="activeTab === 'materi' ? 'border-b-2 border-gray-800 font-bold text-gray-900' : 'text-gray-500 hover:text-gray-800'"
          class="pb-3"
        >
          Materi
        </button>
        <button 
          @click="activeTab = 'tugas'" 
          :class="activeTab === 'tugas' ? 'border-b-2 border-gray-800 font-bold text-gray-900' : 'text-gray-500 hover:text-gray-800'"
          class="pb-3"
        >
          Tugas
        </button>
      </div>

      <!-- KONTEN UNTUK TAB MATERI -->
      <div v-if="activeTab === 'materi'" class="space-y-4">
        <!-- Jika materi belum ada -->
        <div v-if="materiList.length === 0" class="text-gray-500 italic p-4 bg-gray-200 rounded-xl w-fit">
          Belum ada materi yang dibagikan di kelas ini.
        </div>

        <!-- Perulangan materi dari database -->
        <div 
          v-else
          v-for="item in materiList" 
          :key="item.id" 
          @click="downloadMateri(item.file_path)"
          class="bg-[#D9D9D9] p-4 rounded-xl flex items-center gap-4 w-full md:w-96 hover:bg-gray-300 transition cursor-pointer"
        >
          <div class="bg-gray-600 text-white px-3 py-2 rounded text-xs font-bold">
            {{ item.tipe_file || 'PDF' }}
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-800">{{ item.judul_materi }}</h4>
            <p class="text-xs text-gray-600">
              {{ item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Baru saja' }}
            </p>
          </div>
        </div>
      </div>

      <!-- KONTEN UNTUK TAB TUGAS -->
      <div v-if="activeTab === 'tugas'" class="space-y-4">
        <p class="text-sm text-gray-600">Daftar tugas khusus kelas ini akan tampil di sini.</p>
        <!-- Integrasi loop tugas kelas bisa kamu pasang di sini nanti -->
      </div>

      <!-- Floating Action Button (Forum Diskusi) -->
      <div class="fixed bottom-8 right-8">
        <div class="bg-gray-700 p-4 rounded-lg shadow-lg text-white cursor-pointer hover:bg-gray-800 transition">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4-4-4H4a2 2 0 01-2-2V5z" />
          </svg>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '@/axios.js' // Import Axios Instance milikmu

const route = useRoute()

// State Data
const detailKelas = ref({})
const materiList = ref([])
const activeTab = ref('materi') // State untuk mengontrol tab aktif

// Mengambil ID Kelas dari parameter URL router (sesuai 'classId' dari halaman sebelumnya)
const classId = route.params.classId 

const fetchDetailKelas = async () => {
  try {
    // Menembak endpoint detail kelas berdasarkan ID
    const res = await apiClient.get(`/kelas/${classId}`)
    
    if (res.data && res.data.data) {
      detailKelas.value = res.data.data
      // Jika di dalam response detail kelas sudah include array materi:
      materiList.value = res.data.data.materi || []
    } else {
      detailKelas.value = res.data
    }
  } catch (err) {
    console.error('Gagal memuat detail kelas:', err)
  }
}

// Fungsi jika baris materi diklik (Bisa diarahkan ke URL file asli dari backend Laragon)
const downloadMateri = (filePath) => {
  if (!filePath) return
  // Redirect ke path file di backend
  window.open(`http://192.168.33.104:8000/storage/${filePath}`, '_blank')
}

onMounted(() => {
  if (classId) {
    fetchDetailKelas()
  }
})
</script>