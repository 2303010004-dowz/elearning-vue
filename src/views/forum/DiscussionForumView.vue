<template>
  <!-- Menambahkan props dinamis untuk menyembunyikan sidebar saat diskusi dipilih -->
  <DashboardLayout :hideSidebar="selectedDiskusi !== null">
    
    <!-- ========================================================================= -->
    <!-- TAMPILAN 1: DAFTAR FORUM DISKUSI (Muncul jika belum ada diskusi yang dipilih) -->
    <!-- ========================================================================= -->
    <div v-if="!selectedDiskusi" class="w-full px-4 mx-auto mt-4 mb-5">
      <h4 class="text-xl font-bold mb-4 text-gray-900">Forum Diskusi</h4>

      <div class="flex flex-col gap-3">
        <!-- Item Diskusi -->
        <div 
          v-for="diskusi in daftarDiskusi" 
          :key="diskusi.id" 
          @click="pilihDiskusi(diskusi)"
          class="bg-[#EBEBEB] p-4 rounded-[15px] shadow-sm cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-95"
        >
          <div class="flex items-start">
            <!-- Badge Kode Kelas - PERBAIKAN: Mengganti justify-content-center menjadi justify-center -->
            <div class="bg-gray-500 text-white font-bold flex items-center justify-center mr-3 w-[50px] h-[50px] rounded-[10px] text-sm shrink-0">
              {{ diskusi.kode }}
            </div>
            
            <!-- Detail Informasi -->
            <div class="flex-grow">
              <h5 class="font-bold text-gray-900 mb-1 text-[1.1rem]">{{ diskusi.matpel }} - {{ diskusi.kelas }}</h5>
              <div class="text-gray-500 text-xs mb-2">{{ diskusi.guru }}</div>
              <p class="text-gray-600 mb-3 text-[0.95rem]">{{ diskusi.konten }}</p>
              
              <div class="flex justify-between items-center text-gray-500 text-[0.85rem]">
                <span>{{ diskusi.tanggal }} &bull; {{ diskusi.jam }}</span>
                <span class="font-bold text-gray-900">{{ diskusi.balasan.length }} Balasan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAMPILAN 2: DETAIL DISKUSI & KOMENTAR (Full Page tanpa Sidebar)            -->
    <!-- ========================================================================= -->
    <div v-else class="w-full min-h-screen bg-[#F4F4F4] p-0 flex flex-col">
      
      <!-- Sub-header Detail (Diberi padding atas & tinggi yang ideal agar tidak mepet) -->
      <div class="w-full flex items-center px-8 bg-[#F8F9FA] h-[75px] border-b border-gray-200 mb-6 shrink-0 pt-2">
        <!-- Tombol Back berupa Chevron -->
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
          <span class="text-gray-900 font-bold">{{ selectedDiskusi.judulTopik }}</span>
        </div>
      </div>

      <!-- Konten Utama Detail (Mendominasi Area Tengah) -->
      <div class="w-full max-w-[1200px] mx-auto px-6 flex-grow flex flex-col justify-between mb-8">
        <div class="w-full">
          <!-- Card Pertanyaan Utama -->
          <div class="bg-[#EBEBEB] p-6 mb-6 rounded-[15px]">
            <!-- Header Profil -->
            <div class="flex items-center mb-3">
              <!-- Avatar Pembuat - PERBAIKAN: Mengganti justify-content-center menjadi justify-center -->
              <div class="bg-gray-400 text-white font-bold flex items-center justify-center mr-3 w-[45px] h-[45px] rounded-full text-sm shrink-0">
                {{ getInisial(selectedDiskusi.pembuat) }}
              </div>
              <div>
                <div class="font-bold text-gray-900 text-sm leading-tight">{{ selectedDiskusi.pembuat }}</div>
                <small class="text-gray-400 text-xs">{{ selectedDiskusi.tanggal }}, {{ selectedDiskusi.jam }}</small>
              </div>
            </div>
            <!-- Isi Konten Utama -->
            <p class="text-gray-700 text-[0.95rem] leading-relaxed pl-1 mt-2">
              {{ selectedDiskusi.konten }}
            </p>
          </div>

          <!-- Daftar Balasan / Komentar -->
          <div class="flex flex-col gap-5 mb-8 pl-4 sm:pl-12">
            <div v-for="reply in selectedDiskusi.balasan" :key="reply.id" class="w-full">
              <!-- Header Profil Komentator -->
              <div class="flex items-center mb-1">
                <!-- Avatar Komentator - PERBAIKAN: Mengganti justify-content-center menjadi justify-center -->
                <div class="font-bold flex items-center justify-center mr-3 w-[36px] h-[36px] rounded-full text-[0.8rem] bg-[#FFE0B2] text-[#E65100] shrink-0">
                  {{ getInisial(reply.nama) }}
                </div>
                <div>
                  <div class="font-bold text-gray-900 text-xs leading-tight">{{ reply.nama }}</div>
                  <small class="text-gray-400 text-[0.70rem]">{{ reply.tanggal }}, {{ reply.jam }}</small>
                </div>
              </div>
              
              <!-- Balon Teks Komentar -->
              <div class="p-3 bg-[#DEDEDE] rounded-[10px] text-[0.95rem] text-gray-700 inline-block w-full max-w-[85%] ml-[48px]">
                {{ reply.teks }}
              </div>
            </div>
          </div>
        </div>

        <!-- Area Input Komentar Sejajar -->
        <div class="flex items-center gap-4 mt-auto pt-4 w-full pl-4 sm:pl-12">
          <div class="flex-grow">
            <input 
              type="text" 
              v-model="inputKomentarBaru" 
              class="w-full outline-none focus:outline-none px-6 rounded-full bg-[#F1F1F1] border border-[#BCBCBC] h-[50px] text-[0.95rem]" 
              placeholder="Tulis balasan..." 
              @keyup.enter="kirimBalasan"
            />
          </div>
          <!-- Tombol Send - PERBAIKAN: Mengganti justify-content-center menjadi justify-center -->
          <button 
            type="button" 
            @click="kirimBalasan" 
            class="p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer text-gray-500 hover:text-gray-800 transition-colors shrink-0"
          >
            <!-- Icon Send dengan rotasi presisi menyudut -->
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
import { ref } from 'vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

