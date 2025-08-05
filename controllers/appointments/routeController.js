const express = require('express');
const router = express.Router();
const authDataController = require('../auth/dataController.js');
const dataController = require('./dataController.js');
const viewController = require('./viewController.js');

// =========================
// Appointments Routes
// =========================

// Index — show all appointments
router.get('/',
    authDataController.auth,
    dataController.index,
    viewController.index
);

// New Appointment Form
router.get('/new', 
    authDataController.auth, 
    viewController.newView
);

// Create Appointment
router.post('/', 
    authDataController.auth, 
    dataController.create, 
    viewController.redirectHome
);

// Edit Appointment Form
router.get('/:id/edit',
    authDataController.auth,
    dataController.show,
    viewController.edit
);

// Update Appointment
router.put('/:id',
    authDataController.auth,
    dataController.update,       // ✅ Move logic into dataController
    viewController.redirectHome
);
// //schdule 
// router.get('/schedule',
//     authDataController.auth,
//     dataController.index, // already fetches doctors, appointments, date, doctor
//     viewController.schedule
// );

// Delete Appointment
router.delete('/:id', 
    authDataController.auth, 
    dataController.destroy, 
    viewController.redirectHome
);

module.exports = router;
