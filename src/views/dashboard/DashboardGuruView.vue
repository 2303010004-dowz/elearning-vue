<template>
  <DashboardLayout>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Selamat datang, Pak Budi</h1>
      <p class="text-gray-600 text-sm">Ringkasan Aktivitas kelas hari ini</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="p-6 rounded-2xl bg-[#D9D9D9] shadow-sm">
        <h3 class="text-4xl font-bold text-gray-800">3</h3>
        <p class="text-gray-600 font-medium text-sm mt-1">Kelas Aktif</p>
      </div>
      <div class="p-6 rounded-2xl bg-[#D9D9D9] shadow-sm">
        <h3 class="text-4xl font-bold text-gray-800">69</h3>
        <p class="text-gray-600 font-medium text-sm mt-1">Total Siswa</p>
      </div>
      <div class="p-6 rounded-2xl bg-[#D9D9D9] shadow-sm">
        <h3 class="text-4xl font-bold text-gray-800">1</h3>
        <p class="text-gray-600 font-medium text-sm mt-1">Tugas Belum di nilai</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-[#D9D9D9] rounded-2xl p-6 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold text-gray-800">Kelas saya</h2>
          <button class="bg-transparent border border-gray-600 text-xs px-3 py-1 rounded-full">+ Buat Kelas</button>
        </div>
        <div class="space-y-4">
          <div v-for="kelas in ['Bahasa Indonesia - 7A', 'Bahasa Indonesia - 7B', 'Bahasa Indonesia - 7C']" :key="kelas" class="border-b border-gray-400 pb-4">
            <h4 class="font-bold text-lg text-gray-800">{{ kelas }}</h4>
            <p class="text-sm text-gray-600">23 Siswa · Kode: <span class="font-bold text-[#4A86A8]">MNJH10</span></p>
          </div>
        </div>
      </div>

      <div class="bg-[#D9D9D9] rounded-2xl p-6 shadow-sm">
        <h2 class="text-lg font-bold text-gray-800 mb-6">Tugas Belum di Nilai</h2>
        <div class="bg-transparent border-t border-gray-400 pt-4 flex justify-between items-start">
          <div>
            <h4 class="font-bold text-lg text-gray-800">Makalah Teks Deskripsi</h4>
            <p class="text-sm text-gray-600 mt-1">Tenggat: 10 Apr 2026</p>
          </div>
          <button class="bg-[#D9D9D9] border border-gray-600 text-sm px-4 py-1 rounded-lg">Nilai</button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
</script>