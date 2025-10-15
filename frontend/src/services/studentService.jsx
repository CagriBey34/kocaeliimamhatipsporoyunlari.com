import axios from 'axios';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8561/api';

// API instance oluştur
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Response interceptor - 401 hatalarını yakala
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      console.log('Yetkisiz erişim hatası. Oturum kontrolü yapılıyor.');
      sessionStorage.removeItem('isLoggedIn');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// PUBLIC API - Öğretmenler için
// ============================================

/**
 * Branş yapılandırmalarını getir
 * Tüm branşları, kategorileri ve sikletleri döner
 */
export const getSportConfigurations = async () => {
  try {
    const response = await api.get('/students/configurations');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Öğrenci kaydı oluştur
 */
export const createStudentRegistration = async (registrationData) => {
  try {
    const response = await api.post('/students/register', registrationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================================
// ADMIN API - Admin panel için
// ============================================

/**
 * Tüm öğrencileri getir (filtreleme ile)
 */
export const getAllStudents = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    // ✅ /api/students kullan
    const response = await api.get(`/students${queryParams ? '?' + queryParams : ''}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * İstatistikleri getir
 */
export const getStatistics = async () => {
  try {
    // ✅ /api/students/statistics kullan
    const response = await api.get('/students/statistics');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Tek öğrenci detayını getir
 */
export const getStudentById = async (studentId) => {
  try {
    // ✅ /api/students/:id kullan
    const response = await api.get(`/students/${studentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Öğrenci bilgilerini güncelle
 */
export const updateStudent = async (studentId, studentData) => {
  try {
    // ✅ /api/students/:id kullan
    const response = await api.put(`/students/${studentId}`, studentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Öğrenci kaydını sil
 */
export const deleteStudent = async (studentId) => {
  try {
    // ✅ /api/students/:id kullan
    const response = await api.delete(`/students/${studentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Tüm verileri Excel olarak indir
 */
export const exportAllToExcel = async () => {
  try {
    // ✅ /api/students/export/all kullan
    const response = await api.get('/students/export/all', {
      responseType: 'blob'
    });
    
    // Excel dosyasını indir
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tum_kayitlar.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'Excel dosyası indirildi' };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Filtrelenmiş verileri Excel olarak indir
 */
export const exportFilteredToExcel = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    // ✅ /api/students/export/filtered kullan
    const response = await api.get(`/students/export/filtered${queryParams ? '?' + queryParams : ''}`, {
      responseType: 'blob'
    });
    
    // Dinamik dosya adı
    let filename = 'filtrelenmis_kayitlar';
    if (filters.sport_branch) {
      filename = filters.sport_branch.replace(/\s+/g, '_');
    }
    if (filters.age_category) {
      filename += `_${filters.age_category.replace(/\s+/g, '_')}`;
    }
    if (filters.weight_class) {
      filename += `_${filters.weight_class}kg`;
    }
    
    // Excel dosyasını indir
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'Excel dosyası indirildi' };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Default export
const studentService = {
  getSportConfigurations,
  createStudentRegistration,
  getAllStudents,
  getStatistics,
  getStudentById,
  updateStudent,
  deleteStudent,
  exportAllToExcel,
  exportFilteredToExcel
};

export default studentService;