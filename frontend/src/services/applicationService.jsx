
import axios from 'axios';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8561/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const applicationService = {
  // Branş ve kategorileri getir
  getSportCategories: async () => {
    try {
      const response = await api.get('/sport-categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // İlçeleri getir
  getDistricts: async () => {
    try {
      const response = await api.get('/districts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Yeni başvuru oluştur
  createApplication: async (applicationData) => {
    try {
      const response = await api.post('/applications', applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tüm başvuruları getir (admin için)
  getAllApplications: async () => {
    try {
      const response = await api.get('/applications');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tek başvuru detayı
  getApplicationById: async (id) => {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getRegisteredDistricts: async () => {
  try {
    const response = await api.get('/registered-districts');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

// İlçeye göre kayıtlı okulları getir
getSchoolsByDistrict: async (district) => {
  try {
    const response = await api.get(`/registered-schools?district=${district}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}
};