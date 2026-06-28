<template>
  <DashboardLayout>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Tugas Saya</h1>
    </div>

    <div v-if="daftarTugas.length === 0" class="w-100 p-6 text-center bg-gray-100 rounded-2xl">
      <p class="text-gray-500 italic mb-0">Hore! Belum ada tugas saat ini.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="tugas in daftarTugas" 
        :key="tugas.id" 
        @click="openTugas(tugas.id)" 
        class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm flex flex-col cursor-pointer hover:bg-gray-300 transition-all duration-200"
      >
        <div 
          class="text-xs font-bold px-3 py-1 rounded w-fit mb-4 text-white"
          :class="tugas.status === 'Selesai' ? 'bg-green-600' : 'bg-red-600'"
        >
          {{ tugas.status || 'Belum Dikerjakan' }}
        </div>
        
        <h2 class="text-lg font-bold text-gray-800 mb-1">{{ tugas.judul_tugas }}</h2>
        <p class="text-sm text-gray-600 mb-6 truncate">{{ tugas.deskripsi || 'Tidak ada deskripsi.' }}</p>
        
        <div class="mt-auto border-t border-gray-400 pt-4 text-sm text-gray-700 space-y-2">
          <p>📚 Kelas: <span class="font-bold">{{ tugas.nama_kelas || '-' }}</span></p>
          <p class="text-red-600 font-medium">
            ⏰ Tenggat: {{ tugas.deadline ? new Date(tugas.deadline).toLocaleDateString('id-ID') : '-' }}
          </p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios.js' 

const router = useRouter()

// State penampung data tugas
const daftarTugas = ref([])

// Navigasi masuk ke detail/mengerjakan tugas
const openTugas = (id) => {
  // Pastikan di router kamu ada name 'task-detail' atau sesuaikan namanya
  router.push({ name: 'student-tugas', params: { id: id } }) 
}

// Ambil data daftar tugas dari API Lumen
const fetchTugasData = async () => {
  try {
    // INFO UNTUK TEMANMU: Pastikan endpoint URL di bawah ini sesuai dengan yang dibuat di Lumen
    const res = await apiClient.get('/tugas') 
    
    if (res.data && res.data.data) {
      daftarTugas.value = res.data.data
    } else if (Array.isArray(res.data)) {
      daftarTugas.value = res.data
    } else {
      daftarTugas.value = []
    }
  } catch (err) {
    console.error('Gagal memuat data tugas dari backend:', err)
  }
}

onMounted(() => {
  fetchTugasData()
})
</script>