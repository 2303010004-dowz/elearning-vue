<template>
  <DashboardLayout>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Selamat datang, {{ namaGuru }}</h1>
      <p class="text-gray-600 text-sm">Ringkasan Aktivitas kelas hari ini</p>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <p class="text-gray-500 italic font-medium animate-pulse">Memuat data dashboard...</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="p-6 rounded-2xl bg-[#D9D9D9] shadow-sm">
          <h3 class="text-4xl font-bold text-gray-800">{{ totalKelas }}</h3>
          <p class="text-gray-600 font-medium text-sm mt-1">Kelas Aktif</p>
        </div>
        
        <div class="p-6 rounded-2xl bg-[#D9D9D9] shadow-sm">
          <h3 class="text-4xl font-bold text-gray-800">{{ totalSiswa }}</h3>
          <p class="text-gray-600 font-medium text-sm mt-1">Total Siswa Terdaftar</p>
        </div>
        
        <div class="p-6 rounded-2xl bg-[#D9D9D9] shadow-sm">
          <h3 class="text-4xl font-bold text-gray-800">{{ totalTugas }}</h3>
          <p class="text-gray-600 font-medium text-sm mt-1">Total Tugas Dibuat</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="bg-[#D9D9D9] rounded-2xl p-6 shadow-sm flex flex-col h-full">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold text-gray-800">Kelas saya</h2>
            <button 
              @click="router.push({ name: 'create-class' })" 
              class="bg-transparent border border-gray-600 text-xs px-3 py-1 rounded-full hover:bg-gray-400 transition font-medium text-gray-800"
            >
              + Buat Kelas
            </button>
          </div>
          
          <div class="space-y-4 flex-grow">
            <div v-if="kelasList.length === 0" class="text-sm text-gray-500 italic pb-2">
              Anda belum membuat kelas.
            </div>
            
            <div 
              v-for="kelas in kelasList.slice(0, 3)" 
              :key="kelas.id" 
              class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm cursor-pointer hover:border-[#4A86A8] transition"
              @click="router.push({ name: 'class-detail', params: { classId: kelas.id } })"
            >
              <h4 class="font-bold text-[1.05rem] text-gray-800 line-clamp-1">{{ kelas.nama_kelas }}</h4>
              <p class="text-sm text-gray-600 mt-2">
                Kode Kelas: <span class="font-bold text-[#4A86A8]">{{ kelas.kode_kelas }}</span>
              </p>
            </div>
          </div>
          
          <div v-if="kelasList.length > 3" class="mt-4 pt-4 border-t border-gray-300 text-center">
            <button @click="router.push({ name: 'teacher-class' })" class="text-xs font-bold text-[#4A86A8] hover:underline">
              Lihat semua {{ kelasList.length }} kelas &rarr;
            </button>
          </div>
        </div>

        <div class="bg-[#D9D9D9] rounded-2xl p-6 shadow-sm flex flex-col h-full">
          <h2 class="text-lg font-bold text-gray-800 mb-6">Tugas Terbaru</h2>
          
          <div class="space-y-4 flex-grow">
            <div v-if="tugasList.length === 0" class="text-sm text-gray-500 italic pb-2">
              Anda belum memberikan tugas apapun.
            </div>

            <div 
              v-for="tugas in tugasList.slice(0, 3)" 
              :key="tugas.id"
              class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex justify-between items-center hover:border-[#4A86A8] transition"
            >
              <div class="pr-4">
                <h4 class="font-bold text-[1.05rem] text-gray-800 line-clamp-1">{{ tugas.judul_tugas }}</h4>
                <p class="text-sm text-gray-600 mt-2">
                  Tenggat: <span class="font-bold text-red-600">{{ formatTanggal(tugas.deadline) }}</span>
                </p>
              </div>
              
              <button 
                @click="router.push({ name: 'nilai-tugas', params: { id: tugas.id } })" 
                class="bg-[#4A86A8] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#3d718e] font-bold transition shrink-0"
              >
                Nilai
              </button>
            </div>
          </div>

          <div v-if="tugasList.length > 3" class="mt-4 pt-4 border-t border-gray-300 text-center">
            <button @click="router.push({ name: 'grading' })" class="text-xs font-bold text-[#4A86A8] hover:underline">
              Lihat semua {{ tugasList.length }} tugas &rarr;
            </button>
          </div>
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

const router = useRouter()
const namaGuru = ref(localStorage.getItem('user_name') || 'Guru')

const isLoading = ref(true)
const kelasList = ref([])
const tugasList = ref([])

const totalKelas = ref(0)
const totalSiswa = ref(0)
const totalTugas = ref(0)

const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token_jwt')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    const resKelas = await apiClient.get('/kelas', config)
    const dataKelas = resKelas.data.data || resKelas.data || []
    
    kelasList.value = dataKelas.sort((a, b) => b.id - a.id)
    totalKelas.value = dataKelas.length

    let hitungSiswa = 0
    dataKelas.forEach(kelas => {
      hitungSiswa += (kelas.jumlah_siswa || 0)
    })
    totalSiswa.value = hitungSiswa

    const resTugas = await apiClient.get('/tugas', config)
    const dataTugas = resTugas.data.data || resTugas.data || []
    
    tugasList.value = dataTugas.sort((a, b) => b.id - a.id)
    totalTugas.value = dataTugas.length

  } catch (error) {
    console.error("Gagal mengambil data untuk dashboard:", error)
  } finally {
    isLoading.value = false
  }
}

const formatTanggal = (dateString) => {
  if (!dateString) return 'Tidak ada'
  const tgl = new Date(dateString)
  return tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => {
  fetchDashboardData()
})
</script>