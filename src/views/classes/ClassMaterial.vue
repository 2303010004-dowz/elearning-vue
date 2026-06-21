<template>
  <div class="flex min-h-screen bg-[#F3F3F3] font-sans text-gray-800">
    <main class="flex-1 p-8">
      <!-- Header Navigasi -->
      <div class="mb-8">
        <button @click="$router.back()" class="flex items-center text-gray-600 mb-4 hover:text-gray-900">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          Kembali
        </button>
        <h1 class="text-2xl font-bold text-gray-800">Kelas saya <span class="text-gray-500 font-normal">Bahasa Indonesia - 7A</span></h1>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-300 mb-6 flex gap-8">
        <button class="pb-3 border-b-2 border-gray-800 font-bold text-gray-900">Materi</button>
        <button class="pb-3 text-gray-500 hover:text-gray-800">Tugas</button>
        <button class="pb-3 text-gray-500 hover:text-gray-800">Orang</button>
      </div>

      <!-- List Materi -->
      <div class="space-y-4">
        <div v-for="item in materiList" :key="item.id" class="bg-[#D9D9D9] p-4 rounded-xl flex items-center gap-4 w-full md:w-96 hover:bg-gray-300 transition cursor-pointer">
          <div class="bg-gray-600 text-white px-3 py-2 rounded text-xs font-bold">PDF</div>
          <div>
            <h4 class="text-sm font-bold text-gray-800">{{ item.title }}</h4>
            <p class="text-xs text-gray-600">{{ item.date }}</p>
          </div>
        </div>
      </div>

      <!-- Floating Action Button -->
      <div class="fixed bottom-8 right-8">
        <div class="bg-gray-700 p-4 rounded-lg shadow-lg text-white cursor-pointer hover:bg-gray-800 transition">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4-4-4H4a2 2 0 01-2-2V5z" /></svg>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const materiList = ref([
  { id: 1, title: 'BAB 2 - Penggunaan Teks Deskripsi.pdf', date: '1 April' },
  { id: 2, title: 'BAB 1 - Pengenalan Teks Deskripsi.pdf', date: '1 April' }
])
</script>