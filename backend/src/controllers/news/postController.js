// src/controllers/news/postController.js
const { pool } = require('../../config/db');
const fs = require('fs');
const path = require('path');

// Slug oluşturma fonksiyonu
const createSlug = (title) => {
  return title
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

// Benzersiz slug oluşturma
const createUniqueSlug = async (title, postId = null) => {
  let slug = createSlug(title);
  let counter = 1;
  let uniqueSlug = slug;
  
  while (true) {
    const query = postId 
      ? 'SELECT id FROM posts WHERE slug = ? AND id != ?' 
      : 'SELECT id FROM posts WHERE slug = ?';
    const params = postId ? [uniqueSlug, postId] : [uniqueSlug];
    
    const [rows] = await pool.query(query, params);
    
    if (rows.length === 0) {
      break;
    }
    
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
};

// Tüm postları listele (PUBLIC - sadece yayınlanmış)
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const categoryId = req.query.category_id;
    const tagId = req.query.tag_id;
    
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_published = TRUE
    `;
    
    const params = [];
    
    if (categoryId) {
      query += ' AND p.category_id = ?';
      params.push(categoryId);
    }
    
    if (tagId) {
      query += ' AND p.id IN (SELECT post_id FROM post_tags WHERE tag_id = ?)';
      params.push(tagId);
    }
    
    query += ' ORDER BY p.published_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [posts] = await pool.query(query, params);
    
    // Toplam sayıyı al
    let countQuery = 'SELECT COUNT(*) as total FROM posts WHERE is_published = TRUE';
    const countParams = [];
    
    if (categoryId) {
      countQuery += ' AND category_id = ?';
      countParams.push(categoryId);
    }
    
    if (tagId) {
      countQuery += ' AND id IN (SELECT post_id FROM post_tags WHERE tag_id = ?)';
      countParams.push(tagId);
    }
    
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;
    
    // Her post için tag'leri getir
    for (let post of posts) {
      const [tags] = await pool.query(`
        SELECT t.* FROM tags t 
        INNER JOIN post_tags pt ON t.id = pt.tag_id 
        WHERE pt.post_id = ?
      `, [post.id]);
      post.tags = tags;
    }
    
    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Postlar alınırken hata:', error);
    res.status(500).json({ error: 'Postlar alınırken bir hata oluştu' });
  }
};

// Tüm postları listele - ADMIN (yayınlanmamış dahil)
exports.getAllPostsAdmin = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    const [posts] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC
    `);
    
    // Her post için tag'leri getir
    for (let post of posts) {
      const [tags] = await pool.query(`
        SELECT t.* FROM tags t 
        INNER JOIN post_tags pt ON t.id = pt.tag_id 
        WHERE pt.post_id = ?
      `, [post.id]);
      post.tags = tags;
    }
    
    res.json({ posts });
  } catch (error) {
    console.error('Postlar alınırken hata:', error);
    res.status(500).json({ error: 'Postlar alınırken bir hata oluştu' });
  }
};

