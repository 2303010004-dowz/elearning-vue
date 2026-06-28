<template>
  <DashboardLayout>
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Tugas</h1>
      <button 
        @click="router.push({ name: 'create-tugas' })" 
        class="bg-[#4A86A8] hover:bg-[#3d718e] text-white px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        + Buat Tugas
      </button>
    </div>

    <!-- Statistik -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-[#D9D9D9] p-6 rounded-2xl">
        <p class="text-4xl font-bold text-gray-700">{{ daftarTugas.length }}</p>
        <p class="text-gray-600 font-medium">Total Tugas</p>
      </div>
      <div class="bg-[#D9D9D9] p-6 rounded-2xl">
        <p class="text-4xl font-bold text-red-600">0</p>
        <p class="text-gray-600 font-medium">Belum dinilai</p>
      </div>
      <div class="bg-[#D9D9D9] p-6 rounded-2xl">
        <p class="text-4xl font-bold text-green-600">0</p>
        <p class="text-gray-600 font-medium">Sudah Dinilai</p>
      </div>
    </div>

    <!-- Daftar Tugas -->
    <h2 class="text-lg font-bold text-gray-700 mb-4">Semua Tugas</h2>
    
    <div v-if="daftarTugas.length > 0">
      <div v-for="tugas in daftarTugas" :key="tugas.id" class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm mb-4">
        <div class="flex justify-between items-start mb-4">
          <div>
          <h3 class="text-xl font-bold text-gray-800">{{ tugas?.judul_tugas }}</h3>
              <p class="text-sm text-gray-600">Kelas ID: {{ tugas?.kelas_id }} · Dibuat: {{ tugas?.created_at }}</p>
          </div>
          <p class="text-sm text-gray-600 font-medium">Tenggat: {{ tugas.deadline }}</p>
        </div>
        
        <hr class="border-gray-400 mb-6">

        <div class="flex gap-3 justify-end">
          <!-- Nilai Kiriman -->
          <button @click="nilaiKiriman(tugas.id)" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm transition">
            Nilai kiriman
          </button>
          
          <!-- Edit Tugas -->
          <button @click="editTugas(tugas.id)" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm transition">
            Edit Tugas
          </button>
          
          <!-- Hapus -->
          <button @click="hapusTugas(tugas.id)" class="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg text-sm transition">
            Hapus
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 text-gray-500">
      Belum ada tugas yang dibuat.
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios'
import Swal from 'sweetalert2'

const router = useRouter()
const daftarTugas = ref([])

const fetchTugas = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await apiClient.get('/tugas', {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.data.success) {
      daftarTugas.value = response.data.data
    }
  } catch (error) {
    console.error('Gagal mengambil data tugas:', error)
  }
}
// Fungsi Hapus Tugas
const hapusTugas = async (id) => {
  // Menampilkan pop-up konfirmasi yang cantik
  const result = await Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Tugas yang dihapus tidak dapat dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b91c1c', // Warna merah (sesuai tombol hapus Anda)
    cancelButtonColor: '#6b7280',  // Warna abu-abu
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  })

  // Jika user klik "Ya"
  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem('token')
      await apiClient.delete(`/tugas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Notifikasi sukses yang elegan
      Swal.fire('Terhapus!', 'Tugas telah berhasil dihapus.', 'success')
      
      fetchTugas() // Refresh daftar tugas
    } catch (error) {
      // Notifikasi error jika gagal
      Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus tugas.', 'error')
    }
  }
}
  // Fungsi Edit (Arahkan ke halaman edit)
  const editTugas = (id) => {
    router.push({ name: 'edit-tugas', params: { id } })
  }

  // Fungsi Nilai Kiriman (Arahkan ke halaman penilaian)
  const nilaiKiriman = (id) => {
    router.push({ name: 'nilai-tugas', params: { id } })
  }

onMounted(fetchTugas)
</script>