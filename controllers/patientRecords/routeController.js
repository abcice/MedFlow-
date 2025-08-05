const express = require('express');
const router = express.Router();
const authDataController = require('../auth/dataController.js');
const dataController = require('./dataController.js');
const viewController = require('./viewController.js');

/**
 * View full patient history
 * Example: GET /patientRecords/:patientId/history?token=xxx
 */
router.get('/:patientId/history',
    authDataController.auth,
    dataController.showHistory,   // fetches patient + records with private note filtering
    viewController.showHistory
);
//Index route for patient records
// Show patients list for records access
router.get('/',
    authDataController.auth,
    dataController.listPatients,
    viewController.index
);


/**
 * Add new medical record form
 * Example: GET /patientRecords/:patientId/history/new?token=xxx
 */
router.get('/:patientId/history/new',
    authDataController.auth,
    viewController.newView
);

/**
 * Save new patient record
 * Example: POST /patientRecords
 */
router.post('/',
    authDataController.auth,
    dataController.create,
    viewController.redirectToHistory
);
// Edit patient record form
router.get('/:id/edit',
    authDataController.auth,
    dataController.showRecord,
    viewController.editView
);

// Update patient record
router.put('/:id',
    authDataController.auth,
    dataController.updateRecord,
    viewController.redirectToHistory
);
// New Lab or Radiology request form
router.get('/:patientId/history/newRequest',
    authDataController.auth,
    viewController.newRequestView
);

// Save Lab or Radiology request
router.post('/:patientId/history/newRequest',
    authDataController.auth,
    dataController.createRequest,
    viewController.redirectToNewRecord
);



module.exports = router;
