const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const schoolController = require('../controllers/schoolController');
const nationalApplicationController = require('../controllers/nationalApplicationController');


// Public routes
router.get('/sport-categories', applicationController.getSportCategories);
router.get('/districts', applicationController.getDistricts);
router.post('/applications', applicationController.createApplication);

// Admin routes (tüm başvuruları görmek için)
router.get('/applications', applicationController.getAllApplications);
router.get('/applications/:id', applicationController.getApplicationById);
router.get('/schools', applicationController.getAllSchools);

router.get('/registered-districts', schoolController.getRegisteredDistricts);
router.get('/registered-schools', schoolController.getSchoolsByDistrict);
router.get('/districts-by-side', schoolController.getDistrictsBySide);


// National (Türkiye geneli) routes - YENİ
router.get('/national/provinces', nationalApplicationController.getProvinces);
router.get('/national/districts', nationalApplicationController.getDistrictsByProvince);
router.get('/national/schools', nationalApplicationController.getSchoolsByDistrict);
router.get('/national/sport-categories', nationalApplicationController.getSportCategories);
router.post('/national/applications', nationalApplicationController.createNationalApplication);
router.get('/national/applications', nationalApplicationController.getAllNationalApplications);


module.exports = router;