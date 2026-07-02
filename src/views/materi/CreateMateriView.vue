<template>
  <DashboardLayout>
    <div class="bg-[#D9D9D9] p-8 rounded-2xl shadow-sm max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-400 pb-4">Buat Tugas Baru</h2>

      <form @submit.prevent="submitTugas">
        
        <!-- Pilih Kelas -->
        <div class="mb-5">
          <label class="block text-gray-700 font-bold mb-2">Pilih Kelas <span class="text-red-500">*</span></label>
          <select 
            v-model="form.kelas_id" 
            class="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white focus:outline-none focus:border-[#4A86A8] focus:ring-1 focus:ring-[#4A86A8]"
            required
          >
            <option value="" disabled>-- Pilih Kelas Tujuan --</option>
            <option v-for="kelas in kelasList" :key="kelas.id" :value="kelas.id">
              {{ kelas.nama_kelas }} ({{ kelas.kode_kelas }})
            </option>
          </select>
        </div>

        <!-- Judul Tugas -->
        <div class="mb-5">
          <label class="block text-gray-700 font-bold mb-2">Judul Tugas <span class="text-red-500">*</span></label>
          <input 
            type="text" 
            v-model="form.judul_tugas" 
            placeholder="Contoh: Makalah Observasi Lingkungan"
            class="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white focus:outline-none focus:border-[#4A86A8] focus:ring-1 focus:ring-[#4A86A8]"
            required
          >
        </div>

        <!-- Deskripsi / Instruksi -->
        <div class="mb-5">
          <label class="block text-gray-700 font-bold mb-2">Instruksi Tugas</label>
          <textarea 
            v-model="form.deskripsi" 
            rows="5"
            placeholder="Berikan instruksi yang jelas mengenai apa yang harus dikerjakan oleh siswa..."
            class="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white focus:outline-none focus:border-[#4A86A8] focus:ring-1 focus:ring-[#4A86A8]"
          ></textarea>
        </div>

        <!-- Batas Waktu (Deadline) -->
        <div class="mb-8">
          <label class="block text-gray-700 font-bold mb-2">Batas Waktu Pengumpulan (Opsional)</label>
          <input 
            type="date" 
            v-model="form.deadline" 
            class="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white focus:outline-none focus:border-[#4A86A8] focus:ring-1 focus:ring-[#4A86A8]"
          >
        </div>

        <!-- Tombol Submit -->
        <div class="flex justify-end gap-4">
          <button 
            type="button" 
            @click="batal"
            class="px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-300 hover:bg-gray-400 transition"
          >
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="px-8 py-3 rounded-xl font-bold text-white bg-[#4A86A8] hover:bg-[#3d718e] transition disabled:opacity-50"
          >
            {{ isSubmitting ? 'Menyimpan...' : 'Buat Tugas' }}
          </button>
        </div>
      </form>
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

// State Data Form
const form = ref({
  kelas_id: '',
  judul_tugas: '',
  deskripsi: '',
  deadline: ''
})

// State Pendukung
const kelasList = ref([])
const isSubmitting = ref(false)

// Mengambil daftar kelas untuk pilihan di dropdown
const fetchClasses = async () => {
  try {
    const res = await apiClient.get('/kelas')
    kelasList.value = res.data.data || res.data || []
  } catch (error) {
    console.error('Gagal memuat daftar kelas:', error)
  }
}

// Fungsi untuk menyimpan tugas baru ke database
const submitTugas = async () => {
  isSubmitting.value = true
  try {
    const token = localStorage.getItem('token')
    
    // Sesuaikan nama field (kelas_id, judul_tugas, deskripsi, deadline) 
    // dengan yang diterima oleh TugasController di backend Lumen
    await apiClient.post('/tugas', form.value, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    Swal.fire({
      title: 'Berhasil!',
      text: 'Tugas baru berhasil dibuat.',
      icon: 'success',
      confirmButtonColor: '#4A86A8'
    }).then(() => {
      // Kembali ke halaman daftar tugas guru setelah sukses
      router.push({ name: 'tugas-guru' })
    })

  } catch (error) {
    console.error('Gagal membuat tugas:', error)
    Swal.fire('Gagal!', 'Terjadi kesalahan saat menyimpan tugas.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const batal = () => {
  router.back()
}

onMounted(() => {
  fetchClasses()
})
</script>