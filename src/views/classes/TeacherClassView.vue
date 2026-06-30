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

      <!-- Jika Belum Ada Kelas -->
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
            <p>☰ Materi tersedia</p>
            <p class="truncate">🕒 {{ kelas.deskripsi || 'Tidak ada deskripsi' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- TAMPILAN 2: DETAIL TAB KELAS -->
    <div v-else-if="selectedKelas && !selectedMateri" class="w-full min-h-screen bg-[#F4F4F4] -mt-4 -mx-6 md:-mx-8">
      
      <!-- Sub-header Detail Kelas -->
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

      <!-- Tab Navigasi -->
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
        
        <!-- ================== TAB MATERI ================== -->
        <div v-if="activeTab === 'materi'" class="space-y-4 max-w-[450px] mt-6">
          <div @click="bukaMateri('BAB 2 - Penggunaan Teks Deskripsi.pdf')" class="bg-[#D9D9D9] p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-gray-400 transition">
            <div class="bg-[#555555] text-white font-bold rounded-lg w-[40px] h-[40px] flex items-center justify-center shrink-0">PDF</div>
            <div class="leading-tight">
              <div class="font-bold text-gray-800 text-[0.95rem]">BAB 2 - Penggunaan Teks Deskripsi.pdf</div>
              <span class="text-gray-500 text-xs">1 April</span>
            </div>
          </div>
        </div>

        <!-- ================== TAB TUGAS ================== -->
        <div v-else-if="activeTab === 'tugas'" class="mt-6">
          
          <!-- JIKA BELUM ADA TUGAS YANG DIPILIH (Tampilan Daftar Tugas) -->
          <div v-if="!selectedTugas">
            <div v-if="daftarTugas.length > 0">
              <div 
                v-for="tugas in daftarTugas" 
                :key="tugas.id" 
                @click="pilihTugas(tugas)" 
                class="bg-white p-4 rounded-xl border border-gray-200 mb-4 shadow-sm cursor-pointer hover:bg-gray-50 transition"
              >
                <h3 class="font-bold text-gray-800">{{ tugas.judul_tugas }}</h3>
                <p class="text-sm text-gray-600 line-clamp-2">{{ tugas.deskripsi }}</p>
                <p class="text-xs text-red-500 mt-2 font-medium">Batas: {{ tugas.deadline || 'Tidak ada' }}</p>
              </div>
            </div>
            <div v-else class="text-gray-500 italic p-4 bg-gray-100 rounded-xl">
              Belum ada tugas untuk kelas ini.
            </div>
          </div>

          <!-- JIKA TUGAS DIPILIH (Tampilan Detail + UI Penilaian) -->
          <div v-else>
            <button @click="tutupTugas" class="mb-4 flex items-center text-gray-600 hover:text-black font-medium">
              ← Kembali ke Daftar Tugas
            </button>
            
            <!-- Info Detail Tugas -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
              <h1 class="text-2xl font-bold mb-2">{{ selectedTugas.judul_tugas }}</h1>
              <p class="text-sm text-gray-500 mb-4 font-medium">Batas Waktu: <span class="text-red-500">{{ selectedTugas.deadline || 'Tidak ada tenggat' }}</span></p>
              <div class="border-t pt-4">
                <p class="text-gray-800 leading-relaxed whitespace-pre-wrap">{{ selectedTugas.deskripsi }}</p>
              </div>
            </div>

            <!-- UI PENILAIAN (Terbagi 2 Kolom) -->
            <div class="grid gap-8 items-start" :class="selectedSiswaToGrade ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'">
              
              <!-- Kolom Kiri: Tabel Daftar Kiriman Siswa -->
              <div :class="!selectedSiswaToGrade ? 'w-full max-w-[700px]' : 'w-full'">
                <h6 class="text-lg font-bold mb-3 ml-1 text-[#333]">Daftar Kiriman Siswa</h6>
                
                <div v-if="isLoadingKiriman" class="text-gray-500 italic py-4">Memuat data kiriman...</div>
                
                <div v-else-if="daftarKirimanSiswa.length === 0" class="bg-[#EBEBEB] p-6 rounded-[15px] text-center text-gray-500 italic">
                  Belum ada siswa yang mengumpulkan tugas ini.
                </div>

                <div v-else class="bg-[#EBEBEB] rounded-[15px] shadow-sm overflow-hidden">
                  <table class="w-full text-left border-collapse">
                    <thead class="border-b-2 border-[#DEDEDE]">
                      <tr class="text-gray-500 text-[0.95rem]">
                        <th class="pl-6 py-3 font-semibold">Siswa</th>
                        <th class="font-semibold px-2">Nilai</th>
                        <th class="font-semibold px-2 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr 
                        v-for="siswa in daftarKirimanSiswa" 
                        :key="siswa.id" 
                        class="border-b border-[#DEDEDE] last:border-0 transition-colors"
                        :class="selectedSiswaToGrade?.id === siswa.id ? 'bg-[#B5C6D4]' : 'bg-transparent'"
                      >
                        <!-- Profil Siswa -->
                        <td class="flex items-center py-3 pl-6">
                          <div 
                            class="flex items-center justify-center text-center font-bold mr-3 w-[40px] h-[40px] rounded-full shrink-0 text-[0.9rem] uppercase"
                            :style="{ backgroundColor: getWarna(siswa.nama) + '40', color: getWarna(siswa.nama) }"
                          >
                            {{ getInisial(siswa.nama) }}
                          </div>
                          <div class="font-bold text-gray-900 text-[0.95rem] leading-tight">
                            <span class="block">{{ siswa.nama.split(' ').slice(0, 2).join(' ') }}</span>
                            <span class="block font-medium text-gray-700" v-if="siswa.nama.split(' ').length > 2">
                              {{ siswa.nama.split(' ').slice(2).join(' ') }}
                            </span>
                          </div>
                        </td>
                        
                        <!-- Nilai -->
                        <td class="px-2 text-[0.95rem]" :class="siswa.nilai !== null ? 'font-bold text-green-600' : 'text-red-500 font-medium'">
                          {{ siswa.nilai !== null ? siswa.nilai : 'Belum' }}
                        </td>
                        
                        <!-- Aksi -->
                        <td class="px-2 text-center">
                          <button 
                            type="button" 
                            class="text-xs px-5 py-1.5 rounded-full text-white font-medium transition-colors"
                            :class="siswa.nilai !== null ? 'bg-[#4A86A8] hover:bg-[#396b88]' : 'bg-[#929292] hover:bg-gray-600'"
                            @click.stop="pilihSiswaUntukDinilai(siswa)"
                          >
                            {{ siswa.nilai !== null ? 'Edit Nilai' : 'Beri Nilai' }}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Kolom Kanan: Form Penilaian -->
              <div v-if="selectedSiswaToGrade" class="w-full">
                <div class="flex justify-between items-center mb-3">
                  <h6 class="text-lg font-bold ml-1 text-[#333]">Form Penilaian</h6>
                  <button type="button" class="text-gray-400 hover:text-gray-700 font-bold text-2xl px-2 focus:outline-none leading-none" @click="selectedSiswaToGrade = null">
                    &times;
                  </button>
                </div>
                
                <div class="bg-[#F1F1F1] p-6 rounded-[15px] shadow-sm">
                  
                  <!-- Profil Siswa -->
                  <div class="flex items-center mb-4">
                    <div 
                      class="flex items-center justify-center text-center font-bold mr-3 w-[40px] h-[40px] rounded-full text-[0.9rem] uppercase"
                      :style="{ backgroundColor: getWarna(selectedSiswaToGrade.nama) + '40', color: getWarna(selectedSiswaToGrade.nama) }"
                    >
                      {{ getInisial(selectedSiswaToGrade.nama) }}
                    </div>
                    <span class="font-bold text-gray-900 text-[1.05rem]">{{ selectedSiswaToGrade.nama }}</span>
                  </div>
                  
                  <hr class="mb-4 border-[#DEDEDE] opacity-100">
                  
                  <!-- Card File Jawaban -->
                  <div 
                    @click="bukaFileJawaban(selectedSiswaToGrade.file_jawaban)"
                    class="p-3 mb-5 bg-[#E2E2E2] rounded-[10px] cursor-pointer hover:bg-[#d5d5d5] transition-colors border border-gray-300"
                  >
                    <small class="text-gray-500 font-semibold text-xs">File kiriman (Klik untuk melihat)</small>
                    <div class="flex items-center mt-2">
                      <div class="text-white font-bold bg-[#6C757D] rounded-[6px] text-[0.75rem] w-[35px] h-[35px] flex items-center justify-center shrink-0 mr-3">
                        FILE
                      </div>
                      <div class="overflow-hidden">
                        <div class="font-bold text-[#4A86A8] text-[0.95rem] truncate">
                          {{ formatNamaFile(selectedSiswaToGrade.file_jawaban) }}
                        </div>
                        <small class="text-gray-500 text-[0.8rem]">Terkumpul: {{ selectedSiswaToGrade.waktu_kumpul }}</small>
                      </div>
                    </div>
                  </div>

                  <!-- Input Nilai & Komentar -->
                  <label class="text-gray-500 font-semibold mb-2 block text-[0.9rem]">Nilai (0-100)</label>
                  <input 
                    type="number" 
                    class="w-full mb-4 px-4 py-2 border border-[#A9A9A9] rounded-full text-center font-bold text-gray-900 text-[1.1rem] bg-transparent focus:outline-none focus:border-[#4A86A8] h-[45px]" 
                    v-model="inputNilai"
                    placeholder="Masukkan angka..."
                  >

                  <label class="text-gray-500 font-semibold mb-2 block text-[0.9rem]">Komentar (Opsional)</label>
                  <textarea 
                    class="w-full mb-5 p-3 border border-[#A9A9A9] rounded-[10px] text-gray-900 font-medium bg-transparent focus:outline-none focus:border-[#4A86A8]" 
                    rows="2" 
                    v-model="inputKomentar"
                    placeholder="Tulis umpan balik..."
                  ></textarea>
                  
                  <!-- Tombol Simpan -->
                  <div class="text-end">
                    <button 
                      type="button" 
                      @click="simpanNilai" 
                      :disabled="isSubmittingNilai"
                      class="px-6 py-2 font-bold bg-[#4A86A8] text-white rounded-full text-[0.9rem] hover:bg-[#396b88] transition-colors shadow-none border-0 disabled:opacity-50"
                    >
                      {{ isSubmittingNilai ? 'Menyimpan...' : 'Kirim Nilai' }}
                    </button>
                  </div>
                  
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- ================== TAB ORANG ================== -->
        <div v-else-if="activeTab === 'orang'" class="mt-6">
          <div class="text-gray-500 italic p-4 bg-gray-100 rounded-xl">
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
import Swal from 'sweetalert2' // Pastikan library ini sudah terinstall di project

const router = useRouter()
const kelasList = ref([])
const daftarTugas = ref([])
const activeTab = ref('materi')
const isDetailOpen = ref(false)

// State Detail & Penilaian
const selectedKelas = ref(null)
const selectedTugas = ref(null)
const selectedMateri = ref(null)
const daftarKirimanSiswa = ref([])
const selectedSiswaToGrade = ref(null)
const inputNilai = ref('')
const inputKomentar = ref('')
const isLoadingKiriman = ref(false)
const isSubmittingNilai = ref(false)

// ==========================================
// MENGAMBIL DATA KELAS DAN TUGAS
// ==========================================
const fetchClasses = async () => {
  try {
    const res = await apiClient.get('/kelas')
    kelasList.value = res.data.data || res.data || []
  } catch (err) { 
    console.error('Gagal mengambil daftar kelas:', err) 
  }
}

const fetchTugas = async (kelasId) => {
  try {
    const res = await apiClient.get(`/tugas?kelas_id=${kelasId}`)
    const semuaTugas = res.data.data || res.data || []
    daftarTugas.value = semuaTugas.filter(tugas => tugas.kelas_id == kelasId)
  } catch (err) { 
    console.error('Gagal mengambil tugas:', err) 
  }
}

// ==========================================
// MENGAMBIL DATA KIRIMAN TUGAS SISWA (GET)
// ==========================================
const fetchJawabanSiswa = async (tugasId) => {
  isLoadingKiriman.value = true
  try {
    const res = await apiClient.get(`/tugas/${tugasId}/jawaban`)
    const dataJawaban = res.data.data || res.data || []
    
    daftarKirimanSiswa.value = dataJawaban.map(item => ({
      id: item.id, 
      user_id: item.user_id,
      nama: item.nama_lengkap || item.name || `Siswa (ID: ${item.user_id})`,
      nilai: item.nilai !== null ? Number(item.nilai) : null,
      file_jawaban: item.file_jawaban,
      waktu_kumpul: formatWaktu(item.submitted || item.created_at)
    }))
  } catch (error) {
    console.error('Gagal memuat jawaban siswa:', error)
  } finally {
    isLoadingKiriman.value = false
  }
}

// ==========================================
// MENYIMPAN NILAI TUGAS (POST)
// ==========================================
const simpanNilai = async () => {
  if (!selectedSiswaToGrade.value || inputNilai.value === '') {
    Swal.fire('Peringatan', 'Harap masukkan nilai terlebih dahulu!', 'warning')
    return
  }

  isSubmittingNilai.value = true
  try {
    await apiClient.post(`/jawaban/${selectedSiswaToGrade.value.id}/nilai`, {
      nilai: parseInt(inputNilai.value)
    })

    Swal.fire('Berhasil!', 'Nilai telah disimpan.', 'success')
    
    // Update array lokal agar langsung berubah di tabel
    const idx = daftarKirimanSiswa.value.findIndex(s => s.id === selectedSiswaToGrade.value.id)
    if (idx !== -1) {
      daftarKirimanSiswa.value[idx].nilai = parseInt(inputNilai.value)
      selectedSiswaToGrade.value = null // Tutup form setelah sukses
    }
  } catch (error) {
    console.error('Gagal menyimpan nilai:', error)
    Swal.fire('Gagal!', 'Terjadi kesalahan server.', 'error')
  } finally {
    isSubmittingNilai.value = false
  }
}

// ==========================================
// LOGIKA INTERAKSI & NAVIGASI
// ==========================================
watch(activeTab, (newTab) => {
  if (newTab === 'tugas' && selectedKelas.value) {
    fetchTugas(selectedKelas.value.id)
    tutupTugas() // Pastikan saat ganti tab, detail tugas tertutup
  }
})

// Saat Tugas Diklik
const pilihTugas = async (tugas) => {
  selectedTugas.value = tugas
  selectedSiswaToGrade.value = null // Reset form nilai
  await fetchJawabanSiswa(tugas.id) // Tarik data jawaban dari API
}

// Saat Tombol "Beri Nilai" Diklik
const pilihSiswaUntukDinilai = (siswa) => { 
  if (selectedSiswaToGrade.value?.id === siswa.id) {
    selectedSiswaToGrade.value = null 
  } else {
    selectedSiswaToGrade.value = siswa 
    inputNilai.value = siswa.nilai !== null ? siswa.nilai : ''
    inputKomentar.value = '' // Reset komentar
  }
}

const tutupTugas = () => {
  selectedTugas.value = null
  selectedSiswaToGrade.value = null
  daftarKirimanSiswa.value = []
}

const pilihKelas = (k) => { 
  selectedKelas.value = k; 
  isDetailOpen.value = true;
  activeTab.value = 'materi'; 
  fetchTugas(k.id); 
}

const tutupDetail = () => { 
  selectedKelas.value = null; 
  isDetailOpen.value = false;
  tutupTugas();
}

const bukaMateri = (f) => { selectedMateri.value = f }
const tutupMateri = () => { selectedMateri.value = null }

// ==========================================
// FUNGSI PENDUKUNG (HELPERS)
// ==========================================
const bukaFileJawaban = (namaFile) => {
  if (!namaFile) return
  window.open(`http://192.168.1.10:8000/uploads/jawaban/${namaFile}`, '_blank')
}

const formatNamaFile = (path) => {
  if (!path) return 'File Jawaban'
  const parts = path.split('/')
  return parts[parts.length - 1]
}

const formatWaktu = (dateString) => {
  if (!dateString) return '-'
  const tgl = new Date(dateString)
  return tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + 
         tgl.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const getInisial = (nama) => {
  if (!nama) return 'S'
  return nama.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

const getWarna = (nama) => {
  if (!nama) return '#5A8DDF'
  const warna = ['#5A8DDF', '#82B974', '#C36881', '#7A7A7A', '#A3B46D', '#A172B5', '#D28F5A']
  let hash = 0
  for (let i = 0; i < nama.length; i++) hash = nama.charCodeAt(i) + ((hash << 5) - hash)
  return warna[Math.abs(hash) % warna.length]
}

onMounted(() => {
  fetchClasses()
})
</script>

<style scoped>
/* Menghilangkan panah atas-bawah pada input angka */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>