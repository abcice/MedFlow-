const express = require('express')
const router = express.Router()
const viewController = require('./viewController.js')
const dataController = require('./dataController.js')
const authDataController = require('../auth/dataController.js')
// add routes
// Index
router.get('/', authDataController.auth,dataController.index, viewController.index); // show all patients

// New
router.get('/new', authDataController.auth, viewController.newView); 
//Delete
router.delete('/:id', dataController.destroy, viewController.redirectHome);
// Update
router.put('/:id', dataController.update, viewController.redirectShow);

// Create
router.post('/', authDataController.auth, dataController.create, viewController.redirectHome);
//Edit
router.get('/:id/edit', authDataController.auth, dataController.show, viewController.edit);

// Show
router.get('/:id', authDataController.auth, dataController.show, viewController.show); 
// export router
module.exports = router;