// Tek post detayı (slug ile)
exports.getPostBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.slug = ? AND p.is_published = TRUE
    `, [slug]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post bulunamadı' });
    }
    
    const post = rows[0];
    
    // Tag'leri getir
    const [tags] = await pool.query(`
      SELECT t.* FROM tags t 
      INNER JOIN post_tags pt ON t.id = pt.tag_id 
      WHERE pt.post_id = ?
    `, [post.id]);
    post.tags = tags;
    
    // Görüntülenme sayısını arttır
    await pool.query('UPDATE posts SET view_count = view_count + 1 WHERE id = ?', [post.id]);
    
    // İlgili postları getir (aynı kategoriden, son 3)
    const [relatedPosts] = await pool.query(`
      SELECT id, title, slug, thumbnail, published_at 
      FROM posts 
      WHERE category_id = ? AND id != ? AND is_published = TRUE 
      ORDER BY published_at DESC 
      LIMIT 3
    `, [post.category_id, post.id]);
    
    res.json({ 
      post,
      relatedPosts 
    });
  } catch (error) {
    console.error('Post detayı alınırken hata:', error);
    res.status(500).json({ error: 'Post detayı alınırken bir hata oluştu' });
  }
};

// Post detayı ID ile (ADMIN)
exports.getPostById = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    const postId = req.params.id;
    
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [postId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post bulunamadı' });
    }
    
    const post = rows[0];
    
    // Tag'leri getir
    const [tags] = await pool.query(`
      SELECT t.id, t.name FROM tags t 
      INNER JOIN post_tags pt ON t.id = pt.tag_id 
      WHERE pt.post_id = ?
    `, [post.id]);
    post.tags = tags;
    
    res.json({ post });
  } catch (error) {
    console.error('Post detayı alınırken hata:', error);
    res.status(500).json({ error: 'Post detayı alınırken bir hata oluştu' });
  }
};

// Yeni post oluştur
exports.createPost = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    const { title, content, category_id, thumbnail, tags } = req.body;
    
    if (!title || !content || !category_id) {
      return res.status(400).json({ error: 'Başlık, içerik ve kategori gereklidir' });
    }
    
    // Benzersiz slug oluştur
    const slug = await createUniqueSlug(title);
    
    const [result] = await pool.query(
      'INSERT INTO posts (title, slug, content, category_id, thumbnail) VALUES (?, ?, ?, ?, ?)',
      [title, slug, content, category_id, thumbnail || null]
    );
    
    const postId = result.insertId;
    
    // Tag'leri ekle
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (let tagId of tags) {
        await pool.query(
          'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)',
          [postId, tagId]
        );
      }
    }
    
    res.status(201).json({
      id: postId,
      title,
      slug,
      message: 'Post başarıyla oluşturuldu'
    });
  } catch (error) {
    console.error('Post oluşturulurken hata:', error);
    res.status(500).json({ error: 'Post oluşturulurken bir hata oluştu' });
  }
};

// Post güncelle
exports.updatePost = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    const postId = req.params.id;
    const { title, content, category_id, thumbnail, tags } = req.body;
    
    if (!title || !content || !category_id) {
      return res.status(400).json({ error: 'Başlık, içerik ve kategori gereklidir' });
    }
    
    // Slug güncelle
    const slug = await createUniqueSlug(title, postId);
    
    await pool.query(
      'UPDATE posts SET title = ?, slug = ?, content = ?, category_id = ?, thumbnail = ? WHERE id = ?',
      [title, slug, content, category_id, thumbnail || null, postId]
    );
    
    // Mevcut tag ilişkilerini sil
    await pool.query('DELETE FROM post_tags WHERE post_id = ?', [postId]);
    
    // Yeni tag'leri ekle
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (let tagId of tags) {
        await pool.query(
          'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)',
          [postId, tagId]
        );
      }
    }
    
    res.json({ message: 'Post başarıyla güncellendi' });
  } catch (error) {
    console.error('Post güncellenirken hata:', error);
    res.status(500).json({ error: 'Post güncellenirken bir hata oluştu' });
  }
};

// Post sil
exports.deletePost = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    const postId = req.params.id;
    
    // Post'u al
    const [rows] = await pool.query('SELECT thumbnail FROM posts WHERE id = ?', [postId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post bulunamadı' });
    }
    
    const thumbnail = rows[0].thumbnail;
    
    // Thumbnail varsa sil
    if (thumbnail) {
      const filePath = path.join(__dirname, '../../../public', thumbnail);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Post'u sil (CASCADE ile post_tags da silinir)
    await pool.query('DELETE FROM posts WHERE id = ?', [postId]);
    
    res.json({ message: 'Post başarıyla silindi' });
  } catch (error) {
    console.error('Post silinirken hata:', error);
    res.status(500).json({ error: 'Post silinirken bir hata oluştu' });
  }
};

// Post'u yayınla
exports.publishPost = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    const postId = req.params.id;
    
    await pool.query(
      'UPDATE posts SET is_published = TRUE, published_at = NOW() WHERE id = ?',
      [postId]
    );
    
    res.json({ message: 'Post başarıyla yayınlandı' });
  } catch (error) {
    console.error('Post yayınlanırken hata:', error);
    res.status(500).json({ error: 'Post yayınlanırken bir hata oluştu' });
  }
};

// Post'u yayından kaldır
exports.unpublishPost = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    const postId = req.params.id;
    
    await pool.query(
      'UPDATE posts SET is_published = FALSE WHERE id = ?',
      [postId]
    );
    
    res.json({ message: 'Post yayından kaldırıldı' });
  } catch (error) {
    console.error('Post yayından kaldırılırken hata:', error);
    res.status(500).json({ error: 'Post yayından kaldırılırken bir hata oluştu' });
  }
};

// Kategoriye göre postlar
exports.getPostsByCategory = async (req, res) => {
  try {
    const categorySlug = req.params.categorySlug;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Kategoriyi bul
    const [categoryRows] = await pool.query(
      'SELECT * FROM categories WHERE slug = ?',
      [categorySlug]
    );
    
    if (categoryRows.length === 0) {
      return res.status(404).json({ error: 'Kategori bulunamadı' });
    }
    
    const category = categoryRows[0];
    
    // Postları getir
    const [posts] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.category_id = ? AND p.is_published = TRUE 
      ORDER BY p.published_at DESC 
      LIMIT ? OFFSET ?
    `, [category.id, limit, offset]);
    
    // Toplam sayı
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM posts WHERE category_id = ? AND is_published = TRUE',
      [category.id]
    );
    const total = countResult[0].total;
    
    // Her post için tag'leri getir
    for (let post of posts) {
      const [tags] = await pool.query(`
        SELECT t.* FROM tags t 
        INNER JOIN post_tags pt ON t.id = pt.tag_id 
        WHERE pt.post_id = ?
      `, [post.id]);
      post.tags = tags;
    }
    
    res.json({
      category,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Kategoriye göre postlar alınırken hata:', error);
    res.status(500).json({ error: 'Postlar alınırken bir hata oluştu' });
  }
};

