import axios from 'axios';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8561/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});


export const nationalApplicationService = {
  // İlleri getir
  getProvinces: async () => {
    try {
      const response = await axios.get(`${API_URL}/national/provinces`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'İller yüklenirken bir hata oluştu' };
    }
  },

  // Seçilen ile göre ilçeleri getir
  getDistrictsByProvince: async (province) => {
    try {
      const response = await axios.get(`${API_URL}/national/districts`, {
        params: { province }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'İlçeler yüklenirken bir hata oluştu' };
    }
  },

  // Seçilen ilçeye göre okulları getir
  getSchoolsByDistrict: async (province, district) => {
    try {
      const response = await axios.get(`${API_URL}/national/schools`, {
        params: { province, district }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Okullar yüklenirken bir hata oluştu' };
    }
  },

  // Spor kategorilerini getir
  getSportCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/national/sport-categories`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Kategoriler yüklenirken bir hata oluştu' };
    }
  },

  // Başvuru oluştur
  createApplication: async (applicationData) => {
    try {
      const response = await axios.post(`${API_URL}/national/applications`, applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Başvuru gönderilirken bir hata oluştu' };
    }
  },

  // Tüm başvuruları getir (admin için)
  getAllApplications: async () => {
    try {
      const response = await axios.get(`${API_URL}/national/applications`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Başvurular yüklenirken bir hata oluştu' };
    }
  }
};