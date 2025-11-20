// src/controllers/news/categoryController.js
const { pool } = require('../../config/db');

// Slug oluşturma fonksiyonu
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Tüm kategorileri listele
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT c.*, 
      (SELECT COUNT(*) FROM posts WHERE category_id = c.id AND is_published = TRUE) as post_count 
      FROM categories c 
      ORDER BY c.name
    `);
    
    res.json({ categories });
  } catch (error) {
    console.error('Kategoriler alınırken hata:', error);
    res.status(500).json({ error: 'Kategoriler alınırken bir hata oluştu' });
  }
};

// Kategori detayı
exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE id = ?',
      [categoryId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Kategori bulunamadı' });
    }
    
    res.json({ category: rows[0] });
  } catch (error) {
    console.error('Kategori detayı alınırken hata:', error);
    res.status(500).json({ error: 'Kategori detayı alınırken bir hata oluştu' });
  }
};

// Yeni kategori oluştur
exports.createCategory = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Kategori adı gereklidir' });
    }
    
    const slug = createSlug(name);
    
    // Slug benzersizliği kontrol et
    const [existingRows] = await pool.query(
      'SELECT id FROM categories WHERE slug = ?',
      [slug]
    );
    
    if (existingRows.length > 0) {
      return res.status(400).json({ error: 'Bu kategori zaten mevcut' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug) VALUES (?, ?)',
      [name, slug]
    );
    
    res.status(201).json({
      id: result.insertId,
      name,
      slug,
      message: 'Kategori başarıyla oluşturuldu'
    });
  } catch (error) {
    console.error('Kategori oluşturulurken hata:', error);
    res.status(500).json({ error: 'Kategori oluşturulurken bir hata oluştu' });
  }
};

// Kategori güncelle
exports.updateCategory = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    const categoryId = req.params.id;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Kategori adı gereklidir' });
    }
    
    const slug = createSlug(name);
    
    // Slug benzersizliği kontrol et (mevcut kategori hariç)
    const [existingRows] = await pool.query(
      'SELECT id FROM categories WHERE slug = ? AND id != ?',
      [slug, categoryId]
    );
    
    if (existingRows.length > 0) {
      return res.status(400).json({ error: 'Bu slug zaten kullanılıyor' });
    }
    
    await pool.query(
      'UPDATE categories SET name = ?, slug = ? WHERE id = ?',
      [name, slug, categoryId]
    );
    
    res.json({ message: 'Kategori başarıyla güncellendi' });
  } catch (error) {
    console.error('Kategori güncellenirken hata:', error);
    res.status(500).json({ error: 'Kategori güncellenirken bir hata oluştu' });
  }
};

// Kategori sil
exports.deleteCategory = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    const categoryId = req.params.id;
    
    // Kategoride post var mı kontrol et
    const [posts] = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE category_id = ?',
      [categoryId]
    );
    
    if (posts[0].count > 0) {
      return res.status(400).json({ 
        error: 'Bu kategoriye ait postlar var. Önce postları silin veya başka kategoriye taşıyın.' 
      });
    }
    
    await pool.query('DELETE FROM categories WHERE id = ?', [categoryId]);
    
    res.json({ message: 'Kategori başarıyla silindi' });
  } catch (error) {
    console.error('Kategori silinirken hata:', error);
    res.status(500).json({ error: 'Kategori silinirken bir hata oluştu' });
  }
};