// src/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/news/postController');
const categoryController = require('../controllers/news/categoryController');
const tagController = require('../controllers/news/tagController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Auth Middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  res.status(401).json({ error: 'Yetkisiz erişim' });
};

// Multer ayarları - içerik resmi upload
const contentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const year = new Date().getFullYear().toString();
    const dir = path.join(__dirname, '../../public/uploads/posts/content', year);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9.]/g, '-');
    
    cb(null, Date.now() + '-' + fileName);
  }
});

// Multer ayarları - thumbnail upload
const thumbnailStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const year = new Date().getFullYear().toString();
    const dir = path.join(__dirname, '../../public/uploads/posts/thumbnails', year);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9.]/g, '-');
    
    cb(null, Date.now() + '-' + fileName);
  }
});

const uploadContent = multer({
  storage: contentStorage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB ✅
  }
});

const uploadThumbnail = multer({
  storage: thumbnailStorage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB ✅
  }
});

// ============ POST ROUTES ============

// Public routes
router.get('/posts', postController.getAllPosts);
router.get('/posts/slug/:slug', postController.getPostBySlug);
router.get('/posts/category/:categorySlug', postController.getPostsByCategory);
router.get('/posts/tag/:tagSlug', postController.getPostsByTag);

// Admin routes
router.get('/posts/admin/all', isAuthenticated, postController.getAllPostsAdmin);
router.get('/posts/:id', isAuthenticated, postController.getPostById);
router.post('/posts', isAuthenticated, postController.createPost);
router.put('/posts/:id', isAuthenticated, postController.updatePost);
router.delete('/posts/:id', isAuthenticated, postController.deletePost);
router.post('/posts/:id/publish', isAuthenticated, postController.publishPost);
router.post('/posts/:id/unpublish', isAuthenticated, postController.unpublishPost);

// Image upload routes
router.post('/posts/upload/content', isAuthenticated, (req, res, next) => {
  uploadContent.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer hatası:', err);
      return res.status(500).json({ error: err.message });
    }
    postController.uploadContentImage(req, res, next);
  });
});

router.post('/posts/upload/thumbnail', isAuthenticated, (req, res, next) => {
  uploadThumbnail.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer hatası:', err);
      return res.status(500).json({ error: err.message });
    }
    postController.uploadThumbnail(req, res, next);
  });
});

// ============ CATEGORY ROUTES ============

// Public routes
router.get('/categories', categoryController.getAllCategories);

// Admin routes
router.get('/categories/:id', isAuthenticated, categoryController.getCategoryById);
router.post('/categories', isAuthenticated, categoryController.createCategory);
router.put('/categories/:id', isAuthenticated, categoryController.updateCategory);
router.delete('/categories/:id', isAuthenticated, categoryController.deleteCategory);

// ============ TAG ROUTES ============

// Public routes
router.get('/tags', tagController.getAllTags);
router.get('/tags/popular', tagController.getPopularTags);

// Admin routes
router.get('/tags/:id', isAuthenticated, tagController.getTagById);
router.post('/tags', isAuthenticated, tagController.createTag);
router.put('/tags/:id', isAuthenticated, tagController.updateTag);
router.delete('/tags/:id', isAuthenticated, tagController.deleteTag);

module.exports = router;