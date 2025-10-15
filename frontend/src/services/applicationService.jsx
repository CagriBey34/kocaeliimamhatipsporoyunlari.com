import axios from 'axios';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8561/api';

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

export const applicationService = {
  /**
   * Branş ve kategorileri getir
   */
  getSportCategories: async () => {
    try {
      const response = await api.get('/sport-categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * İlçeleri getir
   */
  getDistricts: async () => {
    try {
      const response = await api.get('/districts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Yeni başvuru oluştur
   */
  createApplication: async (applicationData) => {
    try {
      const response = await api.post('/applications', applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Tüm başvuruları getir (admin için)
   */
  getAllApplications: async () => {
    try {
      const response = await api.get('/applications');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Tek başvuru detayı
   */
  getApplicationById: async (id) => {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Tüm kayıtlı ilçeleri getir
   */
  getRegisteredDistricts: async () => {
    try {
      const response = await api.get('/registered-districts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Yakaya göre ilçeleri getir
   * @param {string} side - Yaka (Anadolu/Avrupa)
   */
  getDistrictsBySide: async (side) => {
    try {
      const response = await api.get(`/districts-by-side?side=${side}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * İlçeye göre kayıtlı okulları getir
   * @param {string} district - İlçe adı
   */
  getSchoolsByDistrict: async (district) => {
    try {
      const response = await api.get(`/registered-schools?district=${district}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default applicationService;