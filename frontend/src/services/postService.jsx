// src/services/postService.js
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

export const postService = {
  // ============ POST İŞLEMLERİ ============
  
  /**
   * Tüm yayınlanmış postları getir (Public)
   * @param {number} page - Sayfa numarası
   * @param {number} limit - Sayfa başına kayıt
   * @param {number} categoryId - Kategori ID (opsiyonel)
   * @param {number} tagId - Tag ID (opsiyonel)
   */
  getAllPosts: async (page = 1, limit = 10, categoryId = null, tagId = null) => {
    try {
      let url = `/posts?page=${page}&limit=${limit}`;
      if (categoryId) url += `&category_id=${categoryId}`;
      if (tagId) url += `&tag_id=${tagId}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Tüm postları getir - Admin (yayınlanmamış dahil)
   */
  getAllPostsAdmin: async () => {
    try {
      const response = await api.get('/posts/admin/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Post detayı - slug ile (Public)
   * @param {string} slug - Post slug
   */
  getPostBySlug: async (slug) => {
    try {
      const response = await api.get(`/posts/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Post detayı - ID ile (Admin)
   * @param {number} id - Post ID
   */
  getPostById: async (id) => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Kategoriye göre postlar
   * @param {string} categorySlug - Kategori slug
   * @param {number} page - Sayfa numarası
   * @param {number} limit - Sayfa başına kayıt
   */
  getPostsByCategory: async (categorySlug, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/posts/category/${categorySlug}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Tag'e göre postlar
   * @param {string} tagSlug - Tag slug
   * @param {number} page - Sayfa numarası
   * @param {number} limit - Sayfa başına kayıt
   */
  getPostsByTag: async (tagSlug, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/posts/tag/${tagSlug}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Yeni post oluştur (Admin)
   * @param {object} postData - Post verisi
   */
  createPost: async (postData) => {
    try {
      const response = await api.post('/posts', postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Post güncelle (Admin)
   * @param {number} id - Post ID
   * @param {object} postData - Post verisi
   */
  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Post sil (Admin)
   * @param {number} id - Post ID
   */
  deletePost: async (id) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Post'u yayınla (Admin)
   * @param {number} id - Post ID
   */
  publishPost: async (id) => {
    try {
      const response = await api.post(`/posts/${id}/publish`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Post'u yayından kaldır (Admin)
   * @param {number} id - Post ID
   */
  unpublishPost: async (id) => {
    try {
      const response = await api.post(`/posts/${id}/unpublish`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * İçerik resmi yükle (Admin)
   * @param {File} file - Resim dosyası
   */
  uploadContentImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/posts/upload/content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Thumbnail yükle (Admin)
   * @param {File} file - Resim dosyası
   */
  uploadThumbnail: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/posts/upload/thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ============ KATEGORİ İŞLEMLERİ ============

  /**
   * Tüm kategorileri getir
   */
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Kategori detayı (Admin)
   * @param {number} id - Kategori ID
   */
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Yeni kategori oluştur (Admin)
   * @param {object} categoryData - Kategori verisi
   */
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Kategori güncelle (Admin)
   * @param {number} id - Kategori ID
   * @param {object} categoryData - Kategori verisi
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Kategori sil (Admin)
   * @param {number} id - Kategori ID
   */
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ============ TAG İŞLEMLERİ ============

  /**
   * Tüm tag'leri getir
   */
  getAllTags: async () => {
    try {
      const response = await api.get('/tags');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Popüler tag'leri getir
   * @param {number} limit - Limit
   */
  getPopularTags: async (limit = 10) => {
    try {
      const response = await api.get(`/tags/popular?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Tag detayı (Admin)
   * @param {number} id - Tag ID
   */
  getTagById: async (id) => {
    try {
      const response = await api.get(`/tags/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Yeni tag oluştur (Admin)
   * @param {object} tagData - Tag verisi
   */
  createTag: async (tagData) => {
    try {
      const response = await api.post('/tags', tagData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Tag güncelle (Admin)
   * @param {number} id - Tag ID
   * @param {object} tagData - Tag verisi
   */
  updateTag: async (id, tagData) => {
    try {
      const response = await api.put(`/tags/${id}`, tagData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Tag sil (Admin)
   * @param {number} id - Tag ID
   */
  deleteTag: async (id) => {
    try {
      const response = await api.delete(`/tags/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default postService;