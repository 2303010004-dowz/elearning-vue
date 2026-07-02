<template>
  <DashboardLayout hideSidebar>
    <div class="w-full min-h-screen bg-[#F4F4F4] -mt-8 -mx-8">
      
      <!-- HEADER PUTIH POLOS (Rapi & Sejajar) -->
      <div class="w-full flex items-center px-10 bg-[#F4F4F4] h-[75px] border-b border-gray-300">
        <button 
          @click="kembaliKeDaftar" 
          class="flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors mr-3 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="flex items-center text-[1.05rem] font-medium pt-0.5">
          <span class="text-gray-500 cursor-pointer hover:text-gray-800 transition" @click="kembaliKeDaftar">Kelas Saya</span>
          <span class="text-gray-400 mx-2.5">/</span>
          <!-- Menampilkan Nama Kelas (Atau ID jika belum selesai loading) -->
          <span class="font-bold text-gray-900">{{ detailKelas ? detailKelas.nama_kelas : 'Memuat...' }}</span>
        </div>
      </div>

      <!-- Tab Navigasi -->
      <div class="w-full bg-[#F4F4F4] px-10 border-b border-gray-300 shadow-sm">
        <div class="flex gap-8 text-[1rem]">
          <button 
            v-for="tab in ['materi', 'tugas']" 
            :key="tab"
            @click="activeTab = tab"
            class="capitalize py-3.5 px-2 font-semibold transition-all border-b-[3px] focus:outline-none"
            :class="activeTab === tab ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Area Konten Tab -->
      <div class="px-10 pt-8 pb-12">
        
        <!-- ================== TAB MATERI ================== -->
        <div v-if="activeTab === 'materi'">
          <div v-if="materiKelas.length === 0" class="text-gray-500 italic p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
            Belum ada materi yang dibagikan oleh guru di kelas ini.
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="materi in materiKelas" 
              :key="materi.id"
              class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full"
            >
              <div class="flex items-start gap-4 mb-3">
                <div class="bg-[#555555] text-white font-bold rounded-lg w-[45px] h-[45px] flex items-center justify-center shrink-0">FILE</div>
                <div>
                  <h3 class="font-bold text-gray-800 text-[1.05rem] leading-tight mb-1">{{ materi.judul_materi }}</h3>
                  <span class="text-gray-500 text-xs">{{ formatTanggal(materi.created_at) }}</span>
                </div>
              </div>
              <p class="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{{ materi.isi_materi || 'Tidak ada instruksi tambahan.' }}</p>
              <div class="flex justify-between items-center mt-auto border-t border-gray-200 pt-3">
                <span class="text-xs font-medium text-gray-600 truncate w-3/4" :title="materi.lampiran_file">
                  📄 {{ formatNamaFile(materi.lampiran_file) }}
                </span>
                <button @click="bukaFile(materi.lampiran_file)" class="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-4 py-1.5 rounded-lg font-bold transition">
                  Buka
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ================== TAB TUGAS ================== -->
        <div v-else-if="activeTab === 'tugas'">
          
          <!-- Daftar Tugas -->
          <div v-if="!selectedTugas">
            <div v-if="daftarTugas.length > 0">
              <div 
                v-for="tugas in daftarTugas" 
                :key="tugas.id" 
                @click="pilihTugas(tugas)" 
                class="bg-white p-5 rounded-xl border border-gray-200 mb-4 shadow-sm cursor-pointer hover:border-gray-800 transition group"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-bold text-gray-800 text-lg transition">{{ tugas.judul_tugas }}</h3>
                    <p class="text-sm text-gray-600 line-clamp-2 mt-1">{{ tugas.deskripsi }}</p>
                  </div>
                  <div class="text-right shrink-0 ml-4">
                    <p class="text-xs text-gray-500 font-medium">Tenggat Waktu:</p>
                    <p class="text-sm font-bold text-red-500">{{ formatTanggal(tugas.deadline) || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500 italic p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
              Belum ada tugas untuk kelas ini.
            </div>
          </div>

          <!-- Detail Tugas & Form Kumpul Jawaban -->
          <div v-else>
            <button @click="tutupTugas" class="mb-5 flex items-center text-gray-600 hover:text-black font-semibold transition">
              ← Kembali ke Daftar Tugas
            </button>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Kolom Kiri: Detail Instruksi Tugas -->
              <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                <h1 class="text-2xl font-bold mb-2 text-gray-800">{{ selectedTugas.judul_tugas }}</h1>
                <p class="text-sm text-gray-500 mb-6 font-medium">Batas Waktu: <span class="text-red-500">{{ formatTanggal(selectedTugas.deadline) || 'Tidak ada tenggat' }}</span></p>
                <div class="border-t border-gray-200 pt-6">
                  <h3 class="text-sm font-bold text-gray-800 mb-2">Instruksi Tugas:</h3>
                  <p class="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{{ selectedTugas.deskripsi }}</p>
                </div>
              </div>

              <!-- Kolom Kanan: Form Pengumpulan Tugas -->
              <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-300 h-fit">
                <h3 class="font-bold text-gray-800 mb-4 text-lg">Kumpulkan Jawaban</h3>
                
                <form @submit.prevent="submitJawaban">
                  <div class="mb-6">
                    <input type="file" ref="fileJawabanInput" @change="onFileJawabanSelected" class="hidden" accept=".pdf,.doc,.docx,.zip,.rar">
                    
                    <div 
                      @click="triggerFileJawabanInput"
                      class="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition bg-[#F4F4F4]"
                      :class="{'border-gray-800 bg-gray-100': selectedFileJawaban}"
                    >
                      <svg v-if="!selectedFileJawaban" class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                      </svg>
                      <svg v-else class="w-8 h-8 mx-auto text-gray-800 mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>

                      <p class="text-sm font-bold text-gray-800">
                        {{ selectedFileJawaban ? selectedFileJawaban.name : 'Pilih File Jawaban' }}
                      </p>
                      <p class="text-[0.65rem] text-gray-500 mt-1">PDF, DOCX, ZIP (Max. 10MB)</p>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    :disabled="isSubmittingJawaban"
                    class="w-full bg-[#1e293b] hover:bg-gray-800 text-white py-3 rounded-xl font-bold transition shadow-sm disabled:opacity-50"
                  >
                    {{ isSubmittingJawaban ? 'Mengirim...' : 'Kirim Jawaban' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios.js'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

// Menangkap ID Kelas dari URL (misal: /class-detail/3)
const classId = route.params.classId

const detailKelas = ref(null)
const activeTab = ref('materi')
const materiKelas = ref([])
const daftarTugas = ref([])

// Form Jawaban
const selectedTugas = ref(null)
const fileJawabanInput = ref(null)
const selectedFileJawaban = ref(null)
const isSubmittingJawaban = ref(false)

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token_jwt')
    const config = { headers: { Authorization: `Bearer ${token}` } }
    
    // Opsional: Ambil detail kelas (jika backend-mu menyediakan endpoint GET /kelas/{id})
    try {
      const resKelas = await apiClient.get(`/kelas/${classId}`, config)
      detailKelas.value = resKelas.data.data || resKelas.data
    } catch (e) {
      // Fallback jika API detail kelas belum ada
      detailKelas.value = { nama_kelas: `Kelas ID: ${classId}` }
    }

    // Ambil Materi
    const resMateri = await apiClient.get(`/kelas/${classId}/materi`, config)
    const dataMateri = resMateri.data.data || resMateri.data || []
    materiKelas.value = dataMateri.sort((a, b) => b.id - a.id)

    // Ambil Tugas
    const resTugas = await apiClient.get(`/tugas?kelas_id=${classId}`, config)
    const semuaTugas = resTugas.data.data || resTugas.data || []
    daftarTugas.value = semuaTugas.filter(tugas => tugas.kelas_id == classId).sort((a, b) => b.id - a.id)

  } catch (err) {
    console.error('Gagal memuat data detail kelas:', err)
  }
}

// ==========================================
// PENGUMPULAN TUGAS (STUDENT SIDE)
// ==========================================
const triggerFileJawabanInput = () => { fileJawabanInput.value.click() }

const onFileJawabanSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire('Terlalu Besar', 'Maksimal ukuran file 10MB', 'warning')
      fileJawabanInput.value.value = ''
      selectedFileJawaban.value = null
      return
    }
    selectedFileJawaban.value = file
  }
}

