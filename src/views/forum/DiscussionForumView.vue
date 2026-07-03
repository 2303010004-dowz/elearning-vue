<template>
  <DashboardLayout :hideSidebar="selectedKelasDiskusi !== null">
    
    <div v-if="!selectedKelasDiskusi" class="w-full px-4 mx-auto mt-4 mb-5 max-w-5xl">
      <h4 class="text-xl font-bold mb-4 text-gray-900">Forum Diskusi Kelas</h4>

      <div v-if="isLoading" class="text-gray-500 italic p-4 bg-gray-100 rounded-xl text-center">
        Memuat daftar kelas...
      </div>
      <div v-else-if="daftarKelas.length === 0" class="text-gray-500 italic p-6 bg-gray-100 rounded-xl text-center">
        Kamu belum memiliki atau bergabung di kelas manapun.
      </div>

      <div v-else class="flex flex-col gap-3">
        <div 
          v-for="kelas in daftarKelas" 
          :key="kelas.id" 
          @click="bukaRuangDiskusi(kelas)"
          class="bg-[#EBEBEB] p-4 rounded-[15px] shadow-sm cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-95"
        >
          <div class="flex items-start">
            <div class="bg-gray-500 text-white font-bold flex items-center justify-center mr-3 w-[50px] h-[50px] rounded-[10px] text-sm shrink-0 uppercase">
              {{ kelas.nama_kelas ? kelas.nama_kelas.substring(0, 3) : 'KLS' }}
            </div>
            
            <div class="flex-grow">
              <h5 class="font-bold text-gray-900 mb-1 text-[1.1rem]">{{ kelas.nama_kelas }}</h5>
              <div class="text-gray-500 text-xs mb-2">Kode: {{ kelas.kode_kelas }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="w-full min-h-screen bg-[#F4F4F4] p-0 flex flex-col">
      
      <div class="w-full flex items-center px-8 bg-[#F8F9FA] h-[75px] border-b border-gray-200 mb-6 shrink-0 pt-2">
        <button 
          type="button" 
          @click="kembaliKeDaftar" 
          class="p-0 mr-3 bg-transparent border-0 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
        <div class="text-[1.05rem] flex items-center gap-2">
          <span class="text-gray-500 cursor-pointer hover:underline" @click="kembaliKeDaftar">Forum Diskusi</span>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900 font-bold">{{ selectedKelasDiskusi.nama_kelas }}</span>
        </div>
      </div>

      <div class="w-full max-w-[1200px] mx-auto px-6 flex-grow flex flex-col justify-between mb-8">
        
        <div class="w-full flex flex-col gap-4 overflow-y-auto mb-6 pr-2 max-h-[calc(100vh-230px)]">
          <div v-if="listPesan.length === 0" class="text-gray-500 italic text-center p-4">
            Belum ada obrolan di kelas ini. Yuk, mulai obrolan pertama!
          </div>

          <div 
            v-for="chat in listPesan" 
            :key="chat.id" 
            class="w-full flex flex-col"
          >
            <div class="flex items-center mb-1">
              <div class="font-bold flex items-center justify-center mr-2 w-[34px] h-[34px] rounded-full text-[0.75rem] bg-[#FFE0B2] text-[#E65100] shrink-0 uppercase">
                {{ getInisial(chat.nama_lengkap) }}
              </div>
              <div>
                <div class="font-bold text-gray-900 text-xs leading-tight">{{ chat.nama_lengkap }}</div>
                <small class="text-gray-400 text-[0.68rem]">{{ formatWaktu(chat.created_at) }}</small>
              </div>
            </div>
            
            <div class="p-3 bg-[#DEDEDE] rounded-[10px] text-[0.95rem] text-gray-700 inline-block w-fit max-w-[85%] ml-[42px] whitespace-pre-wrap">
              {{ chat.isi_pesan }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4 mt-auto pt-2 w-full">
          <div class="flex-grow">
            <input 
              type="text" 
              v-model="inputPesanBaru" 
              class="w-full outline-none focus:outline-none px-6 rounded-full bg-[#F1F1F1] border border-[#BCBCBC] h-[50px] text-[0.95rem]" 
              placeholder="Ketik pesan diskusi..." 
              @keyup.enter="kirimPesanDiskusi"
              :disabled="isSending"
            />
          </div>
          <button 
            type="button" 
            @click="kirimPesanDiskusi" 
            :disabled="isSending || !inputPesanBaru.trim()"
            class="p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer text-gray-500 hover:text-gray-800 disabled:opacity-50 transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-send-fill transform rotate-45 mb-1" viewBox="0 0 16 16">
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.26.41a.5.5 0 0 0 .88-.083l6-15Z"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import apiClient from '@/axios.js'

// Variabel Kontrol Utama
const selectedKelasDiskusi = ref(null)
const inputPesanBaru = ref('')
const isLoading = ref(true)
const isSending = ref(false)

// Data State
const daftarKelas = ref([])
const listPesan = ref([])

// 1. DAFTARKAN LIST KELAS (Otomatis deteksi Guru / Siswa)
const fetchDaftarKelas = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token_jwt')
    const config = { headers: { Authorization: `Bearer ${token}` } }
    let semuaKelas = []

    // A. Coba ambil kelas Siswa (Yang diikuti)
    try {
      const resSiswa = await apiClient.get('/kelas/joined', config)
      const dataSiswa = resSiswa.data.data || resSiswa.data || []
      if (Array.isArray(dataSiswa)) semuaKelas = [...semuaKelas, ...dataSiswa]
    } catch (e) { /* Abaikan jika error / dia bukan siswa */ }

    // B. Coba ambil kelas Guru (Yang dibuat)
    try {
      const resGuru = await apiClient.get('/kelas', config)
      const dataGuru = resGuru.data.data || resGuru.data || []
      if (Array.isArray(dataGuru)) {
        // Hindari data dobel jika ada ID yang sama
        dataGuru.forEach(kelas => {
          if (!semuaKelas.find(k => k.id === kelas.id)) {
            semuaKelas.push(kelas)
          }
        })
      }
    } catch (e) { /* Abaikan jika error / dia bukan guru */ }

    daftarKelas.value = semuaKelas

  } catch (error) {
    console.error('Gagal memuat list kelas diskusi:', error)
  } finally {
    isLoading.value = false
  }
}

