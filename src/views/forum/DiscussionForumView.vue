<template>
  <DashboardLayout>
    <!-- Konten Spesifik Halaman Forum -->
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Forum Diskusi</h1>

    <div class="space-y-4">
      <div 
        v-for="forum in forumsList" 
        :key="forum.id" 
        @click="openDiscussion(forum.id)"
        class="rounded-2xl bg-[#D9D9D9] p-6 shadow-sm flex items-start gap-4 hover:bg-gray-300 transition cursor-pointer"
      >
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-500 text-sm font-bold text-white uppercase">
          {{ forum.subjectCode }}
        </div>

        <div class="flex-1">
          <h2 class="text-lg font-bold text-gray-800">{{ forum.className }}</h2>
          <p class="text-sm text-gray-600 mb-2">{{ forum.teacher }}</p>
          <p class="text-gray-700 text-sm mb-4">{{ forum.latestMessage }}</p>
          <div class="flex items-center gap-4 text-xs text-gray-500 font-medium">
            <span>{{ forum.date }} · {{ forum.time }}</span>
            <span class="ml-auto text-gray-800 font-bold">{{ forum.repliesCount }} Balasan</span>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

const forumsList = ref([
  { id: 1, subjectCode: 'BIN', className: 'Bahasa Indonesia - 7A', teacher: 'Budi, S.Pd', latestMessage: 'Mohon maaf pak apakah ada panduan pengerjaan untuk penulisan makalahnya pak ?', date: '1 Apr 2026', time: '09.45', repliesCount: '2' },
  { id: 2, subjectCode: 'BIN', className: 'Bahasa Sunda - 7A', teacher: 'Neneng Kurniasih, S.Pd', latestMessage: 'Manawi aya anu kirang ngartos mangga tiasa ditaroskeun nya bageur', date: '18 Apr 2026', time: '11.45', repliesCount: '4' },
  { id: 3, subjectCode: 'BIN', className: 'Bahasa Inggris - 7A', teacher: 'Lula Sopianti, S.Pd', latestMessage: 'I see, thank you!', date: '22 Apr 2026', time: '07.45', repliesCount: '9' }
])

const openDiscussion = (id) => alert(`Membuka diskusi ID: ${id}`)
</script>