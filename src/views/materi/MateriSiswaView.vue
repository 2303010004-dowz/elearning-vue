<template>
  <DashboardLayout>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Materi Pembelajaran</h1>
      <p class="text-sm text-gray-600 mt-1">Semua materi dari kelas yang Anda ikuti ada di sini.</p>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <p class="text-gray-500 italic font-medium animate-pulse">Memuat materi Anda...</p>
    </div>

    <div v-else>
      <div v-if="materiList.length === 0" class="text-center py-12 bg-[#EBEBEB] rounded-[15px] border border-gray-300">
        <p class="text-gray-500 italic">Belum ada materi dari kelas yang Anda ikuti.</p>
        <button @click="router.push({ name: 'student-class' })" class="mt-4 text-[#4A86A8] font-bold hover:underline">
          Cek daftar kelas saya
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="materi in materiList" 
          :key="materi.id"
          class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col h-full"
        >
          <div class="flex justify-between items-start mb-4">
            <span class="bg-[#1e293b] text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
              {{ materi.nama_kelas || 'KELAS' }}
            </span>
            <span class="text-xs text-gray-400 font-medium">{{ formatTanggal(materi.created_at) }}</span>
          </div>
          
          <div class="flex gap-4 items-start mb-2">
            <div class="bg-[#4A86A8] text-white font-bold rounded-lg w-10 h-10 flex items-center justify-center shrink-0 mt-1 text-xs">
              FILE
            </div>
            <div>
              <h3 class="font-bold text-gray-800 text-lg leading-tight">{{ materi.judul_materi }}</h3>
            </div>
          </div>
          
          <p class="text-sm text-gray-600 line-clamp-3 mb-6 mt-2 flex-grow">{{ materi.isi_materi || 'Tidak ada deskripsi/instruksi tambahan.' }}</p>
          
          <div class="flex justify-between items-center mt-auto border-t border-gray-100 pt-4">
            <span class="text-xs font-medium text-gray-500 truncate w-2/3" :title="materi.lampiran_file">
              📄 {{ formatNamaFile(materi.lampiran_file) }}
            </span>
            <button 
              @click="bukaFile(materi.lampiran_file)" 
              class="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-4 py-2 rounded-lg font-bold transition border border-gray-200"
            >
              Buka File
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios'

const router = useRouter()
const isLoading = ref(true)
const materiList = ref([])

const fetchSemuaMateriSiswa = async () => {
  isLoading.value = true
  materiList.value = []
  try {
    const token = localStorage.getItem('token_jwt')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    // 1. Ambil daftar kelas yang diikuti siswa ini
    const resKelas = await apiClient.get('/kelas/joined', config)
    const listKelas = resKelas.data.data || resKelas.data || []

    let semuaMateri = []
    
    // 2. Loop setiap kelas untuk mengambil materinya
    for (const kelas of listKelas) {
      try {
        const resMateri = await apiClient.get(`/kelas/${kelas.id}/materi`, config)
        const dataMateri = resMateri.data.data || resMateri.data || []
        
        // Sisipkan nama kelas agar tampil di card materi
        const materiDenganKelas = dataMateri.map(m => ({
          ...m,
          nama_kelas: kelas.nama_kelas
        }))
        
        semuaMateri = [...semuaMateri, ...materiDenganKelas]
      } catch (err) {
        console.error(`Gagal memuat materi untuk kelas ${kelas.id}:`, err)
      }
    }
    
    // 3. Urutkan berdasarkan yang terbaru
    materiList.value = semuaMateri.sort((a, b) => b.id - a.id)

  } catch (error) {
    console.error('Gagal mengambil data kelas/materi:', error)
  } finally {
    isLoading.value = false
  }
}

const bukaFile = (namaFile) => {
  if (!namaFile) return
  window.open(`http://192.168.1.10:8000/uploads/materi/${namaFile}`, '_blank')
}

const formatNamaFile = (path) => {
  if (!path) return 'File'
  const parts = path.split('/')
  return parts[parts.length - 1]
}

const formatTanggal = (dateString) => {
  if (!dateString) return '-'
  const tgl = new Date(dateString)
  return tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => {
  fetchSemuaMateriSiswa()
})
</script>