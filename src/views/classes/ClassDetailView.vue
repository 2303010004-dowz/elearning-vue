<template>
  <div class="flex min-h-screen bg-[#F3F3F3] font-sans text-gray-800">
    <main class="flex-1 p-8">
      
      <!-- HEADER DINAMIS -->
      <div class="mb-8 flex items-center">
        <button @click="$router.back()" class="mr-4">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-gray-500 mr-2">Kelas saya</span>
        <!-- Nama Kelas Dinamis -->
        <h1 class="text-xl font-bold text-gray-800">{{ detailKelas.nama_kelas || 'Memuat...' }}</h1>
      </div>

      <!-- TABS NAVIGASI -->
      <div class="border-b border-gray-400 mb-8 flex gap-12">
        <button @click="currentTab = 'materi'; selectedTask = null" :class="currentTab === 'materi' ? 'pb-3 border-b-2 border-gray-800 font-bold text-gray-900' : 'pb-3 text-gray-600'">Materi</button>
        <button @click="currentTab = 'tugas'" :class="currentTab === 'tugas' ? 'pb-3 border-b-2 border-gray-800 font-bold text-gray-900' : 'pb-3 text-gray-600'">Tugas</button>
        <button @click="currentTab = 'orang'" :class="currentTab === 'orang' ? 'pb-3 border-b-2 border-gray-800 font-bold' : 'pb-3 text-gray-600'">Orang</button>
      </div>

      <!-- KONTEN: MATERI -->
      <div v-if="currentTab === 'materi'" class="space-y-4">
        <div v-if="materiList.length === 0" class="text-gray-500 italic p-4">Belum ada materi di kelas ini.</div>
        <div 
          v-for="item in materiList" 
          :key="item.id" 
          @click="downloadFile(item.file_path)"
          class="bg-[#D9D9D9] p-4 rounded-xl flex items-center gap-4 w-96 cursor-pointer hover:bg-gray-300 transition"
        >
          <div class="bg-gray-600 text-white px-2 py-1 rounded text-[10px] font-bold">
            {{ item.tipe_file || 'PDF' }}
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-800">{{ item.judul_materi }}</h4>
            <p class="text-xs text-gray-500">
              {{ item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-' }}
            </p>
          </div>
        </div>
      </div>

      <!-- KONTEN: DAFTAR TUGAS -->
      <div v-else-if="currentTab === 'tugas' && !selectedTask" class="space-y-4">
        <div v-if="tugasList.length === 0" class="text-gray-500 italic p-4">Belum ada tugas di kelas ini.</div>
        <div 
          v-for="task in tugasList" 
          :key="task.id" 
          @click="selectTask(task)" 
          class="bg-[#D9D9D9] p-4 rounded-xl flex items-center gap-4 w-96 cursor-pointer hover:bg-gray-300"
        >
          <div class="text-gray-700">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 010-16zm1 8H7v2h4v-2z" />
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-800">{{ task.judul_tugas }}</h4>
            <p class="text-xs text-gray-500">
              Batas: {{ task.deadline ? new Date(task.deadline).toLocaleDateString('id-ID') : 'Tidak ada' }}
            </p>
          </div>
        </div>
      </div>

      <!-- KONTEN: DETAIL TUGAS -->
      <div v-else-if="currentTab === 'tugas' && selectedTask" class="flex gap-12">
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ selectedTask.judul_tugas }}</h1>
          <hr class="border-gray-400 mb-6">
          <p class="text-gray-700 leading-relaxed">{{ selectedTask.deskripsi || 'Tidak ada instruksi tambahan.' }}</p>
        </div>
        
        <!-- Box Pengiriman -->
        <div class="w-80 bg-[#D9D9D9] p-6 rounded-2xl">
          <h2 class="text-xl font-bold mb-4">Tugas</h2>

          <!-- Input File Tersembunyi -->
          <input type="file" ref="fileInput" class="hidden" @change="onFileSelected" />

          <!-- Jika BELUM diupload -->
          <div v-if="!isUploaded" class="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center mb-4 cursor-pointer hover:bg-gray-200" @click="triggerFileInput">
            <svg class="w-8 h-8 mx-auto text-gray-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"/>
            </svg>
            <p class="text-xs text-gray-600">
              {{ chosenFile ? chosenFile.name : 'Unggah File' }}<br>
              <span class="text-[10px] text-gray-400" v-if="!chosenFile">Klik untuk memilih file</span>
            </p>
          </div>
          <button v-if="!isUploaded" @click="handleUploadTugas" :disabled="!chosenFile" class="w-full bg-[#4A86A8] text-white py-2 rounded-lg font-bold hover:bg-[#3a6d8a] disabled:opacity-50">Kirim</button>

          <!-- Jika SUDAH diupload -->
          <div v-else>
            <div class="border border-gray-400 rounded-lg p-3 mb-4 flex items-center gap-2 bg-gray-200">
              <div class="bg-gray-500 text-white px-1 rounded text-[8px] font-bold">FILE</div>
              <span class="text-xs text-gray-700 truncate">{{ selectedTask.file_siswa_name || 'Tugas_Terkirim.pdf' }}</span>
            </div>
            <button @click="handleBatalkanTugas" class="w-full bg-gray-600 text-white py-2 rounded-lg font-bold hover:bg-gray-700">
              Batalkan Pengiriman
            </button>
          </div>
        </div>
      </div>

      <!-- KONTEN: ORANG -->
      <div v-else-if="currentTab === 'orang'" class="grid grid-cols-2 gap-20">
        <!-- Kolom Teman Sekelas -->
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-6">Teman Sekelas</h2>
          <div class="space-y-6">
            <div v-if="students.length === 0" class="text-gray-500 italic text-sm">Belum ada siswa lain di kelas ini.</div>
            <div v-for="student in students" :key="student.id" class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-gray-600 bg-gray-300">
                {{ student.name ? student.name.charAt(0).toUpperCase() : 'S' }}
              </div>
              <span class="text-gray-800">{{ student.name }}</span>
            </div>
          </div>
        </div>

        <!-- Kolom Pengajar -->
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-6">Pengajar</h2>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-gray-600 bg-gray-300">
              {{ pengajar.name ? pengajar.name.charAt(0).toUpperCase() : 'G' }}
            </div>
            <span class="text-gray-800">{{ pengajar.name || 'Nama Guru' }}</span>
          </div>
        </div>
      </div>

      <!-- CHAT ICON -->
      <div class="fixed bottom-8 right-8 bg-gray-700 p-4 rounded-lg text-white cursor-pointer">
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

