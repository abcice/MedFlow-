const express = require('express');
const router = express.Router();
const authDataController = require('../auth/dataController.js');
const viewController = require('./viewController.js');

// Show dashboard (protected)
router.get('/', 
    authDataController.auth,
    viewController.index
);

module.exports = router;
