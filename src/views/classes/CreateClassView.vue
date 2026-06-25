<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto p-6">
      <div class="flex items-center gap-2 mb-6 text-gray-600">
        <router-link :to="{ name: 'teacher-class' }" class="hover:text-blue-600">Kelas saya</router-link>
        <span>/</span>
        <span class="font-bold text-gray-800">Buat Kelas</span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 class="text-lg font-bold text-gray-800 mb-6">Informasi Kelas</h2>
          
          <form @submit.prevent="submitClass">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Mata Pelajaran</label>
              <input v-model="form.nama_kelas" type="text" class="w-full p-3 bg-gray-50 rounded-lg border border-gray-300" required>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
              <input v-model="form.class_level" type="text" placeholder="Contoh: 7A" class="w-full p-3 bg-gray-50 rounded-lg border border-gray-300" required>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kelas</label>
              <textarea v-model="form.deskripsi" rows="3" class="w-full p-3 bg-gray-50 rounded-lg border border-gray-300"></textarea>
            </div>

            <button type="submit" class="w-full bg-[#4A86A8] hover:bg-[#3d718e] text-white py-3 rounded-lg font-bold transition">
              Buat
            </button>
          </form>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center items-center">
          <p class="text-sm text-gray-500 mb-2">Kode Kelas (Dibuat Otomatis)</p>
          <div class="w-full py-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex justify-center items-center">
            <span class="text-3xl font-black text-gray-500 tracking-widest uppercase">
              {{ generatedCode || 'XXXXXX' }}
            </span>
          </div>
          <p class="mt-4 text-xs text-gray-400 text-center">Kode ini akan muncul setelah kelas dibuat.</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios'

// 1. INISIALISASI (Definisikan variabel di atas)
const router = useRouter()
const generatedCode = ref('')

const form = ref({
  nama_kelas: '',
  class_level: '',
  deskripsi: ''
})

// 2. FUNGSI (Logika baru berjalan saat tombol diklik)
const submitClass = async () => {
  try {
    // Pastikan ini ada DI DALAM fungsi, bukan di luar
    const response = await apiClient.post('/kelas', form.value)

    generatedCode.value = response.data.data.kode_kelas;

    router.push({ name: 'teacher-class' });
    alert('Kelas berhasil dibuat!')
  } catch (error) {
    // Ini akan menampilkan alasan kenapa gagal di console
    console.error('Error detail:', error.response?.data)
    alert('Gagal: ' + (error.response?.data?.message || 'Periksa Console'))
  }
}
</script>