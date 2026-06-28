<template>
  <div class="flex min-h-screen items-center justify-center bg-[#F3F3F3] p-4 font-sans">
    <div class="flex w-full max-w-5xl flex-col items-center justify-between gap-8 md:flex-row">
      
      <!-- Sisi Kiri: Form Login -->
      <div class="w-full px-4 md:w-1/2 md:px-8">
        <div class="mb-10 flex items-center justify-center gap-3 md:justify-start">
          <svg class="h-10 w-10 text-[#3B6A96]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="text-4xl font-bold tracking-tight text-[#1E4366]">EduLearn</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Input Email / NIS -->
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-500">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            </span>
            <input 
              v-model="form.email"
              type="text" 
              placeholder="Masukan Email/NIS" 
              required
              class="w-full rounded-full bg-[#D9D9D9] py-4 pl-14 pr-6 text-lg text-gray-700 outline-none focus:ring-2 focus:ring-[#3B6A96]"
            />
          </div>

          <!-- Input Password -->
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-500">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
            </span>
            <input 
              v-model="form.password"
              :type="passwordVisible ? 'text' : 'password'" 
              placeholder="Masukan Kata sandi" 
              required
              class="w-full rounded-full bg-[#D9D9D9] py-4 pl-14 pr-14 text-lg text-gray-700 outline-none focus:ring-2 focus:ring-[#3B6A96]"
            />
            <button 
              type="button" 
              @click="passwordVisible = !passwordVisible" 
              class="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-600 hover:text-gray-800"
            >
              {{ passwordVisible ? '🙈' : '👁️' }}
            </button>
          </div>

          <!-- Status Pesan Error / Sukses -->
          <div v-if="status.message" :class="`text-center text-sm font-medium ${status.isError ? 'text-red-500' : 'text-green-600'}`">
            {{ status.message }}
          </div>

          <!-- Tombol Submit -->
          <button 
            type="submit" 
            :disabled="status.isLoading"
            class="w-full rounded-full bg-[#4682B4] py-4 text-xl font-semibold text-white shadow-md transition hover:bg-[#366892] disabled:bg-gray-400"
          >
            {{ status.isLoading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>
      </div>

      <!-- Sisi Kanan: Ilustrasi Gambar -->
      <div class="hidden w-full justify-center md:flex md:w-1/2">
        <div class="relative h-[480px] w-[420px] overflow-hidden rounded-[40px] bg-[#B0C4DE]">
          <img src="@/assets/siswa.png" class="absolute bottom-0 left-1/2 h-[95%] -translate-x-1/2 object-contain" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/axios';

const router = useRouter();

// State Form
const form = reactive({ email: '', password: '' });
const passwordVisible = ref(false);

// State UI/Status
const status = reactive({
  isLoading: false,
  message: '',
  isError: false
});

const handleLogin = async () => {
  status.isLoading = true;
  status.message = '';
  status.isError = false;

  try {
    const response = await apiClient.post('/login', form);

    // 1. Ambil token, role, dan user dari JSON response Lumen
    const { token, role, user } = response.data; 
    
    // 2. Simpan kredensial login ke localStorage
    localStorage.setItem('token_jwt', token);
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_nomor_induk', user?.nomor_induk || '');
    localStorage.setItem('user_email', form.email); 
    
    // PERBAIKAN: Menyesuaikan key data nama 'nama_lengkap' sesuai kiriman controller Lumen teman Anda
    const namaAsli = user?.nama_lengkap || 'User Terlogin';
    localStorage.setItem('user_name', namaAsli);
    
    status.message = 'Login Berhasil! Mengalihkan...';
    
    // 3. Arahkan halaman berdasarkan role user setelah jeda singkat
    setTimeout(() => {
      if (role === 'guru') {
        router.push('/dashboard-guru');
      } else {
        router.push('/dashboard');
      }
    }, 1000);

  } catch (error) {
    status.isError = true;
    status.message = error.response?.data?.message || 'Email atau Password salah.';
  } finally {
    status.isLoading = false;
  }
};
</script>

<style scoped>
</style>