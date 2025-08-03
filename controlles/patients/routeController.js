const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload');
const viewController = require('./viewController.js');
const dataController = require('./dataController.js');
const authDataController = require('../auth/dataController.js');

// =========================
// Patients Routes
// =========================

// Index — Show all patients for logged-in user
router.get('/', 
    authDataController.auth,        // Check token, set req.user
    dataController.index,           // Get list of patients
    viewController.index             // Render patient list
);

// New Patient Form
router.get('/new', 
    authDataController.auth, 
    viewController.newView
);
// upload patient photo
router.post('/', upload.single('photo'), dataController.create, viewController.redirectHome);

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

// Create Patient
router.post('/', 
    authDataController.auth, 
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

module.exports = router;
