<template>
  <div class="flex min-h-screen items-center justify-center bg-[#F3F3F3] p-4 font-sans">
    <div class="flex w-full max-w-5xl flex-col items-center justify-between gap-8 md:flex-row">
      
      <div class="w-full px-4 md:w-1/2 md:px-8">
        
        <div class="mb-8">
          <RouterLink 
            to="/" 
            class="inline-flex items-center gap-2 text-xl font-semibold text-gray-700 hover:text-gray-900 transition"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Kembali
          </RouterLink>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-500">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </span>
            <input 
              v-model="payload.name"
              type="text" 
              placeholder="Masukan Nama Anda" 
              required
              class="w-full rounded-full bg-[#D9D9D9] py-4 pl-14 pr-6 text-lg text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3B6A96]"
            />
          </div>

          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-500">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </span>
            <input 
              v-model="payload.email"
              type="email" 
              placeholder="Masukan Email Sekolah Anda" 
              required
              class="w-full rounded-full bg-[#D9D9D9] py-4 pl-14 pr-6 text-lg text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3B6A96]"
            />
          </div>

          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-500">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            <input 
              v-model="payload.password"
              :type="passwordVisible ? 'text' : 'password'" 
              placeholder="Masukan Password Anda" 
              required
              class="w-full rounded-full bg-[#D9D9D9] py-4 pl-14 pr-14 text-lg text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3B6A96]"
            />
            <button 
              type="button"
              @click="passwordVisible = !passwordVisible"
              class="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-600 hover:text-gray-800"
            >
              <svg v-if="passwordVisible" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-2.228-2.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>

          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-500">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            <input 
              v-model="payload.password_confirmation"
              :type="confirmPasswordVisible ? 'text' : 'password'" 
              placeholder="Konfirmasi Password Anda" 
              required
              class="w-full rounded-full bg-[#D9D9D9] py-4 pl-14 pr-14 text-lg text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3B6A96]"
            />
            <button 
              type="button"
              @click="confirmPasswordVisible = !confirmPasswordVisible"
              class="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-600 hover:text-gray-800"
            >
              <svg v-if="confirmPasswordVisible" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-2.228-2.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>

          <div v-if="statusMessage" :class="`text-center text-sm ${isError ? 'text-red-500' : 'text-green-600'}`">
            {{ statusMessage }}
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full rounded-full bg-[#4682B4] py-4 text-xl font-semibold text-white shadow-md transition duration-200 hover:bg-[#366892] disabled:bg-gray-400"
          >
            {{ isLoading ? 'Mendaftarkan Akun...' : 'Daftar' }}
          </button>
        </form>
      </div>

      <div class="hidden w-full justify-center md:flex md:w-1/2">
        <div class="relative h-[480px] w-[420px] overflow-hidden rounded-[40px] bg-[#B0C4DE]">
          <div class="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-[#C6D7EB] opacity-60"></div>
          <img 
            src="@/assets/siswa.png" 
            alt="EduLearn Student" 
            class="absolute bottom-0 left-1/2 h-[95%] -translate-x-1/2 object-contain"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()

// UI States
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)
const isLoading = ref(false)
const statusMessage = ref('')
const isError = ref(false)

// Input Form Payload
const payload = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

// Logika Fungsi API Submit Pendaftaran
const handleRegister = async () => {
  // 1. Validasi kecocokan password di frontend sebelum menembak API
  if (payload.password !== payload.password_confirmation) {
    isError.value = true
    statusMessage.value = 'Konfirmasi password tidak cocok!'
    return
  }

  isLoading.value = true
  statusMessage.value = ''
  isError.value = false

  try {
    // Hubungkan dengan endpoint API pendaftaran milik rekan backend Anda
    const response = await axios.post('http://localhost:8000/api/register', {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      password_confirmation: payload.password_confirmation
    })

    statusMessage.value = 'Pendaftaran sukses! Mengalihkan ke login...'
    
    // Tunggu sebentar lalu tendang pengguna kembali ke halaman utama (Login)
    setTimeout(() => {
      router.push('/')
    }, 2000)

  } catch (error) {
    isError.value = true
    if (error.response && error.response.data) {
      statusMessage.value = error.response.data.message || 'Pendaftaran gagal. Silakan coba lagi.'
    } else {
      statusMessage.value = 'Gagal terhubung ke server backend.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>