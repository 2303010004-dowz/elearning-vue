<template>
  <DashboardLayout :hideSidebar="isDetailOpen">
    
    <div v-if="!selectedKelas">
      <div class="mb-8 flex justify-between items-center px-4 md:px-0">
        <h1 class="text-2xl font-bold text-gray-800">Kelas saya</h1>
        <button 
          @click="router.push({ name: 'create-class' })" 
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition"
        >
          + Buat Kelas
        </button>
      </div>

      <div v-if="kelasList.length === 0" class="text-center py-10 text-gray-500 italic">
        Belum ada kelas yang dibuat.
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
        <div 
          v-for="kelas in kelasList" 
          :key="kelas.id" 
          @click="pilihKelas(kelas)"
          class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <span class="inline-block bg-gray-500 text-white text-xs px-2 py-1 rounded mb-4 uppercase">
            {{ kelas.nama_kelas ? kelas.nama_kelas.substring(0, 3) : 'KLS' }}
          </span>
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ kelas.nama_kelas }}</h3>
          <p class="text-sm text-gray-600 mb-1">👤 Peserta Kelas</p>
          <p class="text-sm text-gray-600 mb-6"> Kode: <span class="font-bold text-gray-800">{{ kelas.kode_kelas }}</span></p>
          <hr class="border-gray-400 mb-4">
          <div class="text-sm text-gray-600 space-y-2">
            <p>☰ Lihat Detail Kelas</p>
            <p class="truncate text-xs">🕒 Dibuat: {{ formatTanggal(kelas.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="w-full min-h-screen bg-[#F4F4F4] -mt-4 -mx-6 md:-mx-8">
      
      <div class="w-full flex items-center px-10 bg-[#F4F4F4] h-[75px] border-b border-gray-300">
        
        <button 
          @click="tutupDetail" 
          class="flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors mr-3 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div class="flex items-center text-[1.05rem] font-medium pt-0.5">
          <span class="text-gray-500 cursor-pointer hover:text-gray-800 transition" @click="tutupDetail">Kelas saya</span>
          <span class="text-gray-400 mx-2.5">/</span>
          <span class="font-bold text-gray-900">{{ selectedKelas.nama_kelas }}</span>
        </div>
      </div>

      <div class="w-full bg-[#F4F4F4] px-10 border-b border-gray-300 shadow-sm">
        <div class="flex gap-8 text-[1rem]">
          <button 
            v-for="tab in ['materi', 'tugas', 'orang']" 
            :key="tab"
            @click="activeTab = tab"
            class="capitalize py-3.5 px-2 font-semibold transition-all border-b-[3px] focus:outline-none"
            :class="activeTab === tab ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <div class="px-10 pt-8 pb-12">
        
        <div v-if="activeTab === 'materi'">
          <div v-if="isLoadingMateri" class="text-gray-500 italic p-4">Memuat data materi...</div>
          
          <div v-else-if="materiKelas.length === 0" class="text-gray-500 italic p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
            Belum ada materi yang diunggah untuk kelas ini. 
            <br>
            <router-link :to="{ name: 'materi-guru' }" class="inline-block mt-2 text-[#4A86A8] hover:underline font-bold">
              + Upload Materi Sekarang
            </router-link>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="materi in materiKelas" 
              :key="materi.id"
              class="bg-[#D9D9D9] p-5 rounded-xl shadow-sm flex flex-col h-full"
            >
              <div class="flex items-start gap-4 mb-3">
                <div class="bg-[#555555] text-white font-bold rounded-lg w-[45px] h-[45px] flex items-center justify-center shrink-0">FILE</div>
                <div>
                  <h3 class="font-bold text-gray-800 text-[1.05rem] leading-tight mb-1">{{ materi.judul_materi }}</h3>
                  <span class="text-gray-500 text-xs">{{ formatTanggal(materi.created_at) }}</span>
                </div>
              </div>
              
              <p class="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{{ materi.isi_materi || 'Tidak ada instruksi tambahan.' }}</p>
              
              <div class="flex justify-between items-center mt-auto border-t border-gray-400 pt-3">
                <span class="text-xs font-medium text-gray-700 truncate w-3/4" :title="materi.lampiran_file">
                  📄 {{ formatNamaFile(materi.lampiran_file) }}
                </span>
                <button @click="bukaFile(materi.lampiran_file)" class="bg-[#4A86A8] hover:bg-[#3d718e] text-white text-xs px-4 py-1.5 rounded-lg font-bold transition">
                  Buka
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'tugas'">
          <div v-if="!selectedTugas">
            <div v-if="daftarTugas.length > 0">
              <div 
                v-for="tugas in daftarTugas" 
                :key="tugas.id" 
                @click="pilihTugas(tugas)" 
                class="bg-white p-5 rounded-xl border border-gray-200 mb-4 shadow-sm cursor-pointer hover:bg-gray-50 transition"
              >
                <h3 class="font-bold text-gray-800 text-lg">{{ tugas.judul_tugas }}</h3>
                <p class="text-sm text-gray-600 line-clamp-2 mt-1">{{ tugas.deskripsi }}</p>
                <p class="text-xs text-red-500 mt-3 font-semibold">Batas: {{ formatTanggal(tugas.deadline) || 'Tidak ada' }}</p>
              </div>
            </div>
            <div v-else class="text-gray-500 italic p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
              Belum ada tugas untuk kelas ini.
            </div>
          </div>

          <div v-else>
            <button @click="tutupTugas" class="mb-5 flex items-center text-gray-600 hover:text-black font-semibold transition">
              ← Kembali ke Daftar Tugas
            </button>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
              <h1 class="text-2xl font-bold mb-2">{{ selectedTugas.judul_tugas }}</h1>
              <p class="text-sm text-gray-500 mb-4 font-medium">Batas Waktu: <span class="text-red-500">{{ formatTanggal(selectedTugas.deadline) || 'Tidak ada tenggat' }}</span></p>
              <div class="border-t pt-4">
                <p class="text-gray-800 leading-relaxed whitespace-pre-wrap">{{ selectedTugas.deskripsi }}</p>
              </div>
              <div class="mt-8 flex justify-end">
                <button 
                  @click="goToNilaiTugas(selectedTugas.id)" 
                  class="bg-[#4A86A8] hover:bg-[#3d718e] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition shadow-sm"
                >
                  Nilai Kiriman Siswa &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'orang'">
          <div class="text-gray-500 italic p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
            Daftar peserta kelas belum tersedia di tampilan ini.
          </div>
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios'

const router = useRouter()
const kelasList = ref([])
const activeTab = ref('materi')
const isDetailOpen = ref(false)

// State Detail
const selectedKelas = ref(null)
const selectedTugas = ref(null)

// State Data Relasional Kelas
const materiKelas = ref([])
const daftarTugas = ref([])
const isLoadingMateri = ref(false)

// ==========================================
// 1. MENGAMBIL DAFTAR KELAS
// ==========================================
const fetchClasses = async () => {
  try {
    const token = localStorage.getItem('token_jwt')
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const res = await apiClient.get('/kelas', config)
    kelasList.value = res.data.data || res.data || []
  } catch (err) { 
    console.error('Gagal mengambil daftar kelas:', err) 
  }
}

// ==========================================
// 2. MENGAMBIL DATA MATERI & TUGAS SPESIFIK KELAS
// ==========================================
const fetchMateriDanTugas = async (kelasId) => {
  const token = localStorage.getItem('token_jwt')
  const config = { headers: { Authorization: `Bearer ${token}` } }
  
  // A. Ambil Materi Kelas
  isLoadingMateri.value = true
  materiKelas.value = []
  try {
    const resMateri = await apiClient.get(`/kelas/${kelasId}/materi`, config)
    const dataMateri = resMateri.data.data || resMateri.data || []
    materiKelas.value = dataMateri.sort((a, b) => b.id - a.id)
  } catch (err) { 
    console.error('Gagal mengambil materi kelas:', err) 
  } finally {
    isLoadingMateri.value = false
  }

  // B. Ambil Tugas Kelas
  try {
    const resTugas = await apiClient.get(`/tugas?kelas_id=${kelasId}`, config)
    const semuaTugas = resTugas.data.data || resTugas.data || []
    daftarTugas.value = semuaTugas.filter(tugas => tugas.kelas_id == kelasId).sort((a, b) => b.id - a.id)
  } catch (err) { 
    console.error('Gagal mengambil tugas kelas:', err) 
  }
}

// ==========================================
// LOGIKA INTERAKSI & NAVIGASI
// ==========================================
watch(activeTab, (newTab) => {
  if (newTab === 'tugas' && selectedKelas.value) {
    tutupTugas()
  }
})

const pilihKelas = (k) => { 
  selectedKelas.value = k; 
  isDetailOpen.value = true;
  activeTab.value = 'materi'; 
  
  fetchMateriDanTugas(k.id); 
}

const tutupDetail = () => { 
  selectedKelas.value = null; 
  isDetailOpen.value = false;
  tutupTugas();
}

const pilihTugas = (tugas) => { selectedTugas.value = tugas }
const tutupTugas = () => { selectedTugas.value = null }

const goToNilaiTugas = (tugasId) => {
  router.push({ name: 'nilai-tugas', params: { id: tugasId } })
}

// ==========================================
// FUNGSI PENDUKUNG (HELPERS)
// ==========================================
const bukaFile = (namaFile) => {
  if (!namaFile) return
  window.open(`http://192.168.1.10:8000/uploads/materi/${namaFile}`, '_blank')
}

const formatNamaFile = (path) => {
  if (!path) return 'File'
  const parts = path.split('/')
  return parts[parts.length - 1]
}

const formatTanggal = (dateString) => {
  if (!dateString) return '-'
  const tgl = new Date(dateString)
  return tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => {
  fetchClasses()
})
</script>