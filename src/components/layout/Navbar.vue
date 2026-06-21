<template>
  <nav class="flex items-center justify-between bg-white px-8 py-4 shadow-md">
    <div class="flex items-center gap-2">
      <span class="text-2xl font-bold text-[#1E4366]">EduLearn</span>
    </div>

    <div class="flex items-center gap-6">
      <RouterLink to="/dashboard" class="text-gray-600 hover:text-[#3B6A96]">Dashboard</RouterLink>
      <RouterLink to="/profile" class="text-gray-600 hover:text-[#3B6A96]">Profil</RouterLink>
      
      <button 
        @click="handleLogout" 
        class="rounded-full bg-red-500 px-5 py-2 text-white transition hover:bg-red-600"
      >
        Keluar
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import apiClient from '@/axios';

const router = useRouter();

const handleLogout = async () => {
  try {
    // Memanggil API Logout backend
    await apiClient.post('/logout');
  } catch (error) {
    console.error('Gagal logout di server:', error);
  } finally {
    // Bersihkan data lokal
    localStorage.removeItem('token_jwt');
    
    // Gunakan window.location agar refresh total dan aman
    window.location.href = '/';
  }
};
</script>   