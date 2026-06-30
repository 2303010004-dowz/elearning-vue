<template>
  <DashboardLayout>
    <div class="max-w-5xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Tugas Saya</h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-[#E5E5E5] p-6 rounded-xl shadow-sm">
          <h2 class="text-4xl font-bold text-gray-700 mb-1">{{ totalTugas }}</h2>
          <p class="text-gray-500 font-medium">Total Tugas</p>
        </div>
        
        <div class="bg-[#E5E5E5] p-6 rounded-xl shadow-sm">
          <h2 class="text-4xl font-bold text-[#D35454] mb-1">{{ tugasBelum }}</h2>
          <p class="text-gray-500 font-medium">Tugas Belum</p>
        </div>
        
        <div class="bg-[#E5E5E5] p-6 rounded-xl shadow-sm">
          <h2 class="text-4xl font-bold text-[#4CAF50] mb-1">{{ tugasSudah }}</h2>
          <p class="text-gray-500 font-medium">Tugas Sudah</p>
        </div>
      </div>

      <h2 class="text-lg font-semibold text-gray-800 mb-4">Semua Tugas</h2>

      <div v-if="daftarTugas.length === 0" class="w-100 p-6 text-center bg-[#E5E5E5] rounded-2xl">
        <p class="text-gray-500 italic mb-0">Hore! Belum ada tugas saat ini.</p>
      </div>

      <div v-else class="space-y-6">
        <div 
          v-for="tugas in daftarTugas" 
          :key="tugas.id"
          class="bg-[#E5E5E5] p-6 rounded-xl shadow-sm flex flex-col"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 
                @click="openTugas(tugas.id)"
                class="text-xl font-bold cursor-pointer transition-colors"
                :class="tugas.status === 'Selesai' ? 'text-gray-700' : 'text-[#1976D2] hover:underline'"
              >
                {{ tugas.judul_tugas }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ tugas.nama_kelas || 'Nama Kelas' }} • {{ tugas.nama_guru || 'Guru Pengajar' }}
              </p>
            </div>

            <div 
              :class="tugas.status === 'Selesai' ? 'bg-[#D4D4D4] text-gray-600 italic' : 'bg-[#4A86A8] text-white'"
              class="px-4 py-1.5 rounded-full text-sm font-medium"
            >
              {{ tugas.status === 'Selesai' ? 'Dikumpulkan' : formatTanggalBatas(tugas.deadline) }}
            </div>
          </div>

          <p class="text-sm text-gray-600 truncate mb-4">{{ tugas.deskripsi || 'Tidak ada deskripsi.' }}</p>

          <hr class="border-gray-300 mb-4">

          <div>
            <button 
              @click="openTugas(tugas.kelas_id)"
              class="bg-[#A3A3A3] hover:bg-gray-500 text-gray-800 hover:text-white px-6 py-2 rounded-full font-medium transition-colors text-sm"
            >
              {{ tugas.status === 'Selesai' ? 'Lihat Tugas' : 'Kumpulkan' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios.js' 

const router = useRouter()

// ==========================================
// STATE & COMPUTED PROPERTIES
// ==========================================
const daftarTugas = ref([])

// Menghitung angka untuk kartu ringkasan di atas (berdasarkan properti tugas.status)
const totalTugas = computed(() => daftarTugas.value.length)
const tugasSudah = computed(() => daftarTugas.value.filter(tugas => tugas.status === 'Selesai').length)
const tugasBelum = computed(() => totalTugas.value - tugasSudah.value)

// ==========================================
// FUNGSI UTAMA
// ==========================================

// Navigasi masuk ke detail tugas
const openTugas = (kelasId) => {
  router.push({ name: 'class-detail', params: { classId: kelasId } }) 
}

// Ambil data daftar tugas dari API Lumen
const fetchTugasData = async () => {
  try {
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

// Helper: Memformat teks tenggat waktu di badge
const formatTanggalBatas = (dateString) => {
  if (!dateString) return 'Tidak ada tenggat'
  
  const deadlineDate = new Date(dateString)
  const today = new Date()
  
  const options = { day: 'numeric', month: 'short' }
  const formattedDate = deadlineDate.toLocaleDateString('id-ID', options)
  
  const diffTime = deadlineDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays > 0) return `${formattedDate} - ${diffDays} hari lagi`
  if (diffDays === 0) return `${formattedDate} - Hari ini`
  return `Terlambat`
}

onMounted(() => {
  fetchTugasData()
})
</script>