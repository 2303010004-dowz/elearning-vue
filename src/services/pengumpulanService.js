import apiClient from '@/axios';

export const pengumpulanService = {
  // Siswa mengumpulkan tugas (upload file/jawaban)
  kumpulTugas: (tugasId, formData) => {
    return apiClient.post(`/tugas/${tugasId}/kumpul`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Guru melihat daftar jawaban dari siswa
  getJawaban: (tugasId) => {
    return apiClient.get(`/tugas/${tugasId}/jawaban`);
  },
  
  // Guru memberikan nilai ke jawaban tertentu
  berinilai: (id, data) => {
    return apiClient.post(`/jawaban/${id}/nilai`, data);
  }
};