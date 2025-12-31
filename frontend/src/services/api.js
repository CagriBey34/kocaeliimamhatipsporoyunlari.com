// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8561/api';
const ADMIN_URL = import.meta.env.PROD ? '/admin/api' : 'http://localhost:8561/admin';

// API instance oluştur
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Admin API instance oluştur
const adminApi = axios.create({
  baseURL: ADMIN_URL,
  withCredentials: true
});

// API instance oluşturup istekte bulunduktan sonra bir interceptor ekleyelim
api.interceptors.response.use(
  response => response,
  async error => {
    // 401 Unauthorized hatası alındığında
    if (error.response && error.response.status === 401) {
      console.log('Yetkisiz erişim hatası. Oturum kontrolü yapılıyor.');
      
      // Saklanan oturum durumunu sıfırla
      sessionStorage.removeItem('isLoggedIn');
      
      // Login sayfasına yönlendir (bu kısmı bir utility fonksiyonundan çağırabilirsiniz)
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
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


// Admin kimlik doğrulama işlemleri
export const adminService = {
  login: async (username, password) => {
    try {
      const response = await adminApi.post('/login', { username, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  logout: async () => {
    try {
      const response = await adminApi.post('/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  checkAuth: async () => {
    try {
      const response = await adminApi.get('/check-auth');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Fotoğraf işlemleri
export const photoService = {
  getAllPhotos: async () => {
    try {
      const response = await adminApi.get('/photos');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getPhotosByYear: async (year) => {
    try {
      const response = await api.get(`/photos?year=${year}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  uploadPhotos: async (formData) => {
    try {
      const response = await adminApi.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  deletePhoto: async (photoId) => {
    try {
      const response = await adminApi.delete(`/photos/${photoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};


export const tournamentService = {
  // Publik API rotaları için api instance
  getAllTournaments: async () => {
    try {
      const response = await api.get('/tournaments');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getTournamentMatches: async (tournamentId) => {
    try {
      const response = await api.get(`/tournaments/${tournamentId}/matches`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Admin API rotaları için api instance (adminApi değil)
  createTournament: async (tournamentData) => {
    try {
      const response = await api.post('/tournaments', tournamentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getTournamentStages: async (tournamentId) => {
    try {
      const response = await api.get(`/tournaments/${tournamentId}/stages`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  createStage: async (tournamentId, stageData) => {
    try {
      const response = await api.post(`/tournaments/${tournamentId}/stages`, stageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getStageMatches: async (stageId) => {
    try {
      const response = await api.get(`/stages/${stageId}/matches`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  createMatch: async (stageId, matchData) => {
    try {
      const response = await api.post(`/stages/${stageId}/matches`, matchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  updateMatchScore: async (matchId, scoreData) => {
    try {
      const response = await api.put(`/matches/${matchId}/score`, scoreData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default { adminService, photoService, tournamentService };



