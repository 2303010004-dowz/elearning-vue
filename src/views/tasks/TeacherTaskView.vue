<template>
  <DashboardLayout>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Tugas</h1>
      <button 
        @click="router.push({ name: 'create-task' })" 
        class="bg-[#4A86A8] hover:bg-[#3d718e] text-white px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        + Buat Tugas
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-[#D9D9D9] p-6 rounded-2xl">
        <p class="text-4xl font-bold text-gray-700">1</p>
        <p class="text-gray-600 font-medium">Total Tugas</p>
      </div>
      <div class="bg-[#D9D9D9] p-6 rounded-2xl">
        <p class="text-4xl font-bold text-red-600">1</p>
        <p class="text-gray-600 font-medium">Belum dinilai</p>
      </div>
      <div class="bg-[#D9D9D9] p-6 rounded-2xl">
        <p class="text-4xl font-bold text-green-600">0</p>
        <p class="text-gray-600 font-medium">Sudah Dinilai</p>
      </div>
    </div>

    <h2 class="text-lg font-bold text-gray-700 mb-4">Semua Tugas</h2>
    <div class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-bold text-gray-800">Makalah Teks Deskripsi</h3>
          <p class="text-sm text-gray-600">Bahasa Indonesia - 7A · 1 Apr 2026</p>
        </div>
        <p class="text-sm text-gray-600 font-medium">Tenggat: 1 Apr 2026</p>
      </div>
      
      <hr class="border-gray-400 mb-6">

      <div class="flex gap-3 justify-end">
        <button class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
          Nilai kiriman
        </button>
        <button class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
          Edit Tugas
        </button>
        <button class="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
          Hapus
        </button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

const router = useRouter()
</script>