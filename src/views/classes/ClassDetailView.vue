<template>
  <div class="flex min-h-screen bg-[#F3F3F3] font-sans text-gray-800">
    <main class="flex-1 p-8">
      
      <!-- HEADER TETAP -->
      <div class="mb-8 flex items-center">
        <button @click="$router.back()" class="mr-4"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
        <span class="text-gray-500 mr-2">Kelas saya</span>
        <h1 class="text-xl font-bold text-gray-800">Bahasa Indonesia - 7A</h1>
      </div>

      <!-- TABS NAVIGASI -->
      <div class="border-b border-gray-400 mb-8 flex gap-12">
        <button @click="currentTab = 'materi'; selectedTask = null" :class="currentTab === 'materi' ? 'pb-3 border-b-2 border-gray-800 font-bold text-gray-900' : 'pb-3 text-gray-600'">Materi</button>
        <button @click="currentTab = 'tugas'" :class="currentTab === 'tugas' ? 'pb-3 border-b-2 border-gray-800 font-bold text-gray-900' : 'pb-3 text-gray-600'">Tugas</button>
        <button @click="currentTab = 'orang'" :class="currentTab === 'orang' ? 'pb-3 border-b-2 border-gray-800 font-bold' : 'pb-3 text-gray-600'">Orang</button>
      </div>

      <!-- KONTEN: MATERI -->
      <div v-if="currentTab === 'materi'" class="space-y-4">
        <div v-for="item in materiList" :key="item.id" class="bg-[#D9D9D9] p-4 rounded-xl flex items-center gap-4 w-96">
          <div class="bg-gray-600 text-white px-2 py-1 rounded text-[10px] font-bold">PDF</div>
          <div>
            <h4 class="text-sm font-bold text-gray-800">{{ item.title }}</h4>
            <p class="text-xs text-gray-500">{{ item.date }}</p>
          </div>
        </div>
      </div>

      <!-- KONTEN: DAFTAR TUGAS -->
      <div v-else-if="currentTab === 'tugas' && !selectedTask" class="space-y-4">
        <div @click="selectedTask = 'tugas1'" class="bg-[#D9D9D9] p-4 rounded-xl flex items-center gap-4 w-96 cursor-pointer hover:bg-gray-300">
          <div class="text-gray-700"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 010-16zm1 8H7v2h4v-2z" /></svg></div>
          <div>
            <h4 class="text-sm font-bold text-gray-800">Tugas 1: Makalah Teks Deskripsi</h4>
            <p class="text-xs text-gray-500">10 April</p>
          </div>
        </div>
      </div>

      <!-- KONTEN: DETAIL TUGAS -->
      <div v-else-if="currentTab === 'tugas' && selectedTask" class="flex gap-12">
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">Makalah Teks Deskripsi</h1>
          <hr class="border-gray-400 mb-6">
          <p class="text-gray-700 leading-relaxed">Susunlah sebuah teks deskripsi komprehensif...</p>
        </div>
        <!-- Box Pengiriman -->
        <div class="w-80 bg-[#D9D9D9] p-6 rounded-2xl">
          <h2 class="text-xl font-bold mb-4">Tugas</h2>

          <!-- Jika BELUM diupload -->
          <div v-if="!isUploaded" class="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center mb-4 cursor-pointer hover:bg-gray-200" @click="handleUpload">
            <svg class="w-8 h-8 mx-auto text-gray-600 mb-2" fill="currentColor" viewBox="0 0 20 20"><path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"/></svg>
            <p class="text-xs text-gray-600">Unggah File<br>seret dan lepas file di sini</p>
          </div>
          <button v-if="!isUploaded" @click="isUploaded = true" class="w-full bg-[#4A86A8] text-white py-2 rounded-lg font-bold hover:bg-[#3a6d8a]">Kirim</button>

          <!-- Jika SUDAH diupload (Seperti di image_788ac4.png) -->
          <div v-else>
            <div class="border border-gray-400 rounded-lg p-3 mb-4 flex items-center gap-2 bg-gray-200">
              <div class="bg-gray-500 text-white px-1 rounded text-[8px] font-bold">PDF</div>
              <span class="text-xs text-gray-700 truncate">2303010269_Nabit.pdf</span>
            </div>
            <button @click="isUploaded = false" class="w-full bg-gray-600 text-white py-2 rounded-lg font-bold hover:bg-gray-700">
              Batalkan Pengiriman
            </button>
          </div>
        </div>
      </div>
      <!-- KONTEN: ORANG (Sesuai image_787fbe.png) -->
      <div v-else-if="currentTab === 'orang'" class="grid grid-cols-2 gap-20">
        <!-- Kolom Teman Sekelas -->
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-6">Teman Sekelas</h2>
          <div class="space-y-6">
            <div v-for="student in students" :key="student.name" class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-gray-600" :style="{ backgroundColor: student.color }">{{ student.initial }}</div>
              <span class="text-gray-800">{{ student.name }}</span>
            </div>
          </div>
        </div>

        <!-- Kolom Pengajar -->
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-6">Pengajar</h2>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-gray-600 bg-gray-300">B</div>
            <span class="text-gray-800">Budi</span>
          </div>
        </div>
      </div>

      <!-- CHAT ICON -->
      <div class="fixed bottom-8 right-8 bg-gray-700 p-4 rounded-lg text-white cursor-pointer"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4-4-4H4a2 2 0 01-2-2V5z" /></svg></div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const currentTab = ref('materi')
const selectedTask = ref(null)
const materiList = ref([
  { id: 1, title: 'BAB 2 - Penggunaan Teks Deskripsi.pdf', date: '1 April' },
  { id: 2, title: 'BAB 1 - Pengenalan Teks Deskripsi.pdf', date: '1 April' }
])
</script>