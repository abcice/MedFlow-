const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload.js');
const viewController = require('./viewController.js');
const dataController = require('./dataController.js');
const authDataController = require('../auth/dataController.js');
const patientRecordsDataController = require('../patientRecords/dataController');
const patientRecordsViewController = require('../patientRecords/viewController');

// =========================
// Patients Routes
// =========================

// Index — Show all patients for logged-in user
router.get('/', 
    authDataController.auth,        // Check token, set req.user
    dataController.index,           // Get list of patients
    viewController.index             // Render patient list
);

// search patients by CPR
router.get('/search/cpr', authDataController.auth, dataController.searchByCPR);

// search patients by Phone
router.get('/search/phone', authDataController.auth, dataController.searchByPhone);

// New Patient Form
router.get('/new', 
    authDataController.auth, 
    viewController.newView
);


// Delete Patient
router.delete('/:id', 
    authDataController.auth,        // Any logged-in user can delete patients
    dataController.destroy, 
    viewController.redirectHome
);

// Update Patient
router.put('/:id', 
    authDataController.auth,        // Any logged-in user can update patients
    dataController.update, 
    viewController.redirectShow
);

// Create Patient with photo upload and auth
router.post('/', 
    authDataController.auth, 
    upload.single('photo'), 
    dataController.create, 
    viewController.redirectHome
);


// Edit Patient Form
router.get('/:id/edit', 
    authDataController.auth, 
    dataController.show, 
    viewController.edit
);

// Show Patient Profile
router.get('/:id', 
    authDataController.auth, 
    dataController.show, 
    viewController.show
);
// View Patient Medical History
router.get('/:id/history',
    authDataController.auth,
    patientRecordsDataController.getHistory,
    patientRecordsViewController.history
);


module.exports = router;