const submitJawaban = async () => {
  if (!selectedFileJawaban.value) {
    Swal.fire('Oops!', 'Pilih file jawaban terlebih dahulu!', 'warning')
    return
  }

  isSubmittingJawaban.value = true
  const formData = new FormData()
  formData.append('tugas_id', selectedTugas.value.id)
  formData.append('file_jawaban', selectedFileJawaban.value)

  try {
    const token = localStorage.getItem('token_jwt')
    // Sesuaikan dengan endpoint Lumen temanmu (contoh: POST /jawaban-tugas)
    await apiClient.post('/jawaban', formData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    Swal.fire('Berhasil!', 'Jawaban tugas Anda berhasil dikumpulkan.', 'success')
    tutupTugas()

  } catch (error) {
    console.error('Gagal mengumpulkan tugas:', error)
    Swal.fire('Gagal', 'Terjadi kesalahan saat mengirim jawaban.', 'error')
  } finally {
    isSubmittingJawaban.value = false
  }
}

const pilihTugas = (tugas) => {
  selectedTugas.value = tugas
  selectedFileJawaban.value = null 
}

const tutupTugas = () => {
  selectedTugas.value = null
  selectedFileJawaban.value = null
}

const kembaliKeDaftar = () => {
  router.push({ name: 'student-class' }) // Kembali ke daftar kelas siswa
}

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
  fetchData()
})
</script>