<template>
  <DashboardLayout>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Kelas saya</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="kelas in kelasList" 
        :key="kelas.id" 
        @click="openClass(kelas.slug)" 
        class="bg-[#D9D9D9] p-6 rounded-2xl shadow-sm flex flex-col cursor-pointer hover:bg-gray-300 transition-all duration-200"
      >
        <div class="bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded w-fit mb-4">
          {{ kelas.kode }}
        </div>
        <h2 class="text-lg font-bold text-gray-800">{{ kelas.nama }}</h2>
        <p class="text-sm text-gray-600 mb-6">{{ kelas.guru }}</p>
        <div class="mt-auto border-t border-gray-400 pt-4 text-sm text-gray-700 space-y-2">
          <p>☰ {{ kelas.materi }} Materi tersedia</p>
          <p>🕒 {{ kelas.tugas }}</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

const router = useRouter()
const kelasList = ref([])

// Menggunakan nama rute 'class-detail' dan mengirim slug sebagai parameter
const openClass = (slug) => {
  router.push({ name: 'class-detail', params: { className: slug } })
}

onMounted(() => {
  kelasList.value = [
    { id: 1, kode: 'MTK', nama: 'Bahasa Indonesia - 7A', guru: 'Budi, S.Pd', materi: 1, tugas: 'Tidak ada tugas', slug: 'bahasa-indonesia' },
    { id: 2, kode: 'BIG', nama: 'Bahasa Inggris - 7A', guru: 'Lula Sopianti, S.Pd', materi: 2, tugas: 'Makalah Bahasa Indonesia', slug: 'bahasa-inggris' },
    { id: 3, kode: 'BSU', nama: 'Bahasa Sunda - 7A', guru: 'Neneng Kurniasih, S.Pd', materi: 1, tugas: 'Tidak ada tugas', slug: 'bahasa-sunda' }
  ]
})
</script>