// Mendapatkan nama user asli terlogin dari sessionStorage/localStorage secara dinamis
const userName = localStorage.getItem('user_name') || 'User'

// State Pengendali Halaman & Input
const selectedDiskusi = ref(null)
const inputKomentarBaru = ref('')

// Mock Data Gabungan
const daftarDiskusi = ref([
  {
    id: 1,
    kode: 'BIN',
    matpel: 'Bahasa Indonesia',
    kelas: '7A',
    guru: 'Budi, S.Pd',
    judulTopik: 'Panduan Pengerjaan Makalah',
    pembuat: 'Nabit Sidiq Amarullah',
    konten: 'Mohon maaf pak apakah ada panduan pengerjaan untuk penulisan makalahnya pak ?',
    tanggal: '1 Apr 2026',
    jam: '09.45',
    balasan: [
      { id: 101, nama: 'Aisyah', tanggal: '1 Apr 2026', jam: '09.48', teks: 'Iya pak, mungkin lain kali ada panduannya pak ?' }
    ]
  },
  {
    id: 2,
    kode: 'BSN',
    matpel: 'Bahasa Sunda',
    kelas: '7A',
    guru: 'Neneng Kurniasih, S.Pd',
    judulTopik: 'Rundayan Kulawarga',
    pembuat: 'Ari Putra',
    konten: 'Manawi aya anu kirang ngartos mangga tiasa ditaroskeun nya bageur',
    tanggal: '18 Apr 2026',
    jam: '11.45',
    balasan: []
  }
])

// Logika Navigasi & Aksi
const pilihDiskusi = (diskusi) => {
  selectedDiskusi.value = diskusi
}

const kembaliKeDaftar = () => {
  selectedDiskusi.value = null
}

const kirimBalasan = () => {
  if (!inputKomentarBaru.value.trim()) return
  
  // Membuat penanda waktu kirim komentar secara dinamis/realtime
  const sekarang = new Date()
  const opsiTanggal = { day: 'numeric', month: 'short', year: 'numeric' }
  const tanggalFormat = sekarang.toLocaleDateString('id-ID', opsiTanggal)
  
  // PERBAIKAN: Menghapus kata 'Thermal =' yang merusak jalannya fungsi
  const jamFormat = sekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')

  selectedDiskusi.value.balasan.push({
    id: Date.now(),
    nama: userName, // Otomatis menggunakan nama Guru yang sedang login
    tanggal: tanggalFormat,
    jam: jamFormat,
    teks: inputKomentarBaru.value
  })
  
  inputKomentarBaru.value = '' 
}

const getInisial = (nama) => {
  if (!nama) return ''
  return nama.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}
</script>

<style scoped>
</style>