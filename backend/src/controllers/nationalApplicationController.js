const { pool } = require('../config/db');

// İlleri getir
exports.getProvinces = async (req, res) => {
  try {
    const [provinces] = await pool.query(
      'SELECT DISTINCT il_adi FROM okullar ORDER BY il_adi'
    );
    res.json(provinces.map(p => p.il_adi));
  } catch (error) {
    console.error('İller alınırken hata:', error);
    res.status(500).json({ error: 'İller alınırken bir hata oluştu' });
  }
};

// Seçilen ile göre ilçeleri getir
exports.getDistrictsByProvince = async (req, res) => {
  try {
    const { province } = req.query;
    
    if (!province) {
      return res.status(400).json({ error: 'İl parametresi gerekli' });
    }
    
    const [districts] = await pool.query(
      'SELECT DISTINCT ilce_adi FROM okullar WHERE il_adi = ? ORDER BY ilce_adi',
      [province]
    );
    
    res.json(districts.map(d => d.ilce_adi));
  } catch (error) {
    console.error('İlçeler alınırken hata:', error);
    res.status(500).json({ error: 'İlçeler alınırken bir hata oluştu' });
  }
};

// Seçilen ilçeye göre okulları getir
exports.getSchoolsByDistrict = async (req, res) => {
  try {
    const { province, district } = req.query;
    
    if (!province || !district) {
      return res.status(400).json({ error: 'İl ve ilçe parametreleri gerekli' });
    }
    
    const [schools] = await pool.query(
      'SELECT id, kurum_adi, kurum_kodu, okul_turu FROM okullar WHERE il_adi = ? AND ilce_adi = ? ORDER BY kurum_adi',
      [province, district]
    );
    
    res.json(schools);
  } catch (error) {
    console.error('Okullar alınırken hata:', error);
    res.status(500).json({ error: 'Okullar alınırken bir hata oluştu' });
  }
};

// Spor kategorileri (mevcut sistemdeki ile aynı)
exports.getSportCategories = async (req, res) => {
  try {
    const categories = {
      "Taekwondo": ["Yıldız Erkek", "Genç Erkek", "Yıldız Kız", "Genç Kız"],
      "Masa Tenisi": ["Yıldız Erkek", "Genç Erkek", "Yıldız Kız", "Genç Kız"],
      "Satranç": ["Yıldız Erkek", "Genç Erkek", "Yıldız Kız", "Genç Kız"],
      "Badminton": ["Yıldız Erkek", "Genç Erkek", "Yıldız Kız", "Genç Kız"],
      "Mangala": ["Yıldız Erkek", "Genç Erkek", "Yıldız Kız", "Genç Kız"],
      "Bilek Güreşi": ["Küçük Erkek", "Yıldız Erkek", "Genç Erkek"],
      "Dart": ["Yıldız Erkek", "Genç Erkek", "Yıldız Kız", "Genç Kız"],
      "Karate": ["Yıldız Erkek", "Yıldız Kız"],
      "Voleybol": ["Yıldız Kız", "Genç Kız"],
      "Geleneksel Türk Okçuluğu": ["Yıldız Erkek", "Genç Erkek", "Yıldız Kız", "Genç Kız"],
      "Atletizm": ["Küçük Erkek", "Yıldız Erkek", "Genç Erkek"],
      "3+3 Basketbol": ["Yıldız Erkek", "Genç Erkek"],
      "Bocce": ["Yıldız Erkek", "Genç Erkek", "Yıldız Kız", "Genç Kız"],
      "Futsal": ["Yıldız Erkek", "Genç Erkek"],
      "Güreş": ["Genç Erkek"],
      "Ayak Tenisi": ["Yıldız Erkek", "Genç Erkek"],
      "Modern Okçuluk Klasik Yay": ["Yıldız Erkek", "Genç Erkek", "Yıldız Kız", "Genç Kız"]
    };
    
    res.json(categories);
  } catch (error) {
    console.error('Kategoriler alınırken hata:', error);
    res.status(500).json({ error: 'Kategoriler alınırken bir hata oluştu' });
  }
};

// Yeni başvuru oluştur (Türkiye geneli)
exports.createNationalApplication = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { school_id, teacher_name, teacher_phone, notes, categories } = req.body;
    
    // Validasyon
    if (!school_id) {
      return res.status(400).json({ error: 'Okul seçimi zorunludur' });
    }
    
    if (!teacher_name || !teacher_phone) {
      return res.status(400).json({ error: 'Öğretmen bilgileri eksik' });
    }
    
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ error: 'En az bir kategori seçmelisiniz' });
    }
    
    await connection.beginTransaction();
    
    // Okul daha önce başvuru yapmış mı kontrol et
    const [existingApplications] = await connection.query(
      'SELECT id FROM national_applications WHERE school_id = ?',
      [school_id]
    );
    
    if (existingApplications.length > 0) {
      await connection.rollback();
      return res.status(400).json({ 
        error: 'Bu okul daha önce başvuru yapmıştır. Her okul sadece bir kez başvuru yapabilir.',
        existing_application_id: existingApplications[0].id
      });
    }
    
    // Başvuruyu oluştur
    const [applicationResult] = await connection.query(
      'INSERT INTO national_applications (school_id, teacher_name, teacher_phone, notes) VALUES (?, ?, ?, ?)',
      [school_id, teacher_name, teacher_phone, notes || null]
    );
    
    const applicationId = applicationResult.insertId;
    
    // Kategorileri ekle
    for (const category of categories) {
      await connection.query(
        'INSERT INTO national_application_categories (application_id, sport_branch, age_category) VALUES (?, ?, ?)',
        [applicationId, category.sport_branch, category.age_category]
      );
    }
    
    await connection.commit();
    
    res.status(201).json({
      message: 'Başvurunuz başarıyla alındı',
      application_id: applicationId,
      school_id: school_id
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Başvuru oluşturulurken hata:', error);
    res.status(500).json({ error: 'Başvuru oluşturulurken bir hata oluştu' });
  } finally {
    connection.release();
  }
};

// Tüm başvuruları listele (admin)
exports.getAllNationalApplications = async (req, res) => {
  try {
    const [applications] = await pool.query(`
      SELECT 
        na.id,
        na.teacher_name,
        na.teacher_phone,
        na.notes,
        na.created_at,
        o.kurum_adi as school_name,
        o.il_adi as province,
        o.ilce_adi as district,
        o.okul_turu as school_type,
        GROUP_CONCAT(
          CONCAT(nac.sport_branch, ' - ', nac.age_category)
          SEPARATOR ', '
        ) as categories
      FROM national_applications na
      JOIN okullar o ON na.school_id = o.id
      LEFT JOIN national_application_categories nac ON na.id = nac.application_id
      GROUP BY na.id
      ORDER BY na.created_at DESC
    `);
    
    res.json(applications);
  } catch (error) {
    console.error('Başvurular alınırken hata:', error);
    res.status(500).json({ error: 'Başvurular alınırken bir hata oluştu' });
  }
};