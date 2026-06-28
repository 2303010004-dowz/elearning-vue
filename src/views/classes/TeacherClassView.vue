<template>
  <DashboardLayout :hideSidebar="isDetailOpen">
    
    <!-- TAMPILAN 1: DAFTAR UTAMA KELAS -->
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

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
        <div 
          v-for="kelas in kelasList" 
          :key="kelas.id" 
          @click="pilihKelas(kelas)"
          class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <span class="inline-block bg-gray-500 text-white text-xs px-2 py-1 rounded mb-4">
            {{ kelas.nama_kelas }}
          </span>
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
    </div>

    <!-- TAMPILAN 2: DETAIL TAB KELAS -->
    <div v-else-if="selectedKelas && !selectedMateri" class="w-full min-h-screen bg-[#F4F4F4] -mt-4 -mx-6 md:-mx-8">
      
      <div class="w-full flex items-center pl-8 bg-[#F4F4F4] h-[65px] border-b border-gray-200">
        <button @click="tutupDetail" class="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 transition bg-transparent border-0 focus:outline-none flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
        <div class="flex items-center gap-2 ml-2 text-[0.95rem] leading-none">
          <span class="text-gray-500 cursor-pointer hover:underline" @click="tutupDetail">Kelas saya</span>
          <span class="text-gray-400">/</span>
          <span class="font-bold text-gray-800">{{ selectedKelas.nama_kelas }}</span>
        </div>
      </div>

      <div class="w-full bg-[#F4F4F4] pl-12 border-b border-gray-200">
        <div class="flex gap-16 text-[1rem]">
          <button 
            v-for="tab in ['materi', 'tugas', 'orang']" 
            :key="tab"
            @click="activeTab = tab"
            class="py-3 font-semibold capitalize focus:outline-none transition-all relative border-0 bg-transparent"
            :class="activeTab === tab ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-800'"
          >
            {{ tab }}
            <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-[3px] bg-[#333333]"></div>
          </button>
        </div>
      </div>

      <!-- Area Konten -->
      <div class="px-12 pt-6 pb-12">
        <div v-if="activeTab === 'materi'" class="space-y-4 max-w-[450px] mt-6">
          <div @click="bukaMateri('BAB 2 - Penggunaan Teks Deskripsi.pdf')" class="bg-[#D9D9D9] p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-gray-400 transition">
            <div class="bg-[#555555] text-white font-bold rounded-lg w-[40px] h-[40px] flex items-center justify-center shrink-0">PDF</div>
            <div class="leading-tight">
              <div class="font-bold text-gray-800 text-[0.95rem]">BAB 2 - Penggunaan Teks Deskripsi.pdf</div>
              <span class="text-gray-500 text-xs">1 April</span>
            </div>
          </div>
        </div>

        <!-- Tab Tugas yang sudah diperbaiki -->
        <div v-else-if="activeTab === 'tugas'" class="mt-6">
          
          <!-- JIKA BELUM ADA TUGAS YANG DIPILIH (Tampilan Daftar) -->
          <div v-if="!selectedTugas">
            <div v-if="daftarTugas.length > 0">
              <div 
                v-for="tugas in daftarTugas" 
                :key="tugas.id" 
                @click="pilihTugas(tugas)" 
                class="bg-white p-4 rounded-xl border border-gray-200 mb-4 shadow-sm cursor-pointer hover:bg-gray-50 transition"
              >
                <h3 class="font-bold text-gray-800">{{ tugas.judul_tugas }}</h3>
                <p class="text-sm text-gray-600">{{ tugas.deskripsi }}</p>
              </div>
            </div>
            <div v-else class="text-gray-500">Belum ada tugas untuk kelas ini.</div>
          </div>

          <!-- JIKA TUGAS DIPILIH (Tampilan Detail) -->
          <div v-else>
            <button @click="tutupTugas" class="mb-4 flex items-center text-gray-600 hover:text-black">
              ← Kembali ke Daftar Tugas
            </button>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h1 class="text-2xl font-bold mb-2">{{ selectedTugas.judul_tugas }}</h1>
              <p class="text-sm text-gray-500 mb-6">Batas Waktu: {{ selectedTugas.deadline }}</p>
              <div class="border-t pt-4">
                <p class="text-gray-800 leading-relaxed">{{ selectedTugas.deskripsi }}</p>
              </div>
            </div>
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
const daftarTugas = ref([])
const selectedKelas = ref(null)
const selectedTugas = ref(null)
const selectedMateri = ref(null)
const activeTab = ref('materi')
const isDetailOpen = ref(false)

const fetchClasses = async () => {
  try {
    const res = await apiClient.get('/kelas')
    kelasList.value = res.data.data 
  } catch (err) { console.error(err) }
}

const fetchTugas = async (kelasId) => {
  try {
    const res = await apiClient.get(`/tugas?kelas_id=${kelasId}`)
    daftarTugas.value = res.data.data
  } catch (err) { console.error('Gagal mengambil tugas:', err) }
}

  watch(activeTab, (newTab) => {
    if (newTab === 'tugas' && selectedKelas.value) {
      fetchTugas(selectedKelas.value.id)
    }
  })

  const pilihTugas = (tugas) => {
  selectedTugas.value = tugas
}

const tutupTugas = () => {
  selectedTugas.value = null
}

const pilihKelas = (k) => { 
  selectedKelas.value = k; 
  isDetailOpen.value = true;
  fetchTugas(k.id); 
}

const tutupDetail = () => { selectedKelas.value = null; isDetailOpen.value = false }
const bukaMateri = (f) => { selectedMateri.value = f }
const tutupMateri = () => { selectedMateri.value = null }

onMounted(fetchClasses)
</script>