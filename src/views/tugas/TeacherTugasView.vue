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
        <!-- Menggunakan computed property agar dinamis -->
        <p class="text-4xl font-bold text-red-600">{{ totalBelumDinilai }}</p>
        <p class="text-gray-600 font-medium">Belum dinilai</p>
      </div>
      <div class="bg-[#D9D9D9] p-6 rounded-2xl">
        <!-- Menggunakan computed property agar dinamis -->
        <p class="text-4xl font-bold text-green-600">{{ totalSudahDinilai }}</p>
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
            <!-- Menampilkan Nama Kelas (Jika dari backend sudah di-join) -->
            <p class="text-sm text-gray-600 font-medium mt-1">
              Kelas: <span class="text-gray-800">{{ tugas?.nama_kelas || `ID ${tugas?.kelas_id}` }}</span>
            </p>
            <p class="text-xs text-gray-500 mt-1">Dibuat: {{ formatTanggal(tugas?.created_at) }}</p>
            
            <!-- Indikator Jawaban Terkumpul -->
            <div class="mt-3 inline-flex items-center px-3 py-1 bg-white rounded-md border border-gray-300">
              <span class="text-sm font-bold text-[#4A86A8]">
                {{ tugas?.jumlah_terkumpul || 0 }} Jawaban Masuk
              </span>
            </div>
          </div>
          
          <div class="text-right">
            <p class="text-sm text-gray-600 font-medium">Tenggat:</p>
            <p class="text-sm font-bold text-red-600">{{ formatTanggal(tugas?.deadline) || '-' }}</p>
          </div>
        </div>
        
        <hr class="border-gray-400 mb-6">

        <div class="flex gap-3 justify-end">
          <!-- Nilai Kiriman (PENTING: Di sinilah guru bisa melihat file jawaban siswa) -->
          <button @click="nilaiKiriman(tugas.id)" class="bg-[#4A86A8] hover:bg-[#3d718e] text-white px-6 py-2 rounded-lg text-sm font-bold transition">
            Nilai kiriman
          </button>
          
          <!-- Edit Tugas -->
          <button @click="editTugas(tugas.id)" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm transition">
            Edit
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios.js'
import Swal from 'sweetalert2'

const router = useRouter()
const daftarTugas = ref([])

// ==========================================
// MENGHITUNG STATISTIK (Dinamis dari Frontend)
// ==========================================
const totalBelumDinilai = computed(() => {
  return daftarTugas.value.reduce((total, tugas) => total + (tugas.belum_dinilai || 0), 0)
})

const totalSudahDinilai = computed(() => {
  return daftarTugas.value.reduce((total, tugas) => total + (tugas.sudah_dinilai || 0), 0)
})

// ==========================================
// FUNGSI UTAMA
// ==========================================
const fetchTugas = async () => {
  try {
    // ⚠️ Saya ubah jadi token_jwt menyesuaikan kodinganmu di file lain agar konsisten
    const token = localStorage.getItem('token_jwt') || localStorage.getItem('token')
    const response = await apiClient.get('/tugas', {
      headers: { Authorization: `Bearer ${token}` }
    })

    let tasks = []
    if (response.data && response.data.data) {
      tasks = response.data.data
    } else if (Array.isArray(response.data)) {
      tasks = response.data
    }

    // Beri nilai default 0 agar tidak error sebelum dihitung
    daftarTugas.value = tasks.sort((a, b) => b.id - a.id).map(t => ({
      ...t,
      jumlah_terkumpul: 0,
      belum_dinilai: 0,
      sudah_dinilai: 0
    }))

    // 🚀 PANGGIL FUNGSI PENGHITUNG OTOMATIS SETELAH TUGAS DIMUAT
    if (daftarTugas.value.length > 0) {
      hitungStatistikJawaban(token)
    }

  } catch (error) {
    console.error('Gagal mengambil data tugas:', error)
  }
}

// 💡 FUNGSI BARU: Mengecek jawaban untuk masing-masing tugas
const hitungStatistikJawaban = async (token) => {
  // Kita gunakan Promise.all agar ngeceknya barengan (paralel) dan loadingnya lebih cepat
  await Promise.all(daftarTugas.value.map(async (tugas, index) => {
    try {
      // Tembak endpoint list jawaban milik temanmu
      const resJawaban = await apiClient.get(`/tugas/${tugas.id}/jawaban`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const listJawaban = resJawaban.data.data || resJawaban.data || []
      
      if (Array.isArray(listJawaban)) {
        // Hitung statistik
        const totalMasuk = listJawaban.length
        
        // Asumsi: Jika field 'nilai' bernilai null / belum ada, berarti belum dinilai
        const sudahDinilai = listJawaban.filter(j => j.nilai !== null && j.nilai !== undefined).length
        const belumDinilai = totalMasuk - sudahDinilai

        // Update langsung ke dalam array agar UI bereaksi
        daftarTugas.value[index].jumlah_terkumpul = totalMasuk
        daftarTugas.value[index].sudah_dinilai = sudahDinilai
        daftarTugas.value[index].belum_dinilai = belumDinilai
      }
    } catch (err) {
      // Abaikan jika error (misal tugas memang belum ada jawaban 404)
    }
  }))
}

// Fungsi Hapus Tugas
const hapusTugas = async (id) => {
  const result = await Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Tugas beserta semua jawaban siswa akan dihapus!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b91c1c',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  })

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem('token_jwt') || localStorage.getItem('token')
      await apiClient.delete(`/tugas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      Swal.fire('Terhapus!', 'Tugas telah berhasil dihapus.', 'success')
      fetchTugas() 
    } catch (error) {
      Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus tugas.', 'error')
    }
  }
}

// Navigasi
const editTugas = (id) => {
  router.push({ name: 'edit-tugas', params: { id } })
}

const nilaiKiriman = (id) => {
  router.push({ name: 'nilai-tugas', params: { id } })
}

// Helper Tanggal
const formatTanggal = (dateString) => {
  if (!dateString) return ''
  const tgl = new Date(dateString)
  return tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(fetchTugas)
</script>