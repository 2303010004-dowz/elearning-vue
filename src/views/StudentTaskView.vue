<template>
  <DashboardLayout>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Tugas</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm">
        <h3 class="text-4xl font-bold text-gray-800">2</h3>
        <p class="text-gray-600 font-medium text-sm mt-1">Total Tugas</p>
      </div>
      <div class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm">
        <h3 class="text-4xl font-bold text-red-600">1</h3>
        <p class="text-gray-600 font-medium text-sm mt-1">Tugas Belum</p>
      </div>
      <div class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm">
        <h3 class="text-4xl font-bold text-green-700">1</h3>
        <p class="text-gray-600 font-medium text-sm mt-1">Tugas Sudah</p>
      </div>
    </div>

    <h2 class="text-lg font-bold text-gray-800 mb-4">Semua Tugas</h2>
    <div class="space-y-4">
      <div v-for="task in studentTasks" :key="task.id" class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm flex flex-col">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-lg text-gray-800">{{ task.title }}</h3>
            <p class="text-sm text-gray-600">{{ task.classAndSubject }} · {{ task.teacher }}</p>
          </div>
          <span :class="task.isSubmitted ? 'bg-gray-400 text-gray-700' : 'bg-[#4A86A8] text-white'" class="px-3 py-1 rounded-full text-xs font-bold">
            {{ task.isSubmitted ? 'Dikumpulkan' : task.deadlineInfo }}
          </span>
        </div>
        <button v-if="!task.isSubmitted" @click="submitTaskAction(task)" class="mt-6 bg-gray-400 hover:bg-gray-500 text-gray-800 font-medium px-6 py-2 rounded-lg w-fit text-sm">
          Kumpulkan
        </button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

const studentTasks = ref([
  { id: 1, title: 'Makalah Teks Deskripsi', classAndSubject: 'Bahasa Indonesia - 7A', teacher: 'Budi S.Pd', deadlineInfo: '10 Apr · 9 hari lagi', isSubmitted: false },
  { id: 2, title: 'Aksara Sunda', classAndSubject: 'Bahasa Sunda - 7A', teacher: 'Neneng Kurniasih S.Pd', deadlineInfo: '', isSubmitted: true }
])

const submitTaskAction = (task) => alert(`Mengunggah: ${task.title}`)
</script>