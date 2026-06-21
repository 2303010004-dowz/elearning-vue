<template>
  <DashboardLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Propil Saya</h1>
    </div>
    <div class="rounded-2xl bg-[#D9D9D9] p-8 shadow-sm">
      <div class="flex items-center gap-6 mb-8">
        <div class="flex h-24 w-24 items-center justify-center rounded-full bg-[#B0B0B0] text-3xl font-bold text-gray-700 shadow-inner">NSA</div>
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Nabit Sidiq Amarullah</h2>
          <p class="text-gray-600 text-sm mb-2">NIS 2303010269</p>
          <span class="inline-block rounded-full bg-gray-400 px-4 py-1 text-xs font-medium text-gray-800">Siswa</span>
        </div>
      </div>
      <div class="space-y-5 max-w-md">
        <h3 class="text-lg font-semibold text-gray-800">Informasi Pribadi</h3>
        <div><label class="block text-gray-500 text-xs font-medium mb-1 pl-3">Nama Lengkap</label><input type="text" class="w-full rounded-full bg-[#F3F3F3] px-5 py-2.5 text-base text-gray-700 border-0 focus:ring-0" value="Nabit Sidiq Amarullah" readonly></div>
        <div><label class="block text-gray-500 text-xs font-medium mb-1 pl-3">NIS</label><input type="text" class="w-full rounded-full bg-[#F3F3F3] px-5 py-2.5 text-base text-gray-700 border-0 focus:ring-0" value="2303010269" readonly></div>
        <div><label class="block text-gray-500 text-xs font-medium mb-1 pl-3">Email Sekolah</label><input type="email" class="w-full rounded-full bg-[#F3F3F3] px-5 py-2.5 text-base text-gray-700 border-0 focus:ring-0" value="2303010269@sman3tasik.sch.id" readonly></div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
</script>