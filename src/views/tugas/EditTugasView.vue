<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-sm">
      <h1 class="text-xl font-bold text-gray-800 mb-6">Edit Tugas</h1>

      <form @submit.prevent="updateTugas">
        <!-- Pilih Kelas -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Kelas</label>
          <select v-model="form.kelas_id" class="w-full p-3 bg-gray-100 rounded-lg border border-gray-300" required>
            <option value="" disabled>Pilih Kelas</option>
            <option v-for="c in classOptions" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <!-- Judul -->
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
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tenggat Waktu</label>
          <input type="date" v-model="form.deadline" class="w-full p-3 bg-gray-100 rounded-lg border border-gray-300" required>
        </div>

        <!-- Tambahkan ini di dalam form, misalnya sebelum tombol Simpan -->
        <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">Ganti Lampiran File (Opsional)</label>
        <input type="file" @change="handleFileUpload" class="w-full p-2 bg-gray-100 rounded-lg border border-gray-300">
        <p class="text-xs text-gray-500 mt-1">Format: doc, docx, pdf (Max 10MB)</p>
        </div>

        <div class="flex gap-4">
          <button type="button" @click="router.back()" class="flex-1 bg-gray-400 text-white py-3 rounded-lg font-bold">Batal</button>
          <button type="submit" class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()
const form = ref({ kelas_id: '', judul_tugas: '', deskripsi: '', deadline: '' })
const fileBaru = ref(null) 

const classOptions = ref([
  { id: 1, name: 'Bahasa Indonesia - 7A' },
  { id: 2, name: 'Bahasa Indonesia - 7B' },
  { id: 3, name: 'Bahasa Indonesia - 7C' }
])

// Tambahkan fungsi ini
const handleFileUpload = (event) => {
  fileBaru.value = event.target.files[0]
}

const fetchDetailTugas = async () => {
  try {
    const token = localStorage.getItem('token_jwt') // 2. Gunakan token_jwt
    const response = await apiClient.get(`/tugas/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    form.value = response.data.data
  } catch (error) {
    Swal.fire('Error', 'Gagal memuat data tugas', 'error')
  }
}

const updateTugas = async () => {
  const formData = new FormData();
  formData.append('kelas_id', form.value.kelas_id);
  formData.append('judul_tugas', form.value.judul_tugas);
  formData.append('deskripsi', form.value.deskripsi);
  formData.append('deadline', form.value.deadline);
  
  if (fileBaru.value) {
    formData.append('lampiran_file', fileBaru.value);
  }

  try {
    const token = localStorage.getItem('token_jwt');
    await apiClient.post(`/tugas/${route.params.id}`, formData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    Swal.fire('Berhasil!', 'Tugas diperbarui.', 'success');
    router.push({ name: 'grading' });
  } catch (error) {
    console.error(error.response?.data);
    Swal.fire('Gagal!', error.response?.data?.message || 'Terjadi kesalahan.', 'error');
  }
}

onMounted(fetchDetailTugas)
</script>