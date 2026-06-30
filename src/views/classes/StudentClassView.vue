<template>
  <DashboardLayout>
    <!-- Bagian Judul dan Tombol Gabung Kelas -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Kelas saya</h1>
      
      <!-- Tombol Gabung Kelas dengan Ikon -->
      <button 
        @click="showJoinModal = true" 
        class="bg-[#1e293b] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all duration-200 shadow-sm"
      >
        <span class="text-lg">+</span> Gabung Kelas
      </button>
    </div>

    <!-- Tampilan jika siswa belum mengikuti kelas -->
    <div v-if="kelasDiikuti.length === 0" class="w-100 p-6 text-center bg-gray-100 rounded-2xl">
      <p class="text-gray-500 italic mb-0">Belum ada kelas yang diikuti.</p>
    </div>

    <!-- Grid daftar kelas asli database -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="kelas in kelasDiikuti" 
        :key="kelas.id" 
        @click="openClass(kelas.id)" 
        class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm flex flex-col cursor-pointer hover:bg-gray-300 transition-all duration-200"
      >
        <div class="bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded w-fit mb-4">
          {{ kelas.kode_kelas ? kelas.kode_kelas.substring(0, 3).toUpperCase() : 'CLS' }}
        </div>
        
        <h2 class="text-lg font-bold text-gray-800 mb-1">{{ kelas.nama_kelas }}</h2>
        <p class="text-sm text-gray-600 mb-6">{{ kelas.deskripsi || 'Tidak ada deskripsi kelas.' }}</p>
        
        <div class="mt-auto border-t border-gray-400 pt-4 text-sm text-gray-700 space-y-2">
          <p>🔑 Kode Akses: <span class="font-mono font-bold">{{ kelas.kode_kelas }}</span></p>
          <p>📅 Terdaftar: {{ kelas.kelas_dibuat ? new Date(kelas.kelas_dibuat).toLocaleDateString('id-ID') : '-' }}</p>
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

// --- 1. STATE REAKTIF YANG DILENGKAPI ---
const kelasDiikuti = ref([])
const showJoinModal = ref(false) // Mengontrol buka-tutup modal pop-up
const kodeKelas = ref('')        // Menampung input kode kelas dari siswa

// Fungsi navigasi masuk ke detail kelas menggunakan ID
const openClass = (id) => {
  router.push({ name: 'class-detail', params: { classId: id } })
}

// Fungsi membuka modal saat tombol "+ Gabung Kelas" diklik
const handleJoinClick = () => {
  showJoinModal.value = true
}

// --- 2. NOTIFIKASI SEDERHANA (Jika belum pakai library, gunakan alert bawaan dulu) ---
const showNotification = (message, type) => {
  // Kamu bisa mengganti ini nanti dengan Toast/SweetAlert jika ada
  alert(`[${type.toUpperCase()}] ${message}`)
}

// Fungsi integrasi untuk mengambil data dari endpoint /kelas/diikuti
const fetchDashboardData = async () => {
  try {
    const res = await apiClient.get('/kelas/joined')
    
    if (res.data && res.data.data) {
      kelasDiikuti.value = res.data.data
    } else if (Array.isArray(res.data)) {
      kelasDiikuti.value = res.data
    } else {
      kelasDiikuti.value = []
    }
    
    console.log("Data kelas asli berhasil dimuat:", kelasDiikuti.value)
    
  } catch (err) {
    console.error('Gagal memuat data kelas dari backend:', err)
  }
}

onMounted(() => {
  fetchDashboardData()
})

// --- 3. FUNGSI GABUNG KELAS ---
const joinKelas = async () => {
  if (!kodeKelas.value) {
    showNotification('Masukkan kode kelas terlebih dahulu!', 'error')
    return
  }
  
  try {
    // Menembak POST ke /kelas/join sesuai dengan route Lumen temanmu
    const response = await apiClient.post('/kelas/joined', { 
      kode_kelas: kodeKelas.value.trim().toUpperCase() // Menghapus spasi tidak sengaja & paksa kapital
    })
    
    const successMsg = response.data.message || 'Berhasil bergabung ke kelas!'
    showNotification(successMsg, 'success')
    
    showJoinModal.value = false
    kodeKelas.value = ''
    fetchDashboardData() // Memuat ulang daftar kelas secara otomatis agar langsung muncul di dashboard
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Gagal bergabung ke kelas'
    showNotification(errorMsg, 'error')
  }
}
</script>
<style scoped>
/* Animasi Transisi Halus untuk Toast Notification */
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>