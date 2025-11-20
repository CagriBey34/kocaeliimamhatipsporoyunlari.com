// src/controllers/news/tagController.js
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

// Tüm tag'leri listele
exports.getAllTags = async (req, res) => {
  try {
    const [tags] = await pool.query(`
      SELECT t.*, 
      (SELECT COUNT(*) FROM post_tags WHERE tag_id = t.id) as post_count 
      FROM tags t 
      ORDER BY t.name
    `);
    
    res.json({ tags });
  } catch (error) {
    console.error('Tag\'ler alınırken hata:', error);
    res.status(500).json({ error: 'Tag\'ler alınırken bir hata oluştu' });
  }
};

// Tag detayı
exports.getTagById = async (req, res) => {
  try {
    const tagId = req.params.id;
    
    const [rows] = await pool.query(
      'SELECT * FROM tags WHERE id = ?',
      [tagId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tag bulunamadı' });
    }
    
    res.json({ tag: rows[0] });
  } catch (error) {
    console.error('Tag detayı alınırken hata:', error);
    res.status(500).json({ error: 'Tag detayı alınırken bir hata oluştu' });
  }
};

// Yeni tag oluştur
exports.createTag = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Tag adı gereklidir' });
    }
    
    const slug = createSlug(name);
    
    // Slug benzersizliği kontrol et
    const [existingRows] = await pool.query(
      'SELECT id FROM tags WHERE slug = ?',
      [slug]
    );
    
    if (existingRows.length > 0) {
      return res.status(400).json({ error: 'Bu tag zaten mevcut' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO tags (name, slug) VALUES (?, ?)',
      [name, slug]
    );
    
    res.status(201).json({
      id: result.insertId,
      name,
      slug,
      message: 'Tag başarıyla oluşturuldu'
    });
  } catch (error) {
    console.error('Tag oluşturulurken hata:', error);
    res.status(500).json({ error: 'Tag oluşturulurken bir hata oluştu' });
  }
};

// Tag güncelle
exports.updateTag = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    const tagId = req.params.id;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Tag adı gereklidir' });
    }
    
    const slug = createSlug(name);
    
    // Slug benzersizliği kontrol et (mevcut tag hariç)
    const [existingRows] = await pool.query(
      'SELECT id FROM tags WHERE slug = ? AND id != ?',
      [slug, tagId]
    );
    
    if (existingRows.length > 0) {
      return res.status(400).json({ error: 'Bu slug zaten kullanılıyor' });
    }
    
    await pool.query(
      'UPDATE tags SET name = ?, slug = ? WHERE id = ?',
      [name, slug, tagId]
    );
    
    res.json({ message: 'Tag başarıyla güncellendi' });
  } catch (error) {
    console.error('Tag güncellenirken hata:', error);
    res.status(500).json({ error: 'Tag güncellenirken bir hata oluştu' });
  }
};

// Tag sil
exports.deleteTag = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    const tagId = req.params.id;
    
    // Tag ilişkileri CASCADE ile otomatik silinecek
    await pool.query('DELETE FROM tags WHERE id = ?', [tagId]);
    
    res.json({ message: 'Tag başarıyla silindi' });
  } catch (error) {
    console.error('Tag silinirken hata:', error);
    res.status(500).json({ error: 'Tag silinirken bir hata oluştu' });
  }
};

// Popüler tag'leri getir (en çok kullanılan)
exports.getPopularTags = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const [tags] = await pool.query(`
      SELECT t.*, COUNT(pt.post_id) as post_count 
      FROM tags t 
      LEFT JOIN post_tags pt ON t.id = pt.tag_id 
      GROUP BY t.id 
      HAVING post_count > 0 
      ORDER BY post_count DESC 
      LIMIT ?
    `, [limit]);
    
    res.json({ tags });
  } catch (error) {
    console.error('Popüler tag\'ler alınırken hata:', error);
    res.status(500).json({ error: 'Popüler tag\'ler alınırken bir hata oluştu' });
  }
};