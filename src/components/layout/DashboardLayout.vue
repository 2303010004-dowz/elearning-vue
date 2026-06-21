<template>
  <div class="flex min-h-screen bg-[#F3F3F3] font-sans text-gray-800">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#E0E0E0] shadow-sm flex flex-col justify-between shrink-0">
      <div>
        <!-- Logo -->
        <div class="flex items-center gap-2 px-6 bg-[#4A86A8] text-white font-bold text-xl h-16">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89l-.06-.582a9.956 9.956 0 010-3.18l.06-.583a1 1 0 01.89-.89c.115-.011.233-.017.35-.017zm13.38 0c.117 0 .235.006.35.017a1 1 0 01.89.89l.06.582a9.956 9.956 0 010 3.18l-.06.583a1 1 0 01-.89.89 8.969 8.969 0 00-1.05v-4.101l1.69-.724z" />
          </svg>
          EduLearn
        </div>

        <!-- Menu Navigasi -->
        <nav class="mt-6 space-y-1 px-3">
          <RouterLink to="/dashboard" class="flex items-center gap-4 px-4 py-3 text-lg font-medium text-gray-600 hover:bg-[#D8D8D8] rounded-lg transition">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
            Beranda
          </RouterLink>
          <RouterLink to="/student-class" class="flex items-center gap-4 px-4 py-3 text-lg font-medium text-gray-600 hover:bg-[#D8D8D8] rounded-lg transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            Kelas saya
          </RouterLink>
          <RouterLink to="/student-tasks" class="flex items-center gap-4 px-4 py-3 text-lg font-medium text-gray-600 hover:bg-[#D8D8D8] rounded-lg transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Tugas
          </RouterLink>
          <RouterLink to="/discussion-forum" class="flex items-center gap-4 px-4 py-3 text-lg font-medium text-gray-600 hover:bg-[#D8D8D8] rounded-lg transition">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" /></svg>
            Forum Diskusi
          </RouterLink>
          <RouterLink to="/profile" class="flex items-center gap-4 px-4 py-3 text-lg font-medium text-gray-600 hover:bg-[#D8D8D8] rounded-lg transition">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
            Profil
          </RouterLink>
        </nav>
      </div>

      <!-- Logout -->
      <div class="p-4">
        <button @click="handleLogout" class="flex w-full items-center gap-4 px-4 py-3 text-lg font-medium text-gray-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition text-left">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Keluar
        </button>
      </div>
    </aside>

    <!-- Content -->
    <div class="flex-1 flex flex-col">
      <header class="flex items-center justify-end bg-[#4A86A8] px-8 h-16 shadow-sm">
        <RouterLink to="/profile" class="flex h-9 w-9 items-center justify-center rounded-full bg-[#D9D9D9] font-bold text-gray-700 cursor-pointer hover:bg-gray-200 transition">
          N
        </RouterLink>
      </header>
      
      <main class="flex-1 p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import apiClient from '@/axios'

const handleLogout = async () => {
  try { await apiClient.post('/logout') } catch (e) { console.error(e) }
  localStorage.removeItem('token_jwt')
  window.location.href = '/'
}
</script>