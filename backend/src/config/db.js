// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config(); 

console.log('🔧 DB Bağlantı Ayarları:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});

// MySQL bağlantı havuzu oluşturma
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3307,  
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'kocaeli_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Veritabanı bağlantısını test et
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL bağlantısı başarılı!');
    
    // Hangi veritabanına bağlı?
    const [dbResult] = await connection.query('SELECT DATABASE() as db');
    console.log('📊 Aktif veritabanı:', dbResult[0].db);
    
    // Tabloları göster
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📋 Tablolar:', tables.map(t => Object.values(t)[0]));
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL bağlantı hatası:', error.message);
    console.error('Bağlantı bilgileri:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
    return false;
  }
};

module.exports = {
  pool,
  testConnection
};