<template>
  <DashboardLayout>
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Selamat datang, {{ namaSiswa }}</h1>
        <p class="text-gray-600 text-sm">Ringkasan Aktivitas kelas hari ini</p>
      </div>
      
      <button 
        @click="showJoinModal = true" 
        class="bg-[#1e293b] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all shadow-sm"
      >
        <span class="text-lg leading-none">+</span> Gabung Kelas
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <p class="text-gray-500 italic font-medium animate-pulse">Memuat data dashboard...</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="p-6 rounded-2xl bg-[#D9D9D9] shadow-sm">
          <h3 class="text-4xl font-bold text-gray-800">{{ kelasDiikuti.length }}</h3>
          <p class="text-gray-600 font-medium text-sm mt-1">Kelas diikuti</p>
        </div>
        
        <div class="p-6 rounded-2xl bg-[#D9D9D9] shadow-sm">
          <h3 class="text-4xl font-bold text-red-600">{{ tugasList.length }}</h3>
          <p class="text-gray-600 font-medium text-sm mt-1">Tugas Belum</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="bg-[#D9D9D9] rounded-2xl p-6 shadow-sm flex flex-col h-full">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold text-gray-800">Kelas saya</h2>
          </div>
          
          <div class="space-y-4 flex-grow">
            <div v-if="kelasDiikuti.length === 0" class="text-sm text-gray-500 italic pb-2">
              Belum ada kelas yang diikuti.
            </div>
            
            <div 
              v-for="kelas in kelasDiikuti.slice(0, 3)" 
              :key="kelas.id" class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm cursor-pointer hover:border-[#4A86A8] transition"
              @click="router.push({ name: 'class-detail', params: { classId: kelas.id } })"
            >
              <h4 class="font-bold text-[1.05rem] text-gray-800 line-clamp-1">{{ kelas.nama_kelas }}</h4>
              <p class="text-sm text-gray-600 mt-2">
                Kode Kelas: <span class="font-bold text-[#4A86A8]">{{ kelas.kode_kelas }}</span>
              </p>
            </div>
          </div>
          
          <div v-if="kelasDiikuti.length > 3" class="mt-4 pt-4 border-t border-gray-400 text-center">
            <button @click="router.push({ name: 'student-class' })" class="text-xs font-bold text-[#4A86A8] hover:underline">
              Lihat semua kelas &rarr;
            </button>
          </div>
        </div>

        <div class="bg-[#D9D9D9] rounded-2xl p-6 shadow-sm flex flex-col h-full">
          <h2 class="text-lg font-bold text-gray-800 mb-6">Tugas Terbaru</h2>
          
          <div class="space-y-4 flex-grow">
            <div v-if="tugasList.length === 0" class="text-sm text-gray-500 italic pb-2">
              Hore! Tidak ada tugas baru.
            </div>

            <div 
              v-for="tugas in tugasList.slice(0, 3)" 
              :key="tugas.id"class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm cursor-pointer hover:border-[#4A86A8] transition"
              @click="router.push({ name: 'class-detail', params: { classId: tugas.kelas_id }, query: { tab: 'tugas', taskId: tugas.id } })"
            >
              <h4 class="font-bold text-[1.05rem] text-gray-800 line-clamp-1">{{ tugas.judul_tugas }}</h4>
              <p class="text-sm text-gray-600 mt-2">
                Tenggat: <span class="font-bold text-red-600">{{ formatTanggal(tugas.deadline) }}</span>
              </p>
            </div>
          </div>

          <div v-if="tugasList.length > 3" class="mt-4 pt-4 border-t border-gray-400 text-center">
            <button @click="router.push({ name: 'student-class' })" class="text-xs font-bold text-[#4A86A8] hover:underline">
              Lihat semua tugas di halaman kelas &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>

    <div v-if="showJoinModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-fade-in-up">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">Gabung Kelas</h2>
          <button @click="showJoinModal = false" class="text-gray-400 hover:text-gray-600 focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <p class="text-sm text-gray-600 mb-6">Mintalah kode kelas kepada guru Anda, lalu masukkan kode tersebut di sini.</p>
        
        <input 
          v-model="kodeKelas" 
          type="text"  
          class="w-full border-2 border-gray-300 rounded-xl px-4 py-3 mb-8 font-mono text-lg uppercase tracking-widest text-center focus:outline-none focus:border-[#4A86A8]"
          @keyup.enter="joinKelas"
        >
        
        <div class="flex justify-end gap-3">
          <button @click="showJoinModal = false" class="px-5 py-2.5 text-gray-600 bg-gray-200 rounded-xl hover:bg-gray-300 font-bold transition">Batal</button>
          <button @click="joinKelas" class="px-6 py-2.5 text-white bg-[#4A86A8] hover:bg-[#3d718e] rounded-xl font-bold transition">Gabung</button>
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
import Swal from 'sweetalert2'

const router = useRouter()
const namaSiswa = ref(localStorage.getItem('user_name') || 'Siswa')

const isLoading = ref(true)
const kelasDiikuti = ref([])
const tugasList = ref([])

// State Modal Gabung Kelas
const showJoinModal = ref(false)
const kodeKelas = ref('')

const fetchDashboardData = async () => {
  isLoading.value = true
  
  try {
    const token = localStorage.getItem('token_jwt')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    // ====================================================
    // 1. AMBIL KELAS YANG DIIKUTI
    // ====================================================
    let listKelas = []
    const resKelas = await apiClient.get('/kelas/joined', config)
    
    if (resKelas.data && Array.isArray(resKelas.data.data)) {
      listKelas = resKelas.data.data
    } else if (Array.isArray(resKelas.data)) {
      listKelas = resKelas.data
    }
    
    kelasDiikuti.value = listKelas

    const idKelasDiikuti = listKelas.map(kelas => kelas.id)

    // ====================================================
    // 2. AMBIL TUGAS 
    // ====================================================
    try {
      const resTugas = await apiClient.get('/tugas', config)
      let semuaTugas = []
      
      if (resTugas.data && Array.isArray(resTugas.data.data)) {
        semuaTugas = resTugas.data.data
      } else if (Array.isArray(resTugas.data)) {
        semuaTugas = resTugas.data
      }
      
      const tugasDisaring = semuaTugas.filter(tugas => idKelasDiikuti.includes(tugas.kelas_id))
      tugasList.value = tugasDisaring.sort((a, b) => b.id - a.id)
      
    } catch (errTugas) {
      console.error("Gagal mengambil data tugas:", errTugas)
    }

  } catch (error) {
    console.error("Gagal mengambil data untuk dashboard:", error)
  } finally {
    isLoading.value = false
  }
}

// Fungsi Gabung Kelas
const joinKelas = async () => {
  if (!kodeKelas.value) {
    Swal.fire('Oops!', 'Masukkan kode kelas terlebih dahulu!', 'warning')
    return
  }
  
  try {
    const token = localStorage.getItem('token_jwt')
    const response = await apiClient.post('/kelas/join', 
      { kode_kelas: kodeKelas.value.trim().toUpperCase() },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    
    Swal.fire('Berhasil!', response.data.message || 'Berhasil bergabung ke kelas!', 'success')
    
    showJoinModal.value = false
    kodeKelas.value = ''
    fetchDashboardData() 
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Gagal bergabung ke kelas. Periksa kembali kode Anda.'
    Swal.fire('Gagal', errorMsg, 'error')
  }
}

const formatTanggal = (dateString) => {
  if (!dateString) return 'Tidak ada'
  const tgl = new Date(dateString)
  return tgl.toLocaleString('sv-SE').replace(',', '') 
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>