// 2. AMBIL RIWAYAT CHAT KELAS TERTENTU
const bukaRuangDiskusi = async (kelas) => {
  selectedKelasDiskusi.value = kelas
  await fetchRiwayatChat(kelas.id)
}

const fetchRiwayatChat = async (kelasId) => {
  try {
    const token = localStorage.getItem('token_jwt')
    const config = { headers: { Authorization: `Bearer ${token}` } }
    
    const res = await apiClient.get(`/kelas/${kelasId}/diskusi`, config)
    listPesan.value = res.data.data || res.data || []
  } catch (error) {
    console.error('Gagal mengambil riwayat obrolan:', error)
  }
}

const kembaliKeDaftar = () => {
  selectedKelasDiskusi.value = null
  listPesan.value = []
  fetchDaftarKelas()
}

// 3. FUNGSI KIRIM CHAT BARU
const kirimPesanDiskusi = async () => {
  if (!inputPesanBaru.value.trim() || isSending.value) return
  
  isSending.value = true
  const kelasId = selectedKelasDiskusi.value.id

  try {
    const token = localStorage.getItem('token_jwt')
    
    await apiClient.post(`/kelas/${kelasId}/diskusi`, 
      { isi_pesan: inputPesanBaru.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // Memuat ulang riwayat chat agar chat terbaru langsung nangkring di bawah
    await fetchRiwayatChat(kelasId)
    inputPesanBaru.value = '' 
  } catch (error) {
    console.error('Gagal mengirim pesan:', error)
    alert('Gagal mengirim pesan, pastikan koneksi jaringan aman.')
  } finally {
    isSending.value = false
  }
}

// Helper Format Desain Waktu
const formatWaktu = (dateString) => {
  if (!dateString) return ''
  const tgl = new Date(dateString)
  return tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ', ' + 
         tgl.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
}

const getInisial = (nama) => {
  if (!nama) return 'U'
  return nama.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

onMounted(() => {
  fetchDaftarKelas()
})
</script>