<template>
  <DashboardLayout :hideSidebar="true">
    
    <!-- ========================================================================= -->
    <!-- SUB-HEADER BARU -->
    <!-- ========================================================================= -->
    <div class="w-full flex items-center justify-between px-6 text-white bg-[#4A86A8]" style="height: 65px;">
      
      <!-- Sisi Kiri: Tombol Back & Navigasi Breadcrumb -->
      <div class="flex items-center gap-3">
        <!-- Tombol Back Chevron -->
        <button 
          type="button" 
          @click="kembaliKeTugas" 
          class="p-0 bg-transparent border-0 text-white flex items-center opacity-75 hover:opacity-100 transition-opacity focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
        
        <!-- Teks Breadcrumb Navigasi -->
        <div class="flex items-center gap-2 text-[0.95rem] whitespace-nowrap">
          <span class="opacity-50 cursor-pointer hover:opacity-80" @click="kembaliKeTugas">Tugas</span>
          <span class="opacity-50">/</span>
          <span class="font-bold text-white">Nilai Kiriman Siswa</span>
        </div>
      </div>

      <!-- Sisi Kanan: Avatar Profil User (Inisial Nama) -->
      <div class="flex items-center">
        <div 
          class="bg-white text-gray-900 font-bold flex items-center justify-center rounded-full shadow-sm w-[35px] h-[35px] text-[0.85rem]"
        >
          {{ getInisial(userName).substring(0, 1) }}
        </div>
      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- KONTEN UTAMA: GRID DATA TABEL DAN FORM PENILAIAN                         -->
    <!-- ========================================================================= -->
    <div class="w-full px-6 mx-auto mt-4 mb-5">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-10 text-gray-500 italic">
        Memuat daftar kiriman siswa...
      </div>

      <div v-else
        class="grid gap-8 items-start"
        :class="selectedSiswa ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'"
      >
        
        <!-- ================= KOLOM KIRI: DAFTAR SISWA ================= -->
        <div :class="!selectedSiswa ? 'w-full max-w-[650px]' : 'w-full'">
          <h6 class="text-base font-bold mb-3 ml-1 text-[#333]">Daftar Kiriman Siswa</h6>
          
          <!-- Jika Belum Ada yang Kumpul -->
          <div v-if="daftarSiswa.length === 0" class="bg-[#EBEBEB] p-6 rounded-[15px] text-center text-gray-500 italic">
            Belum ada siswa yang mengumpulkan tugas ini.
          </div>

          <div v-else class="bg-[#EBEBEB] rounded-[15px] shadow-sm overflow-hidden">
            <table class="w-full text-left border-collapse">
              
              <!-- Header Tabel -->
              <thead class="border-b-2 border-[#DEDEDE]">
                <tr class="text-gray-500 text-[0.95rem]">
                  <th class="pl-6 py-3 font-semibold">Siswa</th>
                  <th class="font-semibold px-2">Nilai</th>
                  <th class="font-semibold px-2">Aksi</th>
                </tr>
              </thead>
              
              <!-- Body Tabel -->
              <tbody>
                <tr 
                  v-for="siswa in daftarSiswa" 
                  :key="siswa.id" 
                  class="border-b border-[#DEDEDE] last:border-0 transition-colors"
                  :class="selectedSiswa?.id === siswa.id ? 'bg-[#B5C6D4]' : 'bg-transparent'"
                >
                  
                  <!-- Profil Siswa (Avatar & Nama) -->
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
                  
                  <!-- Kolom Nilai -->
                  <td class="px-2 text-[0.95rem]" :class="siswa.nilai !== null ? 'font-bold text-green-600' : 'text-red-500 font-medium'">
                    {{ siswa.nilai !== null ? siswa.nilai : 'Belum' }}
                  </td>
                  
                  <!-- Tombol Aksi -->
                  <td class="px-2">
                    <button 
                      type="button" 
                      class="text-xs px-5 py-1.5 rounded-full text-white font-medium transition-colors"
                      :class="siswa.nilai !== null ? 'bg-[#4A86A8] hover:bg-blue-600' : 'bg-[#929292] hover:bg-gray-600'"
                      @click.stop="pilihSiswa(siswa)"
                    >
                      {{ siswa.nilai !== null ? 'Edit Nilai' : 'Beri Nilai' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ================= KOLOM KANAN: FORM PENILAIAN ================= -->
        <div v-if="selectedSiswa" class="w-full">
          <div class="flex justify-between items-center mb-3">
            <h6 class="text-base font-bold ml-1 text-[#333]">Form Penilaian</h6>
            <button 
              type="button" 
              class="text-gray-400 hover:text-gray-700 font-bold text-xl px-2 focus:outline-none" 
              @click="selectedSiswa = null"
            >
              &times;
            </button>
          </div>
          
          <div class="bg-[#F1F1F1] p-6 rounded-[15px] shadow-sm">
            
            <!-- Profil Siswa Terpilih -->
            <div class="flex items-center mb-3">
              <div 
                class="flex items-center justify-center text-center font-bold mr-3 w-[40px] h-[40px] rounded-full text-[0.9rem] uppercase"
                :style="{ backgroundColor: getWarna(selectedSiswa.nama) + '40', color: getWarna(selectedSiswa.nama) }"
              >
                {{ getInisial(selectedSiswa.nama) }}
              </div>
              <span class="font-bold text-gray-900 text-[1.05rem]">{{ selectedSiswa.nama }}</span>
            </div>
            
            <hr class="mb-4 border-[#DEDEDE] opacity-100">
            
            <!-- Card File Kiriman (Bisa Diklik untuk Download) -->
            <div 
              @click="bukaFileJawaban(selectedSiswa.file_jawaban)"
              class="p-3 mb-4 bg-[#E2E2E2] rounded-[10px] cursor-pointer hover:bg-[#d5d5d5] transition-colors border border-gray-300"
            >
              <small class="text-gray-500 font-semibold text-xs">File kiriman (Klik untuk membuka)</small>
              <div class="flex items-center mt-2">
                <div class="text-white font-bold bg-[#6C757D] rounded-[6px] text-[0.75rem] w-[35px] h-[35px] flex items-center justify-center shrink-0 mr-3">
                  FILE
                </div>
                <div class="overflow-hidden">
                  <div class="font-bold text-[#4A86A8] text-[0.95rem] truncate">
                    {{ formatNamaFile(selectedSiswa.file_jawaban) || 'Jawaban_Siswa' }}
                  </div>
                  <small class="text-gray-500 text-[0.8rem]">Terkumpul: {{ selectedSiswa.waktu_kumpul }}</small>
                </div>
              </div>
            </div>

            <!-- Input Nilai -->
            <label class="text-gray-500 font-semibold mb-2 block text-[0.9rem]">Nilai (0-100)</label>
            <input 
              type="number" 
              class="w-full mb-4 px-4 py-2 border border-[#A9A9A9] rounded-full text-center font-bold text-gray-900 text-[1.1rem] bg-transparent focus:outline-none focus:border-[#4A86A8] h-[45px]" 
              v-model="inputNilai"
              placeholder="Masukkan angka..."
            >
            
            <!-- Tombol Kirim Nilai -->
            <div class="text-end">
              <button 
                type="button" 
                @click="simpanNilai" 
                :disabled="isSubmitting"
                class="px-5 py-2 font-semibold bg-[#467FB3] text-white rounded-full text-[0.9rem] hover:bg-blue-600 transition-colors shadow-none border-0 disabled:opacity-50"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Kirim Nilai' }}
              </button>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios.js'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const tugasId = route.params.id // Mengambil ID tugas dari URL

const userName = localStorage.getItem('user_name') || 'Guru'

// State Pengendali Utama
const selectedSiswa = ref(null) 
const inputNilai = ref('')
const daftarSiswa = ref([])
const isLoading = ref(true)
const isSubmitting = ref(false)

// ==========================================
// MENGAMBIL DATA JAWABAN SISWA (GET API)
// ==========================================
const fetchJawabanSiswa = async () => {
  isLoading.value = true
  try {
    // Memanggil rute buatan temanmu: GET /tugas/{tugasId}/jawaban
    const res = await apiClient.get(`/tugas/${tugasId}/jawaban`)
    const dataJawaban = res.data.data || res.data || []
    
    // Format data agar pas dengan UI
    daftarSiswa.value = dataJawaban.map(item => ({
      id: item.id, // ID pengumpulan (primary key tabel pengumpulan_tugas)
      user_id: item.user_id,
      nama: item.nama_lengkap || item.name || `Siswa (ID: ${item.user_id})`,
      nilai: item.nilai !== null ? Number(item.nilai) : null,
      file_jawaban: item.file_jawaban,
      waktu_kumpul: formatWaktu(item.submitted || item.created_at)
    }))

  } catch (error) {
    console.error('Gagal mengambil data jawaban siswa:', error)
    Swal.fire('Error', 'Gagal memuat data jawaban siswa.', 'error')
  } finally {
    isLoading.value = false
  }
}

// ==========================================
// MENYIMPAN NILAI KE BACKEND (POST API)
// ==========================================
const simpanNilai = async () => {
  if (!selectedSiswa.value || inputNilai.value === '') {
    Swal.fire('Peringatan', 'Harap masukkan nilai terlebih dahulu!', 'warning')
    return
  }

  isSubmitting.value = true
  try {
    // Memanggil rute buatan temanmu: POST /jawaban/{id}/nilai
    await apiClient.post(`/jawaban/${selectedSiswa.value.id}/nilai`, {
      nilai: parseInt(inputNilai.value)
    })

    Swal.fire('Berhasil!', 'Nilai telah disimpan.', 'success')
    
    // Update data di array lokal agar tampilan tabel langsung berubah
    const idx = daftarSiswa.value.findIndex(s => s.id === selectedSiswa.value.id)
    if (idx !== -1) {
      daftarSiswa.value[idx].nilai = parseInt(inputNilai.value)
      selectedSiswa.value = null // Tutup form
    }
  } catch (error) {
    console.error('Gagal menyimpan nilai:', error)
    Swal.fire('Gagal!', 'Gagal menyimpan nilai ke server.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// ==========================================
// FUNGSI PENDUKUNG (UI & HELPER)
// ==========================================
const kembaliKeTugas = () => {
  router.push({ name: 'tugas-guru' }) // Pastikan name route-nya sesuai
}

const pilihSiswa = (siswa) => { 
  if (selectedSiswa.value?.id === siswa.id) {
    selectedSiswa.value = null 
  } else {
    selectedSiswa.value = siswa 
  }
}

watch(selectedSiswa, (newSiswa) => {
  if (newSiswa) {
    inputNilai.value = newSiswa.nilai !== null ? newSiswa.nilai : ''
  }
})

// Fungsi membuka file jawaban siswa
const bukaFileJawaban = (namaFile) => {
  if (!namaFile) {
    Swal.fire('Maaf', 'Siswa tidak melampirkan file yang valid.', 'info')
    return
  }
  window.open(`http://192.168.1.10:8000/uploads/jawaban/${namaFile}`, '_blank')
}

// Membersihkan nama file yang panjang di UI
const formatNamaFile = (path) => {
  if (!path) return ''
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
  fetchJawabanSiswa()
})
</script>

<style scoped>
/* Menghilangkan tombol arrow spin bawaan input type=number */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>