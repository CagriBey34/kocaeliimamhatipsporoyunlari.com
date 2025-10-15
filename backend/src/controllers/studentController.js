const { pool } = require('../config/db');
const ExcelJS = require('exceljs');

// Branş yapılandırmalarını getir
exports.getSportConfigurations = async (req, res) => {
  try {
    const configurations = {
      "Taekwondo": {
        categories: {
          "Yıldız Kız": {
            birthYears: [2011, 2012, 2013],
            weights: ["29", "33", "37", "41", "44", "47", "51", "55", "59"],
            requiresRegistration: true
          },
          "Yıldız Erkek": {
            birthYears: [2011, 2012, 2013],
            weights: ["33", "37", "41", "45", "49", "53", "57", "61", "65"],
            requiresRegistration: true
          },
          "Genç Kız": {
            birthYears: [2008, 2009, 2010],
            weights: ["42", "44", "46", "49", "52", "55", "59", "63", "68"],
            requiresRegistration: true
          },
          "Genç Erkek": {
            birthYears: [2008, 2009, 2010],
            weights: ["45", "48", "51", "55", "59", "63", "68", "73", "78"],
            requiresRegistration: true
          }
        }
      },
      "Güreş": {
        categories: {
          "Genç Erkek": {
            birthYears: [2007, 2008, 2009, 2010],
            weights: ["41-45", "48", "51", "55", "60", "65", "71", "80", "92", "92-110"]
          }
        }
      },
      "Karate": {
        categories: {
          "Yıldız Erkek": {
            weights: ["35", "43", "51", "58", "+58"]
          },
          "Yıldız Kız": {
            weights: ["34", "42", "48", "+48"]
          }
        }
      },
      "Bilek Güreşi": {
        categories: {
          "Küçük Erkek": {
            birthYears: [2014, 2015],
            weights: ["35", "40", "45", "50", "55", "60", "+65"]
          },
          "Yıldız Erkek": {
            birthYears: [2012, 2013],
            weights: ["40", "45", "50", "55", "60", "65", "+70"]
          },
          "Genç Erkek": {
            birthYears: [2007, 2008, 2009, 2010, 2011],
            weights: ["50", "55", "60", "65", "70", "75", "+80"]
          }
        }
      },
      "Masa Tenisi": {
        categories: {
          "Yıldız Erkek": {},
          "Genç Erkek": {},
          "Yıldız Kız": {},
          "Genç Kız": {}
        }
      },
      "Satranç": {
        categories: {
          "Yıldız Erkek": {},
          "Genç Erkek": {},
          "Yıldız Kız": {},
          "Genç Kız": {}
        }
      },
      "Badminton": {
        categories: {
          "Yıldız Erkek": {},
          "Genç Erkek": {},
          "Yıldız Kız": {},
          "Genç Kız": {}
        }
      },
      "Mangala": {
        categories: {
          "Yıldız Erkek": {},
          "Genç Erkek": {},
          "Yıldız Kız": {},
          "Genç Kız": {}
        }
      },
      "Dart": {
        categories: {
          "Yıldız Erkek": {},
          "Genç Erkek": {},
          "Yıldız Kız": {},
          "Genç Kız": {}
        }
      },
      "Voleybol": {
        categories: {
          "Yıldız Kız": {},
          "Genç Kız": {}
        }
      },
      "Geleneksel Türk Okçuluğu": {
        categories: {
          "Yıldız Erkek": {},
          "Genç Erkek": {},
          "Yıldız Kız": {},
          "Genç Kız": {}
        }
      },
      "Atletizm": {
        categories: {
          "Küçük Erkek": {},
          "Yıldız Erkek": {},
          "Genç Erkek": {}
        }
      },
      "3+3 Basketbol": {
        categories: {
          "Yıldız Erkek": {},
          "Genç Erkek": {}
        }
      },
      "Bocce": {
        categories: {
          "Yıldız Erkek": {},
          "Genç Erkek": {},
          "Yıldız Kız": {},
          "Genç Kız": {}
        }
      },
      "Futsal": {
        categories: {
          "Yıldız Erkek": {},
          "Genç Erkek": {}
        }
      },
      "Ayak Tenisi": {
        categories: {
          "Yıldız Erkek": {},
          "Genç Erkek": {}
        }
      },
      "Modern Okçuluk Klasik Yay": {
        categories: {
          "Yıldız Erkek": {},
          "Genç Erkek": {},
          "Yıldız Kız": {},
          "Genç Kız": {}
        }
      }
    };
    
    res.json(configurations);
  } catch (error) {
    console.error('Spor yapılandırmaları alınırken hata:', error);
    res.status(500).json({ error: 'Yapılandırmalar alınırken hata oluştu' });
  }
};

