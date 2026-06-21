import apiClient from '@/axios';

export const kelasService = {
  // Guru membuat kelas
  buatKelas: (data) => apiClient.post('/kelas', data),
  
  // Siswa bergabung ke kelas
  joinKelas: (data) => apiClient.post('/kelas/join', data),
  
  // Siswa keluar dari kelas
  leaveKelas: (id) => apiClient.delete(`/kelas/${id}/leave`),
  
  // Forum Diskusi: Kirim pesan
  kirimPesan: (kelasId, data) => apiClient.post(`/kelas/${kelasId}/diskusi`, data),
  
  // Forum Diskusi: Lihat pesan
  getPesan: (kelasId) => apiClient.get(`/kelas/${kelasId}/diskusi`)
};