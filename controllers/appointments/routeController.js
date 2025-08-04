const express = require('express');
const router = express.Router();
const authDataController = require('../auth/dataController.js');
const dataController = require('./dataController.js');
const viewController = require('./viewController.js');

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

module.exports = router;
