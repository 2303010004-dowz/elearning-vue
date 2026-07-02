<template>
  <DashboardLayout>
    <!-- Bagian Judul dan Tombol Gabung Kelas -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Kelas saya</h1>
      
      <!-- Tombol Gabung Kelas dengan Ikon -->
      <button 
        @click="showJoinModal = true" 
        class="bg-[#1e293b] text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all duration-200 shadow-sm"
      >
        <span class="text-lg leading-none">+</span> Gabung Kelas
      </button>
    </div>

    <!-- Tampilan jika siswa belum mengikuti kelas -->
    <div v-if="kelasDiikuti.length === 0" class="w-100 p-10 text-center bg-gray-100 border border-gray-200 rounded-2xl">
      <p class="text-gray-500 italic mb-0">Belum ada kelas yang diikuti. Klik "Gabung Kelas" untuk memulai.</p>
    </div>

    <!-- Grid daftar kelas asli database -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="kelas in kelasDiikuti" 
        :key="kelas.id" 
        @click="openClass(kelas.id)" 
        class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm flex flex-col cursor-pointer hover:shadow-md hover:bg-gray-300 transition-all duration-200"
      >
        <div class="bg-gray-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg w-fit mb-4 tracking-wider">
          {{ kelas.kode_kelas ? kelas.kode_kelas.substring(0, 3).toUpperCase() : 'CLS' }}
        </div>
        
        <h2 class="text-lg font-bold text-gray-800 mb-1">{{ kelas.nama_kelas }}</h2>
        <p class="text-sm text-gray-600 mb-6 flex-grow">{{ kelas.deskripsi || 'Tidak ada deskripsi kelas.' }}</p>
        
        <div class="mt-auto border-t border-gray-400 pt-4 text-sm text-gray-700 space-y-2">
          <p>🔑 Kode Akses: <span class="font-mono font-bold">{{ kelas.kode_kelas }}</span></p>
          <p>📅 Terdaftar: {{ kelas.kelas_dibuat ? new Date(kelas.kelas_dibuat).toLocaleDateString('id-ID') : '-' }}</p>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL (POP-UP) GABUNG KELAS                -->
    <!-- ========================================== -->
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
          placeholder="Contoh: 4LCYRA" 
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
import Swal from 'sweetalert2' // Menggunakan SweetAlert agar notifikasinya cantik

const router = useRouter()

const kelasDiikuti = ref([])
const showJoinModal = ref(false) 
const kodeKelas = ref('')        

const openClass = (id) => {
  router.push({ name: 'class-detail', params: { classId: id } })
}

const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem('token_jwt')
    const res = await apiClient.get('/kelas/joined', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (res.data && res.data.data) {
      kelasDiikuti.value = res.data.data
    } else if (Array.isArray(res.data)) {
      kelasDiikuti.value = res.data
    } else {
      kelasDiikuti.value = []
    }
  } catch (err) {
    console.error('Gagal memuat data kelas dari backend:', err)
  }
}

const joinKelas = async () => {
  if (!kodeKelas.value) {
    Swal.fire('Oops!', 'Masukkan kode kelas terlebih dahulu!', 'warning')
    return
  }
  
  try {
    const token = localStorage.getItem('token_jwt')
    // Sesuai dengan route kodinganmu
    const response = await apiClient.post('/kelas/joined', 
      { kode_kelas: kodeKelas.value.trim().toUpperCase() },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    
    const successMsg = response.data.message || 'Berhasil bergabung ke kelas!'
    Swal.fire('Berhasil!', successMsg, 'success')
    
    showJoinModal.value = false
    kodeKelas.value = ''
    fetchDashboardData() 
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Gagal bergabung ke kelas. Periksa kembali kode Anda.'
    Swal.fire('Gagal', errorMsg, 'error')
  }
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