// Tag'e göre postlar
exports.getPostsByTag = async (req, res) => {
  try {
    const tagSlug = req.params.tagSlug;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Tag'i bul
    const [tagRows] = await pool.query(
      'SELECT * FROM tags WHERE slug = ?',
      [tagSlug]
    );
    
    if (tagRows.length === 0) {
      return res.status(404).json({ error: 'Tag bulunamadı' });
    }
    
    const tag = tagRows[0];
    
    // Postları getir
    const [posts] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      INNER JOIN post_tags pt ON p.id = pt.post_id 
      WHERE pt.tag_id = ? AND p.is_published = TRUE 
      ORDER BY p.published_at DESC 
      LIMIT ? OFFSET ?
    `, [tag.id, limit, offset]);
    
    // Toplam sayı
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total FROM posts p 
      INNER JOIN post_tags pt ON p.id = pt.post_id 
      WHERE pt.tag_id = ? AND p.is_published = TRUE
    `, [tag.id]);
    const total = countResult[0].total;
    
    // Her post için tag'leri getir
    for (let post of posts) {
      const [tags] = await pool.query(`
        SELECT t.* FROM tags t 
        INNER JOIN post_tags pt ON t.id = pt.tag_id 
        WHERE pt.post_id = ?
      `, [post.id]);
      post.tags = tags;
    }
    
    res.json({
      tag,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Tag\'e göre postlar alınırken hata:', error);
    res.status(500).json({ error: 'Postlar alınırken bir hata oluştu' });
  }
};

// Resim upload (içerik için)
exports.uploadContentImage = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resim yüklenmedi' });
    }
    
    const year = new Date().getFullYear().toString();
    const url = `/uploads/posts/content/${year}/${req.file.filename}`;
    
    res.json({ 
      success: true,
      url 
    });
  } catch (error) {
    console.error('Resim yüklenirken hata:', error);
    res.status(500).json({ error: 'Resim yüklenirken bir hata oluştu' });
  }
};

// Thumbnail upload
exports.uploadThumbnail = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Yetkilendirme hatası' });
  }
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resim yüklenmedi' });
    }
    
    const year = new Date().getFullYear().toString();
    const url = `/uploads/posts/thumbnails/${year}/${req.file.filename}`;
    
    res.json({ 
      success: true,
      url 
    });
  } catch (error) {
    console.error('Thumbnail yüklenirken hata:', error);
    res.status(500).json({ error: 'Thumbnail yüklenirken bir hata oluştu' });
  }
};