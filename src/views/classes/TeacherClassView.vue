<template>
  <DashboardLayout>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Kelas saya</h1>
      </div>
      <button 
        @click="router.push({ name: 'create-class' })" 
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
    {{ kelas.nama_kelas }} </span>
  
  <h3 class="text-xl font-bold text-gray-800 mb-2">{{ kelas.nama_kelas }}</h3>
  <p class="text-sm text-gray-600 mb-1">👤 0 Siswa</p>
  <p class="text-sm text-gray-600 mb-6"> Kode: <span class="font-bold text-gray-800">{{ kelas.kode_kelas }}</span></p>

  <hr class="border-gray-400 mb-4">

  <div class="text-sm text-gray-600 space-y-2">
    <p>☰ 0 Materi tersedia</p>
    <p>🕒 {{ kelas.deskripsi }}</p>
  </div>
</div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue' // Tambahkan onMounted
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios' // Pastikan sudah import

const router = useRouter()
const kelasList = ref([]) // Inisialisasi kosong

const fetchClasses = async () => {
  try {
    const response = await apiClient.get('/kelas') // Memanggil fungsi index di Controller
    kelasList.value = response.data.data // Mengisi kelasList dengan data asli
  } catch (error) {
    console.error('Gagal mengambil data:', error)
  }
}

onMounted(() => {
  fetchClasses() // Jalankan saat halaman dibuka
})
</script>