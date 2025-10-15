const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// ============================================
// PUBLIC ROUTES (Öğretmenler için)
// ============================================

// Branş yapılandırmalarını getir
router.get('/configurations', studentController.getSportConfigurations);

// Öğrenci kaydı oluştur
router.post('/register', studentController.createStudentRegistration);

// ============================================
// ADMIN ROUTES (Admin panel için)
// ============================================

// İstatistikler - ÖNEMLİ: /:id'den ÖNCE olmali!
router.get('/statistics', studentController.getStatistics);

// Excel export - Tüm veriler - ÖNEMLİ: /:id'den ÖNCE olmali!
router.get('/export/all', studentController.exportAllToExcel);

// Excel export - Filtrelenmiş - ÖNEMLİ: /:id'den ÖNCE olmali!
router.get('/export/filtered', studentController.exportFilteredToExcel);

// Tüm öğrencileri listele (filtreleme ile)
router.get('/', studentController.getAllStudents);

// Tek öğrenci detayı - ÖNEMLİ: En SONA koy!
router.get('/:id', studentController.getStudentById);

// Öğrenci güncelle
router.put('/:id', studentController.updateStudent);

// Öğrenci sil
router.delete('/:id', studentController.deleteStudent);

module.exports = router;