const { pool } = require('../config/db');

// Yakaya göre ilçeleri getir
exports.getDistrictsBySide = async (req, res) => {
  try {
    const { side } = req.query;
    
    if (!side) {
      return res.status(400).json({ error: 'Yaka parametresi gerekli' });
    }
    
    const [districts] = await pool.query(
      'SELECT DISTINCT district FROM registered_schools WHERE side = ? ORDER BY district',
      [side]
    );
    
    res.json(districts.map(d => d.district));
  } catch (error) {
    console.error('İlçeler alınırken hata:', error);
    res.status(500).json({ error: 'İlçeler alınırken bir hata oluştu' });
  }
};

// Tüm kayıtlı ilçeleri getir
exports.getRegisteredDistricts = async (req, res) => {
  try {
    const [districts] = await pool.query(
      'SELECT DISTINCT district FROM registered_schools ORDER BY district'
    );
    res.json(districts.map(d => d.district));
  } catch (error) {
    console.error('İlçeler alınırken hata:', error);
    res.status(500).json({ error: 'İlçeler alınırken bir hata oluştu' });
  }
};

// Belirli bir ilçenin okullarını getir
exports.getSchoolsByDistrict = async (req, res) => {
  try {
    const { district } = req.query;
    
    if (!district) {
      return res.status(400).json({ error: 'İlçe parametresi gerekli' });
    }
    
    const [schools] = await pool.query(
      'SELECT id, school_name FROM registered_schools WHERE district = ? ORDER BY school_name',
      [district]
    );
    
    res.json(schools.map(s => s.school_name));
  } catch (error) {
    console.error('Okullar alınırken hata:', error);
    res.status(500).json({ error: 'Okullar alınırken bir hata oluştu' });
  }
};