// Öğrenci kaydı oluştur
exports.createStudentRegistration = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const {
      school,
      teacher_name,
      teacher_phone,
      sport_branch,
      age_category,
      weight_class,
      students, // ✅ registration_number artık buradan değil, her öğrenciden gelecek
      notes
    } = req.body;
    
    // Validasyon
    if (!school || !school.name || !school.district || !school.side || !school.type) {
      return res.status(400).json({ error: 'Okul bilgileri eksik' });
    }
    
    if (!teacher_name || !teacher_phone) {
      return res.status(400).json({ error: 'Öğretmen bilgileri eksik' });
    }
    
    if (!sport_branch || !age_category) {
      return res.status(400).json({ error: 'Branş ve kategori bilgileri eksik' });
    }
    
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: 'En az bir öğrenci bilgisi girmelisiniz' });
    }
    
    // ✅ Taekwondo için her öğrencinin sicil no kontrolü - DÜZELTİLMİŞ
if (sport_branch === 'Taekwondo') {
  for (const student of students) {
    console.log('🔍 Kontrol edilen öğrenci:', student); // ✅ DEBUG
    console.log('🔍 Sicil no:', student.registration_number); // ✅ DEBUG
    console.log('🔍 Sicil no tipi:', typeof student.registration_number); // ✅ DEBUG
    console.log('🔍 Sicil no boş mu?', !student.registration_number); // ✅ DEBUG
    
    if (!student.registration_number || student.registration_number.trim() === '') {
      await connection.rollback();
      return res.status(400).json({ 
        error: `Taekwondo için tüm öğrencilerin sicil numarası zorunludur. ${student.first_name} ${student.last_name} için sicil numarası eksik.` 
      });
    }
  }
}
    
    await connection.beginTransaction();
    
    // Okul kontrolü ve oluşturma
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
    
    // Öğrencileri kaydet
    const insertedStudents = [];
    
    for (const student of students) {
      if (!student.first_name || !student.last_name || !student.birth_date) {
        await connection.rollback();
        return res.status(400).json({ error: 'Öğrenci ad, soyad ve doğum tarihi zorunludur' });
      }
      
      // ✅ Her öğrencinin kendi registration_number'ı
      const [result] = await connection.query(
        `INSERT INTO students 
        (school_id, teacher_name, teacher_phone, student_first_name, student_last_name, 
         birth_date, sport_branch, age_category, weight_class, registration_number, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          schoolId,
          teacher_name,
          teacher_phone,
          student.first_name,
          student.last_name,
          student.birth_date,
          sport_branch,
          age_category,
          weight_class || null,
          student.registration_number || null, // ✅ Her öğrenciden alınıyor
          notes || null
        ]
      );
      
      insertedStudents.push({
        id: result.insertId,
        name: `${student.first_name} ${student.last_name}`,
        registration_number: student.registration_number
      });
    }
    
    await connection.commit();
    
    res.status(201).json({
      message: 'Öğrenci kayıtları başarıyla oluşturuldu',
      school_id: schoolId,
      students: insertedStudents
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Öğrenci kaydı oluşturulurken hata:', error);
    res.status(500).json({ error: 'Öğrenci kaydı oluşturulurken hata oluştu' });
  } finally {
    connection.release();
  }
};

// Tüm öğrenci kayıtlarını listele (Admin)
exports.getAllStudents = async (req, res) => {
  try {
    const {
      side,
      district,
      school_id,
      sport_branch,
      age_category,
      weight_class
    } = req.query;
    
    let query = `
      SELECT 
        s.id,
        s.student_first_name,
        s.student_last_name,
        s.birth_date,
        s.sport_branch,
        s.age_category,
        s.weight_class,
        s.registration_number,
        s.teacher_name,
        s.teacher_phone,
        s.notes,
        s.created_at,
        sch.name as school_name,
        sch.district,
        sch.side,
        sch.type as school_type
      FROM students s
      JOIN schools sch ON s.school_id = sch.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (side) {
      query += ' AND sch.side = ?';
      params.push(side);
    }
    
    if (district) {
      query += ' AND sch.district = ?';
      params.push(district);
    }
    
    if (school_id) {
      query += ' AND s.school_id = ?';
      params.push(school_id);
    }
    
    if (sport_branch) {
query += ' AND s.sport_branch = ?';
      params.push(sport_branch);
    }
    
    if (age_category) {
      query += ' AND s.age_category = ?';
      params.push(age_category);
    }
    
    if (weight_class) {
      query += ' AND s.weight_class = ?';
      params.push(weight_class);
    }
    
    query += ' ORDER BY s.created_at DESC';
    
    const [students] = await pool.query(query, params);
    
    res.json(students);
  } catch (error) {
    console.error('Öğrenciler listelenirken hata:', error);
    res.status(500).json({ error: 'Öğrenciler listelenirken hata oluştu' });
  }
};

