<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-sm">
      <h1 class="text-xl font-bold text-gray-800 mb-6">Buat Tugas Baru</h1>

      <form @submit.prevent="submitTugas">
        <!-- Pilih Kelas (Sekarang terhubung ke data API) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Kelas</label>
          <select v-model="form.kelas_id" class="w-full p-3 bg-gray-100 rounded-lg border border-gray-300" required>
            <option value="" disabled>Pilih Kelas</option>
            <option v-for="c in kelasList" :key="c.id" :value="c.id">
              {{ c.nama_kelas }}
            </option>
          </select>
        </div>

        <!-- Judul Tugas -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Judul Tugas</label>
          <input v-model="form.judul_tugas" type="text" class="w-full p-3 bg-gray-100 rounded-lg border border-gray-300" required>
        </div>

        <!-- Deskripsi -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Tugas</label>
          <textarea v-model="form.deskripsi" rows="4" class="w-full p-3 bg-gray-100 rounded-lg border border-gray-300" required></textarea>
        </div>

        <!-- Tenggat -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tenggat Waktu</label>
          <input type="date" v-model="form.deadline" class="w-full p-3 bg-gray-100 rounded-lg border border-gray-300" required>
        </div>

        <!-- Lampiran -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Lampiran (opsional)</label>
          <input type="file" @change="handleFileUpload" class="w-full p-3 bg-gray-100 rounded-lg border border-gray-300">
        </div>

        <div class="flex gap-4 mt-6">
          <button type="button" class="flex-1 bg-gray-500 text-white py-3 rounded-lg font-bold">Simpan Draft</button>
          <button type="submit" class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold">Publikasikan Tugas</button>
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios'

const router = useRouter()
const file = ref(null)
const kelasList = ref([]) // Data kelas diambil dari API

const form = ref({
  kelas_id: '',
  judul_tugas: '',
  deskripsi: '',
  deadline: ''
})

// Mengambil data kelas saat halaman dimuat
const fetchClasses = async () => {
  try {
    const res = await apiClient.get('/kelas')
    kelasList.value = res.data.data 
  } catch (err) { 
    console.error('Gagal mengambil data kelas:', err) 
  }
}

const handleFileUpload = (event) => {
  file.value = event.target.files[0]
}

const submitTugas = async () => {
  const formData = new FormData()
  formData.append('kelas_id', form.value.kelas_id)
  formData.append('judul_tugas', form.value.judul_tugas)
  formData.append('deskripsi', form.value.deskripsi)
  formData.append('deadline', form.value.deadline)
  
  if (file.value) {
    formData.append('lampiran_file', file.value)
  }

  try {
    await apiClient.post('/tugas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    alert('Tugas berhasil dipublikasikan!')
    router.push({ name: 'grading' })
  } catch (error) {
    if (error.response?.status === 422) {
      alert('Gagal: Periksa kembali inputan Anda.')
    } else {
      alert('Terjadi kesalahan pada server.')
    }
  }
}

onMounted(fetchClasses)
</script>