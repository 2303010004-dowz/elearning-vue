<template>
  <DashboardLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Selamat datang, Nabit</h1>
      <p class="text-gray-600 text-sm">Ringkasan Aktivitas kelas hari ini</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div 
        @click="router.push('/student-class')" 
        class="cursor-pointer p-6 rounded-2xl bg-[#D9D9D9] hover:bg-[#CECECE] shadow-sm transition h-32 flex flex-col justify-center"
      >
        <h3 class="text-4xl font-bold text-gray-800">3</h3>
        <p class="text-gray-600 font-medium text-sm mt-1">Kelas diikuti</p>
      </div>
      <div 
        @click="router.push('/student-tasks')" 
        class="cursor-pointer p-6 rounded-2xl bg-[#D9D9D9] hover:bg-[#CECECE] shadow-sm transition h-32 flex flex-col justify-center"
      >
        <h3 class="text-4xl font-bold text-red-600">1</h3>
        <p class="text-gray-600 font-medium text-sm mt-1">Tugas Belum</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-[#D9D9D9] rounded-2xl p-6 shadow-sm">
        <h2 class="text-lg font-bold text-gray-800 mb-4">Kelas saya</h2>
        <div class="space-y-4">
          <div 
            @click="router.push('/class/bahasa-indonesia')" 
            class="cursor-pointer bg-[#F3F3F3] hover:bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition group"
          >
            <h4 class="font-bold text-lg text-gray-800 group-hover:text-[#4A86A8] transition">Bahasa Indonesia - 7A</h4>
            <p class="text-sm text-gray-500 mt-0.5">Budi, S.Pd</p>
          </div>
          <div class="bg-[#F3F3F3] p-4 rounded-xl border border-gray-200 shadow-sm opacity-75">
            <h4 class="font-bold text-lg text-gray-800">Bahasa Inggris - 7A</h4>
            <p class="text-sm text-gray-500 mt-0.5">Lula Sopianti, S.Pd</p>
          </div>
          <div class="bg-[#F3F3F3] p-4 rounded-xl border border-gray-200 shadow-sm opacity-75">
            <h4 class="font-bold text-lg text-gray-800">Bahasa Sunda - 7A</h4>
            <p class="text-sm text-gray-500 mt-0.5">Neneng Kurniasih, S.Pd</p>
          </div>
        </div>
      </div>

      <div class="bg-[#D9D9D9] rounded-2xl p-6 shadow-sm">
        <h2 class="text-lg font-bold text-gray-800 mb-4">Tugas</h2>
        <div class="bg-[#F3F3F3] p-6 rounded-xl border border-gray-200 shadow-sm">
          <h4 class="font-bold text-lg text-gray-800">Makalah Teks Deskripsi</h4>
          <p class="text-sm text-gray-600 mt-1">Tenggat: 10 Apr 2026</p>
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