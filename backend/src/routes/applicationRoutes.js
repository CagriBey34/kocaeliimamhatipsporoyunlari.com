const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// Public routes
router.get('/sport-categories', applicationController.getSportCategories);
router.get('/districts', applicationController.getDistricts);
router.post('/applications', applicationController.createApplication);

// Admin routes (tüm başvuruları görmek için)
router.get('/applications', applicationController.getAllApplications);
router.get('/applications/:id', applicationController.getApplicationById);
router.get('/schools', applicationController.getAllSchools);

module.exports = router;