<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-sm">
      <h1 class="text-xl font-bold text-gray-800 mb-6">Buat Tugas Baru</h1>

      <form @submit.prevent="submitTask">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Pelajaran</label>
          <select v-model="form.class_id" class="w-full p-3 bg-gray-100 rounded-lg border border-gray-300" required>
            <option value="" disabled>Pilih Pelajaran</option>
            <option v-for="c in classOptions" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Tugas</label>
          <textarea v-model="form.description" rows="4" class="w-full p-3 bg-gray-100 rounded-lg border border-gray-300" required></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tenggat Waktu</label>
          <input type="date" v-model="form.deadline" class="w-full p-3 bg-gray-100 rounded-lg border border-gray-300" required>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Lampiran (opsional)</label>
          <input 
            type="file" 
            @change="handleFileUpload" 
            class="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          >
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios'

const router = useRouter()
const file = ref(null)

const form = ref({
  class_id: '',
  description: '',
  deadline: ''
})

const classOptions = ref([
  { id: 1, name: 'Bahasa Indonesia - 7A' },
  { id: 2, name: 'Bahasa Indonesia - 7B' },
  { id: 3, name: 'Bahasa Indonesia - 7C' }
])

const handleFileUpload = (event) => {
  file.value = event.target.files[0]
}

const submitTask = async () => {
  // Menggunakan FormData untuk mendukung pengiriman file
  const formData = new FormData()
  formData.append('class_id', form.value.class_id)
  formData.append('description', form.value.description)
  formData.append('deadline', form.value.deadline)
  if (file.value) {
    formData.append('attachment', file.value)
  }

  try {
    await apiClient.post('/tasks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    alert('Tugas berhasil dipublikasikan!')
    router.push({ name: 'teacher-class' })
  } catch (error) {
    console.error('Error:', error)
    alert('Gagal menyimpan tugas.')
  }
}
</script>