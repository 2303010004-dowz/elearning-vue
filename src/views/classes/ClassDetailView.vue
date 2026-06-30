<template>
  <div class="flex min-h-screen bg-[#F3F3F3] font-sans text-gray-800">
    <main class="flex-1 p-8">
      
      <div class="mb-8 flex items-center">
        <button @click="$router.back()" class="mr-4 focus:outline-none hover:text-black transition">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-gray-500 mr-2 text-sm md:text-base">Kelas saya /</span>
        <h1 class="text-xl font-bold text-gray-800">{{ detailKelas.nama_kelas || 'Memuat...' }}</h1>
      </div>

      <div class="border-b border-gray-400 mb-8 flex gap-12">
        <button 
          @click="currentTab = 'materi'; selectedTask = null" 
          :class="currentTab === 'materi' ? 'pb-3 border-b-2 border-gray-800 font-bold text-gray-900' : 'pb-3 text-gray-600 hover:text-gray-900'"
        >
          Materi
        </button>
        <button 
          @click="currentTab = 'tugas'" 
          :class="currentTab === 'tugas' ? 'pb-3 border-b-2 border-gray-800 font-bold text-gray-900' : 'pb-3 text-gray-600 hover:text-gray-900'"
        >
          Tugas
        </button>
        <button 
          @click="currentTab = 'orang'" 
          :class="currentTab === 'orang' ? 'pb-3 border-b-2 border-gray-800 font-bold text-gray-900' : 'pb-3 text-gray-600 hover:text-gray-900'"
        >
          Orang
        </button>
      </div>

      <div v-if="currentTab === 'materi'" class="space-y-4">
        <div v-if="materiList.length === 0" class="text-gray-500 italic p-4">
          Belum ada materi di kelas ini.
        </div>
        
        <div 
          v-for="item in materiList" 
          :key="item.id" 
          @click="downloadFile(item.file_path)"
          class="bg-[#D9D9D9] p-4 rounded-xl flex items-center gap-4 w-full max-w-md cursor-pointer hover:bg-gray-300 transition"
        >
          <div class="bg-gray-600 text-white px-2 py-1 rounded text-[10px] font-bold">
            {{ item.tipe_file || 'PDF' }}
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-800">{{ item.judul_materi }}</h4>
            <p class="text-xs text-gray-500 mt-1">
              {{ item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-' }}
            </p>
          </div>
        </div>
      </div>

      <div v-else-if="currentTab === 'tugas' && !selectedTask" class="space-y-4">
        <div v-if="tugasList.length === 0" class="text-gray-500 italic p-4">
          Belum ada tugas di kelas ini.
        </div>

        <div 
          v-for="task in tugasList" 
          :key="task.id" 
          @click="selectTask(task)" 
          class="bg-[#D9D9D9] p-4 rounded-xl flex items-center gap-4 w-full max-w-md cursor-pointer hover:bg-gray-300 transition"
        >
          <div class="text-gray-700">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 010-16zm1 8H7v2h4v-2z" />
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-800">{{ task.judul_tugas }}</h4>
            <p class="text-xs text-gray-500 mt-1">
              Batas: {{ task.deadline ? new Date(task.deadline).toLocaleDateString('id-ID') : 'Tidak ada tenggat' }}
            </p>
          </div>
        </div>
      </div>

      <div v-else-if="currentTab === 'tugas' && selectedTask" class="flex flex-col lg:flex-row gap-12">
        
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ selectedTask.judul_tugas }}</h1>
          <hr class="border-gray-400 mb-6">
          <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ selectedTask.deskripsi || 'Tidak ada instruksi tambahan.' }}</p>
        </div>
        
        <div class="w-full lg:w-80 bg-[#D9D9D9] p-6 rounded-2xl h-fit">
          <h2 class="text-xl font-bold mb-4">Tugas Anda</h2>

          <input type="file" ref="fileInput" class="hidden" @change="onFileSelected" />

          <div v-if="!isUploaded">
            <div 
              @click="triggerFileInput"
              class="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center mb-4 cursor-pointer hover:bg-gray-200 transition"
            >
              <svg class="w-8 h-8 mx-auto text-gray-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"/>
              </svg>
              <p class="text-xs text-gray-800 font-medium">
                {{ chosenFile ? chosenFile.name : 'Unggah File' }}<br>
                <span class="text-[10px] text-gray-500 font-normal" v-if="!chosenFile">Klik untuk memilih file</span>
              </p>
            </div>
            
            <button 
              @click="handleUploadTugas" 
              :disabled="!chosenFile" 
              class="w-full bg-[#4A86A8] text-white py-2.5 rounded-lg font-bold hover:bg-[#3a6d8a] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Kirim Tugas
            </button>
          </div>

          <div v-else>
            <div class="border border-gray-400 rounded-lg p-3 mb-4 flex items-center gap-3 bg-gray-200">
              <div class="bg-gray-600 text-white px-2 py-1 rounded text-[10px] font-bold">FILE</div>
              <span class="text-sm text-gray-800 font-medium truncate">
                {{ selectedTask.file_siswa_name || 'Tugas_Terkirim.pdf' }}
              </span>
            </div>
            
            <button 
              @click="handleBatalkanTugas" 
              class="w-full bg-gray-600 text-white py-2.5 rounded-lg font-bold hover:bg-gray-700 transition"
            >
              Batalkan Pengiriman
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="currentTab === 'orang'" class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-2">Pengajar</h2>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-gray-600 bg-gray-300 shadow-sm">
              {{ pengajar.name ? pengajar.name.charAt(0).toUpperCase() : 'G' }}
            </div>
            <span class="text-gray-800 font-medium">{{ pengajar.name || 'Nama Guru' }}</span>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-2">Teman Sekelas</h2>
          <div class="space-y-4">
            <div v-if="students.length === 0" class="text-gray-500 italic text-sm">
              Belum ada siswa lain di kelas ini.
            </div>
            
            <div v-for="student in students" :key="student.id" class="flex items-center gap-4">
              <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 bg-gray-300 text-sm">
                {{ student.name ? student.name.charAt(0).toUpperCase() : 'S' }}
              </div>
              <span class="text-gray-800">{{ student.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="fixed bottom-8 right-8 bg-[#4A4A4A] p-4 rounded-full text-white cursor-pointer shadow-lg hover:bg-gray-800 hover:scale-105 transition-all">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4-4-4H4a2 2 0 01-2-2V5z" />
        </svg>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '@/axios.js'

// ==========================================
// INISIALISASI ROUTER & STATE
// ==========================================
const route = useRoute()
const classId = route.params.classId 

// State Navigasi & UI
const currentTab = ref('materi')
const selectedTask = ref(null)
const isUploaded = ref(false)

// State File Upload
const chosenFile = ref(null)
const fileInput = ref(null)

// State Penampung Data Backend
const detailKelas = ref({})
const materiList = ref([])
const tugasList = ref([])
const students = ref([])
const pengajar = ref({})

// ==========================================
// FUNGSI PENGAMBILAN DATA (API)
// ==========================================
const fetchDetailKelasData = async () => {
  try {
    // 1. MENGATASI "MEMUAT...": Ambil daftar kelas yang diikuti, lalu cari nama kelasnya
    const resKelas = await apiClient.get('/kelas/joined')
    const semuaKelas = Array.isArray(resKelas.data) ? resKelas.data : 
                      (resKelas.data.data || resKelas.data.kelas || [])
    
    // Cari kelas yang ID-nya cocok dengan parameter classId di URL
    const kelasSaatIni = semuaKelas.find(k => k.id == classId)
    
    if (kelasSaatIni) {
      detailKelas.value = kelasSaatIni // Nama kelas akan langsung muncul!
    } else {
      detailKelas.value = { nama_kelas: 'Kelas Tidak Ditemukan' }
    }

    // 2. MENGAMBIL DATA TUGAS: Ambil semua tugas, lalu filter khusus kelas ini
    const resTugas = await apiClient.get('/tugas')
    const semuaTugas = Array.isArray(resTugas.data) ? resTugas.data : 
                      (resTugas.data.data || [])
    
    // Saring agar HANYA tugas dari kelas ini yang masuk ke tab Tugas
    tugasList.value = semuaTugas.filter(tugas => tugas.kelas_id == classId)

    // 3. MENGAMBIL DATA MATERI & ORANG (Jika API-nya sudah ada)
    // Untuk saat ini dikosongkan/dummy dulu sampai teman backend membuat API-nya
    materiList.value = [] 
    students.value = []
    pengajar.value = { name: kelasSaatIni?.nama_guru || 'Guru Pengajar' }

  } catch (err) {
    console.error('Gagal mengambil data detail kelas:', err)
  }
}

// ==========================================
// FUNGSI INTERAKSI MATERI & TUGAS
// ==========================================
const downloadFile = (filePath) => {
  if (!filePath) return
  window.open(`http://192.168.33.104:8000/storage/${filePath}`, '_blank')
}

const selectTask = (task) => {
  selectedTask.value = task
  isUploaded.value = task.is_submitted || false
}

// ==========================================
// FUNGSI UPLOAD TUGAS
// ==========================================
const triggerFileInput = () => {
  fileInput.value.click()
}

const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    chosenFile.value = file
  }
}

const handleUploadTugas = async () => {
  if (!chosenFile.value) return
  
  const formData = new FormData()
  formData.append('file_tugas', chosenFile.value)
  formData.append('tugas_id', selectedTask.value.id)

  try {
    await apiClient.post(`/tugas/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    alert('Tugas berhasil dikirim!')
    isUploaded.value = true
    fetchDetailKelasData() // Sinkronisasi ulang data terbaru
    
  } catch (err) {
    console.error('Gagal mengirim file tugas:', err)
    alert('Gagal mengirim tugas.')
  }
}

const handleBatalkanTugas = async () => {
  try {
    await apiClient.post(`/tugas/${selectedTask.value.id}/cancel`)
    
    alert('Pengiriman berhasil dibatalkan.')
    isUploaded.value = false
    chosenFile.value = null
    fetchDetailKelasData()
    
  } catch (err) {
    console.error('Gagal membatalkan tugas:', err)
  }
}

// ==========================================
// LIFECYCLE HOOK
// ==========================================
onMounted(() => {
  if (classId) {
    fetchDetailKelasData()
  }
})
</script>