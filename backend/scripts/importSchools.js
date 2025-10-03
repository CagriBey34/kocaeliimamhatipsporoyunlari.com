const XLSX = require('xlsx');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function importSchools() {
  let connection;
  
  try {
    const excelPath = path.join(__dirname, '../src/data/schools_data.xlsx');
    console.log('📄 Aranan dosya yolu:', excelPath);
    
    if (!fs.existsSync(excelPath)) {
      console.error('❌ Excel dosyası bulunamadı!');
      return;
    }
    
    console.log('✅ Excel dosyası bulundu');

    // MySQL bağlantısı
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3307,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_NAME || 'spor_galeri'
    });

    console.log('✅ MySQL bağlantısı başarılı');

    // Tabloyu oluştur
    await connection.query(`
      CREATE TABLE IF NOT EXISTS registered_schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        district VARCHAR(100) NOT NULL,
        school_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_district (district)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tablo hazır');

    // Excel'i oku - İLK SATIRI ATLA
    const workbook = XLSX.readFile(excelPath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // İlk satırı header olarak belirt
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      range: 1  // İlk satırı (index 0) atla, ikinci satırdan başla
    });
    
    console.log(`📊 Toplam ${jsonData.length} satır bulundu`);
    
    // İlk 3 satırı göster
    console.log('\n🔍 İlk 3 satır:');
    jsonData.slice(0, 3).forEach((row, i) => {
      console.log(`Satır ${i + 1}:`, JSON.stringify(row, null, 2));
    });

    // Tabloyu temizle
    await connection.query('TRUNCATE TABLE registered_schools');
    console.log('\n🗑️  Tablo temizlendi');

    // Her satırı ekle
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      
      try {
        // Tüm olası sütun isimlerini kontrol et
        const district = row['İLÇE'] || row['ILCE'] || row['Adalar'];
        const schoolName = row['OKUL ADI'] || row['OKUL_ADI'] || row['ADALAR AİHL'];

        if (district && schoolName && 
            district !== 'İLÇE' && 
            schoolName !== 'OKUL ADI') {
          
          const cleanDistrict = district.toString().trim();
          const cleanSchoolName = schoolName.toString().trim();
          
          await connection.query(
            'INSERT INTO registered_schools (district, school_name) VALUES (?, ?)',
            [cleanDistrict, cleanSchoolName]
          );
          successCount++;
          
          if (successCount <= 5) {
            console.log(`✓ ${cleanDistrict} - ${cleanSchoolName}`);
          }
        } else {
          errorCount++;
          if (errors.length < 5) {
            errors.push({ row: i + 2, district, schoolName });
          }
        }
      } catch (error) {
        console.error(`❌ Satır ${i + 2} hatası:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📈 İmport Özeti:');
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı/Atlanan: ${errorCount}`);
    
    if (errors.length > 0) {
      console.log('\n⚠️  İlk birkaç hatalı satır:');
      errors.forEach(e => {
        console.log(`  Satır ${e.row}: İlçe="${e.district}", Okul="${e.schoolName}"`);
      });
    }

    // Kontrol
    const [result] = await connection.query('SELECT COUNT(*) as count FROM registered_schools');
    console.log(`\n🏫 Veritabanındaki toplam kayıt: ${result[0].count}`);

    if (result[0].count > 0) {
      const [districts] = await connection.query(
        'SELECT DISTINCT district FROM registered_schools ORDER BY district'
      );
      console.log(`\n📍 Eklenen İlçeler (${districts.length} adet):`);
      districts.forEach(d => console.log(`  - ${d.district}`));

      // İlçe başına okul sayısı
      const [stats] = await connection.query(`
        SELECT district, COUNT(*) as count 
        FROM registered_schools 
        GROUP BY district 
        ORDER BY count DESC 
        LIMIT 10
      `);
      console.log('\n🏆 En çok okulu olan ilk 10 ilçe:');
      stats.forEach(s => console.log(`  ${s.district}: ${s.count} okul`));
    }

  } catch (error) {
    console.error('❌ Import sırasında hata:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 Bağlantı kapatıldı');
    }
  }
}

importSchools();