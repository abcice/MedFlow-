const express = require('express');
const router = express.Router();

const dataController = require('./dataController.js')
const viewController = require('./viewController.js')
const patientsViewController = require('../patients/viewController.js')
const dashboardViewController = require('../dashboard/viewController.js');


// SignUp

router.get('/', viewController.signUp) // show sign up form
router.post('/', dataController.createUser, viewController.redirectToLogin)// signup user => login page

// Login

router.get('/login', viewController.signIn) // show login form
router.post('/login', 
    dataController.loginUser, 
    dashboardViewController.redirectHome
);
//select doctors
router.get('/doctors', dataController.auth, dataController.getDoctors);

// Admin-Only
// Update User 
router.put('/:id', dataController.auth, dataController.requireAdmin, dataController.updateUser);

// Delete User
router.delete('/:id', dataController.auth, dataController.requireAdmin, dataController.deleteUser);

// Change User Role
router.put('/:id/role', dataController.auth, dataController.requireAdmin, dataController.updateUserRole);

module.exports = router;