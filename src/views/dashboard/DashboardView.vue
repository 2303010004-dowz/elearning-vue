<template>
  <DashboardLayout>
    <!-- Notifikasi Toast Melayang (Kanan Atas) -->
    <div class="fixed top-5 right-5 z-[60] space-y-2 pointer-events-none">
      <Transition name="toast">
        <div 
          v-if="notification.show" 
          :class="[
            'pointer-events-auto px-5 py-3 rounded-xl shadow-lg text-white font-medium flex items-center justify-between gap-4 min-w-[280px] transition-all duration-300',
            notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          ]"
        >
          <span>{{ notification.message }}</span>
          <button @click="notification.show = false" class="text-white/80 hover:text-white text-sm">✕</button>
        </div>
      </Transition>
    </div>

    <!-- Header Dashboard -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Selamat datang, {{ userName }}</h1>
        <p class="text-gray-600 text-sm">Ringkasan Aktivitas kelas hari ini</p>
      </div>
      <!-- Tombol Gabung Kelas -->
      <button 
        @click="showJoinModal = true"
        class="bg-gray-800 text-white px-5 py-2 rounded-xl font-bold hover:bg-gray-700 transition shadow-sm"
      >
        + Gabung Kelas
      </button>
    </div>

    <!-- Ringkasan Statistik -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div 
        @click="router.push({ name: 'student-class' })" 
        class="cursor-pointer p-6 rounded-2xl bg-[#D9D9D9] hover:bg-[#CECECE] shadow-sm transition h-32 flex flex-col justify-center"
      >
        <h3 class="text-4xl font-bold text-gray-800">{{ kelasDiikuti.length }}</h3>
        <p class="text-gray-600 font-medium text-sm mt-1">Kelas diikuti</p>
      </div>
      
      <div 
        @click="router.push({ name: 'student-tasks' })" 
        class="cursor-pointer p-6 rounded-2xl bg-[#D9D9D9] hover:bg-[#CECECE] shadow-sm transition h-32 flex flex-col justify-center"
      >
        <h3 class="text-4xl font-bold text-red-600">{{ tugasBelum.length }}</h3>
        <p class="text-gray-600 font-medium text-sm mt-1">Tugas Belum</p>
      </div>
    </div>

    <!-- Grid Konten Utama -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Daftar Kelas -->
      <div class="bg-[#D9D9D9] rounded-2xl p-6 shadow-sm">
        <h2 class="text-lg font-bold text-gray-800 mb-4">Kelas saya</h2>
        <div class="space-y-4">
          <div 
            v-for="kelas in kelasDiikuti" 
            :key="kelas.id"
            @click="router.push(`/class/${kelas.slug}`)" 
            class="cursor-pointer bg-[#F3F3F3] hover:bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition"
          >
            <h4 class="font-bold text-lg text-gray-800">{{ kelas.nama_kelas }}</h4>
            <p class="text-sm text-gray-500 mt-0.5">{{ kelas.nama_guru }}</p>
          </div>
          <p v-if="kelasDiikuti.length === 0" class="text-gray-500 text-sm italic">Belum ada kelas yang diikuti.</p>
        </div>
      </div>

      <!-- Daftar Tugas -->
      <div class="bg-[#D9D9D9] rounded-2xl p-6 shadow-sm">
        <h2 class="text-lg font-bold text-gray-800 mb-4">Tugas</h2>
        <div class="space-y-4">
          <div 
            v-for="tugas in tugasBelum" 
            :key="tugas.id"
            class="bg-[#F3F3F3] p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <h4 class="font-bold text-lg text-gray-800">{{ tugas.judul_tugas }}</h4>
            <p class="text-sm text-gray-600 mt-1">Tenggat: {{ tugas.deadline }}</p>
          </div>
          <p v-if="tugasBelum.length === 0" class="text-gray-500 text-sm italic">Tidak ada tugas saat ini.</p>
        </div>
      </div>
    </div>

    <!-- Pop-up Modal Gabung Kelas (Tailwind Backdrop Blur Fix) -->
    <div 
      v-if="showJoinModal" 
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all"
    >
      <div class="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl scale-100 transition-transform">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Gabung ke Kelas</h3>
        <input 
          v-model="kodeKelas" 
          type="text" 
          placeholder="MASUKKAN KODE KELAS" 
          class="w-full border-2 border-gray-200 p-3 rounded-xl mb-5 text-center text-sm font-semibold uppercase tracking-widest focus:outline-none focus:border-gray-500 transition-colors"
          @keyup.enter="joinKelas"
        />
        <div class="flex justify-end gap-3">
          <button 
            @click="showJoinModal = false" 
            class="px-4 py-2 text-gray-500 hover:text-gray-800 font-medium transition-colors"
          >
            Batal
          </button>
          <button 
            @click="joinKelas" 
            class="px-5 py-2 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors shadow-sm"
          >
            Gabung
          </button>
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
const userName = ref('')
const kelasDiikuti = ref([])
const tugasBelum = ref([])
const showJoinModal = ref(false)
const kodeKelas = ref('')

// State Notifikasi Toast Melayang
const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

const showNotification = (message, type = 'success') => {
  notification.value.message = message
  notification.value.type = type
  notification.value.show = true
  
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const fetchDashboardData = async () => {
  try {
    userName.value = localStorage.getItem('user_name') || 'Siswa'
    
    // Tembak GET ke /kelas/join sesuai instruksi teman backend kamu
    const res = await apiClient.get('/kelas/joined')
    
    // Cek struktur data yang dikembalikan Lumen
    if (Array.isArray(res.data)) {
      kelasDiikuti.value = res.data
    } else if (res.data.data && Array.isArray(res.data.data)) {
      kelasDiikuti.value = res.data.data
    } else {
      // Antisipasi kalau dibungkus key 'kelas' atau 'classes'
      kelasDiikuti.value = res.data.kelas || res.data.classes || []
    }
    
    console.log("Daftar Kelas Siswa:", res.data)
  } catch (err) {
    console.error('Gagal mengambil daftar kelas dari /kelas/joined:', err)
  }
}

const joinKelas = async () => {
  if (!kodeKelas.value) {
    showNotification('Masukkan kode kelas terlebih dahulu!', 'error')
    return
  }
  
  try {
    // Menyesuaikan payload request ke backend Lumen Anda
    // Pastikan key 'kode_kelas' atau 'kode' sesuai dengan parameter di Lumen Controller Anda
    const response = await apiClient.post('/kelas/join', { 
      kode_kelas: kodeKelas.value.toUpperCase() // Otomatis dipaksa huruf besar sebelum dikirim
    })
    
    // Menyesuaikan pembacaan response sukses dari backend
    const successMsg = response.data.message || 'Berhasil bergabung ke kelas!'
    showNotification(successMsg, 'success')
    
    showJoinModal.value = false
    kodeKelas.value = ''
    fetchDashboardData() // Refresh data otomatis setelah sukses
  } catch (err) {
    // Menyesuaikan pembacaan response error dari Lumen
    // Biasanya Lumen mengembalikan error di err.response.data.message atau err.response.data.error
    const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Gagal bergabung ke kelas'
    showNotification(errorMsg, 'error')
  }
}

onMounted(fetchDashboardData)
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