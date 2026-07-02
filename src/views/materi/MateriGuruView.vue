<template>
  <DashboardLayout>
    
    <div v-if="!showForm">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Materi Kelas</h1>
        <button 
          @click="showForm = true" 
          class="bg-[#4A86A8] hover:bg-[#3d718e] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm"
        >
          + Upload Materi
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm">
          <p class="text-4xl font-bold text-gray-700">{{ materiList.length }}</p>
          <p class="text-gray-600 font-medium mt-1">Total Materi Diunggah</p>
        </div>
        <div class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm">
          <p class="text-4xl font-bold text-[#4A86A8]">{{ kelasList.length }}</p>
          <p class="text-gray-600 font-medium mt-1">Kelas Aktif</p>
        </div>
      </div>

      <h2 class="text-lg font-bold text-gray-700 mb-4">Semua Materi</h2>
      
      <div v-if="isLoading" class="text-center py-10 text-gray-500 italic">
        Memuat daftar materi...
      </div>

      <div v-else-if="materiList.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="materi in materiList" :key="materi.id" class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm flex flex-col h-full">
            <div class="flex-grow">
              <div class="flex justify-between items-start mb-2">
                <span class="bg-gray-500 text-white text-[0.7rem] font-bold px-2 py-1 rounded uppercase">
                  {{ materi.nama_kelas || `Kelas ID: ${materi.kelas_id}` }}
                </span>
                <span class="text-xs text-gray-500 font-medium">{{ formatTanggal(materi.created_at) }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{{ materi.judul_materi }}</h3>
              <p class="text-sm text-gray-600 line-clamp-3 mb-4">{{ materi.isi_materi || 'Tidak ada isi materi tambahan.' }}</p>
              
              <div class="flex items-center gap-2 mb-4 bg-white/50 p-2 rounded-lg w-fit border border-gray-300">
                <div class="bg-[#6C757D] text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded">FILE</div>
                <span class="text-sm font-medium text-gray-700 truncate max-w-[150px]">{{ formatNamaFile(materi.lampiran_file) }}</span>
              </div>
            </div>
            
            <hr class="border-gray-400 mb-4 mt-auto">

            <div class="flex gap-3 justify-end">
              <button @click="bukaFile(materi.lampiran_file)" class="bg-[#4A86A8] hover:bg-[#3d718e] text-white px-4 py-2 rounded-lg text-sm font-bold transition">
                Buka
              </button>
              <button @click="hapusMateri(materi.id, materi.kelas_id)" class="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition">
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 bg-[#EBEBEB] rounded-[15px] border border-gray-300">
        <p class="text-gray-500 italic">Belum ada materi yang diunggah.</p>
        <button @click="showForm = true" class="mt-4 text-[#4A86A8] font-bold hover:underline">
          Upload materi pertamamu sekarang
        </button>
      </div>
    </div>

    <div v-else>
      <button @click="batalUpload" class="mb-6 flex items-center text-gray-600 hover:text-black font-medium transition-colors">
        ← Kembali ke Daftar Materi
      </button>

      <div class="bg-[#D9D9D9] p-8 rounded-2xl shadow-sm max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-400 pb-4">Upload Materi Baru</h2>

        <form @submit.prevent="submitMateri">
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

          <div class="mb-5">
            <label class="block text-gray-700 font-bold mb-2">Judul Materi <span class="text-red-500">*</span></label>
            <input 
              type="text" 
              v-model="form.judul_materi" 
              placeholder="Contoh: Modul BAB 1 - Sistem Tata Surya"
              class="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white focus:outline-none focus:border-[#4A86A8] focus:ring-1 focus:ring-[#4A86A8]"
              required
            >
          </div>

          <div class="mb-5">
            <label class="block text-gray-700 font-bold mb-2">Isi Materi</label>
            <textarea 
              v-model="form.isi_materi" 
              rows="4"
              placeholder="Berikan instruksi atau ringkasan materi di sini..."
              class="w-full px-4 py-3 rounded-xl border border-gray-400 bg-white focus:outline-none focus:border-[#4A86A8] focus:ring-1 focus:ring-[#4A86A8]"
            ></textarea>
          </div>

          <div class="mb-8">
            <label class="block text-gray-700 font-bold mb-2">Lampiran File (PDF, DOCX, PPTX) <span class="text-red-500">*</span></label>
            
            <input type="file" ref="fileInput" @change="onFileSelected" class="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx">
            
            <div 
              @click="triggerFileInput"
              class="border-2 border-dashed border-gray-500 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-300 transition bg-white/50"
              :class="{'border-[#4A86A8] bg-blue-50': selectedFile}"
            >
              <svg v-if="!selectedFile" class="w-10 h-10 mx-auto text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <svg v-else class="w-10 h-10 mx-auto text-[#4A86A8] mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>

              <p class="text-sm font-bold text-gray-800">
                {{ selectedFile ? selectedFile.name : 'Klik untuk memilih file materi' }}
              </p>
              <p class="text-xs text-gray-500 mt-1" v-if="selectedFile">
                {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB
              </p>
              <p class="text-xs text-gray-500 mt-1" v-else>
                Ukuran maksimal 10MB
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-4">
            <button 
              type="button" 
              @click="batalUpload"
              class="px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-300 hover:bg-gray-400 transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="px-8 py-3 rounded-xl font-bold text-white bg-[#4A86A8] hover:bg-[#3d718e] transition disabled:opacity-50"
            >
              {{ isSubmitting ? 'Mengunggah...' : 'Upload Materi' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios.js'
import Swal from 'sweetalert2'

const showForm = ref(false)
const isLoading = ref(true)
const isSubmitting = ref(false)

const materiList = ref([])
const kelasList = ref([])

const fileInput = ref(null)
const selectedFile = ref(null)
const form = ref({
  kelas_id: '',
  judul_materi: '',
  isi_materi: ''
})

// ==========================================
// 1. MENGAMBIL DATA KELAS & MATERI (DISESUAIKAN DENGAN ROUTE BACKEND)
// ==========================================
const fetchData = async () => {
  isLoading.value = true
  materiList.value = [] // Reset list materi
  
  try {
    const token = localStorage.getItem('token_jwt')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    // Pertama, ambil daftar kelas
    const resKelas = await apiClient.get('/kelas', config)
    kelasList.value = resKelas.data.data || resKelas.data || []

    // Kedua, looping setiap kelas untuk mengambil materi menggunakan route /kelas/{kelasId}/materi
    let semuaMateri = []
    
    for (const kelas of kelasList.value) {
      try {
        const resMateri = await apiClient.get(`/kelas/${kelas.id}/materi`, config)
        const dataMateri = resMateri.data.data || resMateri.data || []
        
        // Memasukkan nama kelas dan ID kelas ke objek materi agar mudah ditampilkan
        const materiDenganKelas = dataMateri.map(materi => ({
          ...materi,
          kelas_id: kelas.id,
          nama_kelas: kelas.nama_kelas
        }))
        
        semuaMateri = [...semuaMateri, ...materiDenganKelas]
      } catch (err) {
        console.error(`Gagal memuat materi untuk kelas ${kelas.id}:`, err)
      }
    }
    
    // Urutkan materi dari yang paling baru
    materiList.value = semuaMateri.sort((a, b) => b.id - a.id)

  } catch (error) {
    console.error('Gagal mengambil data:', error)
  } finally {
    isLoading.value = false
  }
}

// ==========================================
// 2. MENGUPLOAD MATERI (DISESUAIKAN DENGAN ROUTE BACKEND)
// ==========================================
const triggerFileInput = () => {
  fileInput.value.click()
}

const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire('File Terlalu Besar', 'Maksimal ukuran file adalah 10MB', 'warning')
      fileInput.value.value = ''
      selectedFile.value = null
      return
    }
    selectedFile.value = file
  }
}

const submitMateri = async () => {
  if (!selectedFile.value) {
    Swal.fire('Peringatan', 'Silakan pilih lampiran file terlebih dahulu!', 'warning')
    return
  }

  isSubmitting.value = true
  
  const formData = new FormData()
  formData.append('kelas_id', form.value.kelas_id)
  formData.append('judul_materi', form.value.judul_materi)
  formData.append('isi_materi', form.value.isi_materi || '')
  formData.append('lampiran_file', selectedFile.value)

  try {
    const token = localStorage.getItem('token_jwt')
    const kelasId = form.value.kelas_id
    
    // URL disesuaikan dengan POST /kelas/{kelasId}/materi
    await apiClient.post(`/kelas/${kelasId}/materi`, formData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    Swal.fire('Berhasil!', 'Materi telah berhasil diunggah.', 'success')
    
    batalUpload()
    fetchData()

  } catch (error) {
    console.error('Gagal upload materi:', error)
    Swal.fire('Gagal!', 'Terjadi kesalahan saat mengunggah materi.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// ==========================================
// 3. MENGHAPUS MATERI
// ==========================================
const hapusMateri = async (materiId, kelasId) => {
  const result = await Swal.fire({
    title: 'Hapus Materi ini?',
    text: "Materi yang dihapus tidak bisa dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b91c1c',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  })

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem('token_jwt')
      // Catatan: Pastikan dengan backend apakah route deletenya /materi/{id} atau /kelas/{kelasId}/materi/{id}
      // Saya asumsikan mengikuti format nested:
      await apiClient.delete(`/kelas/${kelasId}/materi/${materiId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      Swal.fire('Terhapus!', 'Materi berhasil dihapus.', 'success')
      fetchData()
    } catch (error) {
      console.error('Gagal menghapus:', error)
      // Fallback jika API aslinya /materi/{id}
      try {
        const token = localStorage.getItem('token_jwt')
        await apiClient.delete(`/materi/${materiId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        Swal.fire('Terhapus!', 'Materi berhasil dihapus.', 'success')
        fetchData()
      } catch(err2) {
        Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus materi.', 'error')
      }
    }
  }
}

// ==========================================
// 4. FUNGSI PENDUKUNG
// ==========================================
const batalUpload = () => {
  showForm.value = false
  form.value = { kelas_id: '', judul_materi: '', isi_materi: '' } 
  selectedFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const bukaFile = (namaFile) => {
  if (!namaFile) return
  window.open(`http://192.168.1.10:8000/uploads/materi/${namaFile}`, '_blank')
}

const formatNamaFile = (path) => {
  if (!path) return 'File Materi'
  const parts = path.split('/')
  return parts[parts.length - 1]
}

const formatTanggal = (dateString) => {
  if (!dateString) return ''
  const tgl = new Date(dateString)
  return tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => {
  fetchData()
})
</script>