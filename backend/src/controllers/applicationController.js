const { pool } = require('../config/db');

// Branş ve kategorileri getir (tablodaki X'ler)
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

// İlçe listesini getir
exports.getDistricts = async (req, res) => {
  try {
    const districts = {
      "Avrupa": [
        "Arnavutköy", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", 
        "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beylikdüzü", "Beyoğlu", 
        "Büyükçekmece", "Çatalca", "Esenler", "Esenyurt", "Eyüpsultan", 
        "Fatih", "Gaziosmanpaşa", "Güngören", "Kağıthane", "Küçükçekmece", 
        "Sarıyer", "Silivri", "Sultangazi", "Şişli", "Zeytinburnu"
      ],
      "Anadolu": [
        "Adalar", "Ataşehir", "Beykoz", "Çekmeköy", "Kadıköy", 
        "Kartal", "Maltepe", "Pendik", "Sancaktepe", "Sultanbeyli", 
        "Şile", "Tuzla", "Ümraniye", "Üsküdar"
      ]
    };
    
    res.json(districts);
  } catch (error) {
    console.error('İlçeler alınırken hata:', error);
    res.status(500).json({ error: 'İlçeler alınırken bir hata oluştu' });
  }
};

// Yeni başvuru oluştur
exports.createApplication = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { school, teacher_name, teacher_phone, notes, categories } = req.body;
    
    // Validasyon
    if (!school || !school.name || !school.district || !school.side || !school.type) {
      return res.status(400).json({ error: 'Okul bilgileri eksik' });
    }
    
    if (!teacher_name || !teacher_phone) {
      return res.status(400).json({ error: 'Öğretmen bilgileri eksik' });
    }
    
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ error: 'En az bir kategori seçmelisiniz' });
    }
    
    await connection.beginTransaction();
    
    // Önce okulu kontrol et, yoksa oluştur
    const [existingSchools] = await connection.query(
      'SELECT id FROM schools WHERE name = ? AND district = ?',
      [school.name, school.district]
    );
    
    let schoolId;
    
    if (existingSchools.length > 0) {
      schoolId = existingSchools[0].id;
    } else {
      const [schoolResult] = await connection.query(
        'INSERT INTO schools (name, district, side, type) VALUES (?, ?, ?, ?)',
        [school.name, school.district, school.side, school.type]
      );
      schoolId = schoolResult.insertId;
    }
    
    // Başvuruyu oluştur
    const [applicationResult] = await connection.query(
      'INSERT INTO applications (school_id, teacher_name, teacher_phone, notes) VALUES (?, ?, ?, ?)',
      [schoolId, teacher_name, teacher_phone, notes || null]
    );
    
    const applicationId = applicationResult.insertId;
    
    // Kategorileri ekle
    for (const category of categories) {
      await connection.query(
        'INSERT INTO application_categories (application_id, sport_branch, age_category) VALUES (?, ?, ?)',
        [applicationId, category.sport_branch, category.age_category]
      );
    }
    
    await connection.commit();
    
    res.status(201).json({
      message: 'Başvurunuz başarıyla alındı',
      application_id: applicationId,
      school_id: schoolId
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Başvuru oluşturulurken hata:', error);
    res.status(500).json({ error: 'Başvuru oluşturulurken bir hata oluştu' });
  } finally {
    connection.release();
  }
};

// Tüm başvuruları listele (admin için)
exports.getAllApplications = async (req, res) => {
  try {
    const [applications] = await pool.query(`
      SELECT 
        a.id,
        a.teacher_name,
        a.teacher_phone,
        a.notes,
        a.created_at,
        s.name as school_name,
        s.district,
        s.side,
        s.type as school_type,
        GROUP_CONCAT(
          CONCAT(ac.sport_branch, ' - ', ac.age_category)
          SEPARATOR ', '
        ) as categories
      FROM applications a
      JOIN schools s ON a.school_id = s.id
      LEFT JOIN application_categories ac ON a.id = ac.application_id
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `);
    
    res.json(applications);
  } catch (error) {
    console.error('Başvurular alınırken hata:', error);
    res.status(500).json({ error: 'Başvurular alınırken bir hata oluştu' });
  }
};

// Tek başvuru detayı
exports.getApplicationById = async (req, res) => {
  const applicationId = req.params.id;
  
  try {
    const [applications] = await pool.query(`
      SELECT 
        a.*,
        s.name as school_name,
        s.district,
        s.side,
        s.type as school_type
      FROM applications a
      JOIN schools s ON a.school_id = s.id
      WHERE a.id = ?
    `, [applicationId]);
    
    if (applications.length === 0) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }
    
    const [categories] = await pool.query(
      'SELECT sport_branch, age_category FROM application_categories WHERE application_id = ?',
      [applicationId]
    );
    
    const application = applications[0];
    application.categories = categories;
    
    res.json(application);
  } catch (error) {
    console.error('Başvuru detayı alınırken hata:', error);
    res.status(500).json({ error: 'Başvuru detayı alınırken bir hata oluştu' });
  }
};

// Tüm okulları listele
exports.getAllSchools = async (req, res) => {
  try {
    const [schools] = await pool.query('SELECT * FROM schools ORDER BY name');
    res.json(schools);
  } catch (error) {
    console.error('Okullar alınırken hata:', error);
    res.status(500).json({ error: 'Okullar alınırken bir hata oluştu' });
  }
};