const route = useRoute()
const classId = route.params.classId // Membaca ID Kelas dari URL halaman sebelumnya

// State Navigasi & Tampilan
const currentTab = ref('materi')
const selectedTask = ref(null)
const isUploaded = ref(false)
const chosenFile = ref(null)
const fileInput = ref(null)

// State Penampung Data Backend
const detailKelas = ref({})
const materiList = ref([])
const tugasList = ref([])
const students = ref([])
const pengajar = ref({})

// Ambil Seluruh Data Detail Kelas dari Backend Lumen
const fetchDetailKelasData = async () => {
  try {
    const res = await apiClient.get(`/kelas/${classId}`)
    if (res.data && res.data.data) {
      const data = res.data.data
      detailKelas.value = data
      materiList.value = data.materi || []
      tugasList.value = data.tugas || []
      students.value = data.siswa || []
      pengajar.value = data.guru || { name: 'Budi, S.Pd' } // Fallback jika guru null
    }
  } catch (err) {
    console.error('Gagal mengambil data detail kelas:', err)
  }
}

// Buka Detail Tugas yang Dipilih & Cek Apakah Sudah Pernah Dikumpulkan
const selectTask = (task) => {
  selectedTask.value = task
  // Jika di database status tugas siswa ini sudah dikumpulkan:
  isUploaded.value = task.is_submitted || false
}

// Mengaktifkan Klik Input File
const triggerFileInput = () => {
  fileInput.value.click()
}

// Menyimpan File yang Dipilih ke State Vue
const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    chosenFile.value = file
  }
}

// Kirim File Tugas Menggunakan FormData ke Backend
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

// Batalkan Pengiriman Tugas
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

// Unduh / Buka File Materi
const downloadFile = (filePath) => {
  if (!filePath) return
  window.open(`http://192.168.33.104:8000/storage/${filePath}`, '_blank')
}

onMounted(() => {
  if (classId) {
    fetchDetailKelasData()
  }
})
</script>