// İstatistikler
exports.getStatistics = async (req, res) => {
  try {
    // Toplam öğrenci sayısı
    const [totalStudents] = await pool.query('SELECT COUNT(*) as total FROM students');
    
    // Branşlara göre dağılım
    const [byBranch] = await pool.query(`
      SELECT sport_branch, COUNT(*) as count 
      FROM students 
      GROUP BY sport_branch 
      ORDER BY count DESC
    `);
    
    // İlçelere göre dağılım
    const [byDistrict] = await pool.query(`
      SELECT sch.district, COUNT(s.id) as count
      FROM students s
      JOIN schools sch ON s.school_id = sch.id
      GROUP BY sch.district
      ORDER BY count DESC
    `);
    
    // Yakaya göre dağılım
    const [bySide] = await pool.query(`
      SELECT sch.side, COUNT(s.id) as count
      FROM students s
      JOIN schools sch ON s.school_id = sch.id
      GROUP BY sch.side
    `);
    
    // Okul tipine göre dağılım
    const [bySchoolType] = await pool.query(`
      SELECT sch.type, COUNT(s.id) as count
      FROM students s
      JOIN schools sch ON s.school_id = sch.id
      GROUP BY sch.type
    `);
    
    // Kategorilere göre dağılım
    const [byCategory] = await pool.query(`
      SELECT age_category, COUNT(*) as count
      FROM students
      GROUP BY age_category
      ORDER BY count DESC
    `);
    
    // Okul sayısı
    const [totalSchools] = await pool.query(`
      SELECT COUNT(DISTINCT school_id) as total FROM students
    `);
    
    res.json({
      total_students: totalStudents[0].total,
      total_schools: totalSchools[0].total,
      by_branch: byBranch,
      by_district: byDistrict,
      by_side: bySide,
      by_school_type: bySchoolType,
      by_category: byCategory
    });
  } catch (error) {
    console.error('İstatistikler alınırken hata:', error);
    res.status(500).json({ error: 'İstatistikler alınırken hata oluştu' });
  }
};

