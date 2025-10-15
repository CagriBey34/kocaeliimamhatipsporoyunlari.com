// src/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config({ path: './src/config/.env' });

// Import routes
const photoRoutes = require('./routes/photoRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const tournamentRoutes = require('./routes/tournamentRoutes'); 
const applicationRoutes = require('./routes/applicationRoutes'); 
const studentRoutes = require('./routes/studentRoutes');



// Initialize app
const app = express();

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));


app.use(cors({
  origin: function(origin, callback) {
    // Localhost'un herhangi bir port numarasına ve üretim domainlerine izin ver
    const allowedOrigins = [/^http:\/\/localhost:\d+$/, 'https://imamhatipsporoyunlari.com'];
    
    // Regex ile kontrol et veya doğrudan eşleme yap
    const originIsAllowed = 
      !origin || // Tarayıcı dışı isteklere izin ver (Postman, vb.)
      allowedOrigins.some(allowed => 
        typeof allowed === 'string' 
          ? allowed === origin 
          : allowed.test(origin)
      );
    
    if (originIsAllowed) {
      callback(null, origin);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true // Bu ayar zaten var, iyi
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
const session = require('express-session');
// server.js içinde
app.use(session({
  secret: process.env.SESSION_SECRET || 'oncü1958*',
  resave: true, // Değişti: false yerine true
  saveUninitialized: true, // Değişti: false yerine true
  cookie: {
    secure: false, // Değişti: Lokalda false olmalı, https olmadığı için
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 gün
  }
}));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', photoRoutes);
app.use('/admin', adminRoutes); 
app.use('/api', tournamentRoutes);
app.use('/api', applicationRoutes); 
app.use('/api/students', studentRoutes);  




// Server setup
const PORT = process.env.PORT || 8561;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;