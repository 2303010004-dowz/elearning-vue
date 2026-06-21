<template>
  <DashboardLayout>
    <div class="flex items-center gap-2 mb-8 text-gray-600">
      <button @click="router.back()" class="hover:text-gray-800">
        <span class="font-bold text-xl">&lt;</span>
      </button>
      <span class="text-sm">Kelas saya</span>
      <span class="font-bold text-gray-800">Buat Kelas</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <div class="bg-[#D9D9D9] p-8 rounded-2xl shadow-sm">
        <h2 class="font-bold text-gray-700 mb-6">Informasi Kelas</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Nama Mata Pelajaran</label>
            <input type="text" class="w-full bg-[#CECECE] border-none rounded-lg p-2 focus:ring-2 focus:ring-[#4A86A8] outline-none">
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Kelas</label>
            <input type="text" class="w-full bg-[#CECECE] border-none rounded-lg p-2 focus:ring-2 focus:ring-[#4A86A8] outline-none">
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Deskripsi Kelas</label>
            <input type="text" class="w-full bg-[#CECECE] border-none rounded-lg p-2 focus:ring-2 focus:ring-[#4A86A8] outline-none">
          </div>
        </div>

        <button class="mt-8 bg-gray-600 text-white px-8 py-2 rounded-full hover:bg-gray-700 transition">
          Buat
        </button>
      </div>

      <div class="bg-[#D9D9D9] p-8 rounded-2xl shadow-sm flex flex-col">
        <h2 class="font-bold text-gray-700 mb-6">Kode Kelas (Dibuat Otomatis)</h2>
        <div class="flex-grow flex items-center justify-center bg-[#CECECE] rounded-xl border border-gray-400">
          <span class="text-5xl font-bold text-gray-700 tracking-widest">MNJH10</span>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

const router = useRouter()
</script>