// Excel export (TÜM VERİLER)
exports.exportAllToExcel = async (req, res) => {
  try {
    const [students] = await pool.query(`
      SELECT 
        sch.side as 'Yaka',
        sch.district as 'İlçe',
        sch.name as 'Okul Adı',
        sch.type as 'Okul Tipi',
        s.teacher_name as 'Öğretmen Adı',
        s.teacher_phone as 'Öğretmen Telefon',
        s.sport_branch as 'Branş',
        s.age_category as 'Kategori',
        s.weight_class as 'Siklet',
        s.student_first_name as 'Öğrenci Adı',
        s.student_last_name as 'Öğrenci Soyadı',
        s.birth_date as 'Doğum Tarihi',
        s.registration_number as 'Sicil No',
        s.notes as 'Notlar',
        s.created_at as 'Kayıt Tarihi'
      FROM students s
      JOIN schools sch ON s.school_id = sch.id
      ORDER BY sch.side, sch.district, sch.name, s.sport_branch
    `);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tüm Kayıtlar');
    
    // Header stilleri
    worksheet.columns = [
      { header: 'Yaka', key: 'Yaka', width: 12 },
      { header: 'İlçe', key: 'İlçe', width: 20 },
      { header: 'Okul Adı', key: 'Okul Adı', width: 35 },
      { header: 'Okul Tipi', key: 'Okul Tipi', width: 15 },
      { header: 'Öğretmen Adı', key: 'Öğretmen Adı', width: 25 },
      { header: 'Öğretmen Telefon', key: 'Öğretmen Telefon', width: 18 },
      { header: 'Branş', key: 'Branş', width: 30 },
      { header: 'Kategori', key: 'Kategori', width: 18 },
      { header: 'Siklet', key: 'Siklet', width: 12 },
      { header: 'Öğrenci Adı', key: 'Öğrenci Adı', width: 20 },
      { header: 'Öğrenci Soyadı', key: 'Öğrenci Soyadı', width: 20 },
      { header: 'Doğum Tarihi', key: 'Doğum Tarihi', width: 15 },
      { header: 'Sicil No', key: 'Sicil No', width: 15 },
      { header: 'Notlar', key: 'Notlar', width: 30 },
      { header: 'Kayıt Tarihi', key: 'Kayıt Tarihi', width: 18 }
    ];
    
    // Header stil
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font.color = { argb: 'FFFFFFFF' };
    
    // Verileri ekle
    students.forEach(student => {
      worksheet.addRow(student);
    });
    
    // Border ekle
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=tum_kayitlar.xlsx'
    );
    
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Excel export hatası:', error);
    res.status(500).json({ error: 'Excel dosyası oluşturulurken hata oluştu' });
  }
};

// Excel export (FİLTRELİ)
exports.exportFilteredToExcel = async (req, res) => {
  try {
    const {
      side,
      district,
      school_id,
      sport_branch,
      age_category,
      weight_class
    } = req.query;
    
    let query = `
      SELECT 
        sch.side as 'Yaka',
        sch.district as 'İlçe',
        sch.name as 'Okul Adı',
        sch.type as 'Okul Tipi',
        s.teacher_name as 'Öğretmen Adı',
        s.teacher_phone as 'Öğretmen Telefon',
        s.sport_branch as 'Branş',
        s.age_category as 'Kategori',
        s.weight_class as 'Siklet',
        s.student_first_name as 'Öğrenci Adı',
        s.student_last_name as 'Öğrenci Soyadı',
        s.birth_date as 'Doğum Tarihi',
        s.registration_number as 'Sicil No',
        s.notes as 'Notlar',
        s.created_at as 'Kayıt Tarihi'
      FROM students s
      JOIN schools sch ON s.school_id = sch.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (side) {
      query += ' AND sch.side = ?';
      params.push(side);
    }
    
    if (district) {
      query += ' AND sch.district = ?';
      params.push(district);
    }
    
    if (school_id) {
      query += ' AND s.school_id = ?';
      params.push(school_id);
    }
    
    if (sport_branch) {
      query += ' AND s.sport_branch = ?';
      params.push(sport_branch);
    }
    
    if (age_category) {
      query += ' AND s.age_category = ?';
      params.push(age_category);
    }
    
    if (weight_class) {
      query += ' AND s.weight_class = ?';
      params.push(weight_class);
    }
    
    query += ' ORDER BY sch.side, sch.district, sch.name, s.sport_branch';
    
    const [students] = await pool.query(query, params);
    
    if (students.length === 0) {
      return res.status(404).json({ error: 'Seçilen filtrelere uygun kayıt bulunamadı' });
    }
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Filtrelenmiş Kayıtlar');
    
    worksheet.columns = [
      { header: 'Yaka', key: 'Yaka', width: 12 },
      { header: 'İlçe', key: 'İlçe', width: 20 },
      { header: 'Okul Adı', key: 'Okul Adı', width: 35 },
      { header: 'Okul Tipi', key: 'Okul Tipi', width: 15 },
      { header: 'Öğretmen Adı', key: 'Öğretmen Adı', width: 25 },
      { header: 'Öğretmen Telefon', key: 'Öğretmen Telefon', width: 18 },
      { header: 'Branş', key: 'Branş', width: 30 },
      { header: 'Kategori', key: 'Kategori', width: 18 },
      { header: 'Siklet', key: 'Siklet', width: 12 },
      { header: 'Öğrenci Adı', key: 'Öğrenci Adı', width: 20 },
      { header: 'Öğrenci Soyadı', key: 'Öğrenci Soyadı', width: 20 },
      { header: 'Doğum Tarihi', key: 'Doğum Tarihi', width: 15 },
      { header: 'Sicil No', key: 'Sicil No', width: 15 },
      { header: 'Notlar', key: 'Notlar', width: 30 },
      { header: 'Kayıt Tarihi', key: 'Kayıt Tarihi', width: 18 }
    ];
    
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font.color = { argb: 'FFFFFFFF' };
    
    students.forEach(student => {
      worksheet.addRow(student);
    });
    
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    
    let filename = 'filtrelenmis_kayitlar';
    if (sport_branch) filename = `${sport_branch.replace(/\s+/g, '_')}`;
    if (age_category) filename += `_${age_category.replace(/\s+/g, '_')}`;
    if (weight_class) filename += `_${weight_class}kg`;
    
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${filename}.xlsx`
    );
    
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Excel export hatası:', error);
    res.status(500).json({ error: 'Excel dosyası oluşturulurken hata oluştu' });
  }
};

// Tek öğrenci detayı
exports.getStudentById = async (req, res) => {
  const studentId = req.params.id;
  
  try {
    const [students] = await pool.query(`
      SELECT 
        s.*,
        sch.name as school_name,
        sch.district,
        sch.side,
        sch.type as school_type
      FROM students s
      JOIN schools sch ON s.school_id = sch.id
      WHERE s.id = ?
    `, [studentId]);
    
    if (students.length === 0) {
      return res.status(404).json({ error: 'Öğrenci bulunamadı' });
    }
    
    res.json(students[0]);
  } catch (error) {
    console.error('Öğrenci detayı alınırken hata:', error);
    res.status(500).json({ error: 'Öğrenci detayı alınırken hata oluştu' });
  }
};

// Öğrenci güncelle
exports.updateStudent = async (req, res) => {
  const studentId = req.params.id;
  const {
    student_first_name,
    student_last_name,
    birth_date,
    weight_class,
    registration_number,
    notes
  } = req.body;
  
  try {
    const [result] = await pool.query(
      `UPDATE students 
       SET student_first_name = ?, 
           student_last_name = ?, 
           birth_date = ?, 
           weight_class = ?, 
           registration_number = ?,
           notes = ?
       WHERE id = ?`,
      [
        student_first_name,
        student_last_name,
        birth_date,
        weight_class || null,
        registration_number || null,
        notes || null,
        studentId
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Öğrenci bulunamadı' });
    }
    
    res.json({ message: 'Öğrenci bilgileri güncellendi' });
  } catch (error) {
    console.error('Öğrenci güncellenirken hata:', error);
    res.status(500).json({ error: 'Öğrenci güncellenirken hata oluştu' });
  }
};

// Öğrenci sil
exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id;
  
  try {
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [studentId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Öğrenci bulunamadı' });
    }
    
    res.json({ message: 'Öğrenci kaydı silindi' });
  } catch (error) {
    console.error('Öğrenci silinirken hata:', error);
    res.status(500).json({ error: 'Öğrenci silinirken hata oluştu' });
  }
};

module.exports = exports;