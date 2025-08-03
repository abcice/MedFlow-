const express = require('express');
const router = express.Router();

const dataController = require('./dataController.js')
const viewController = require('./viewController.js')
const patientsViewController = require('../patients/ViewController.js')

// SignUp

router.get('/', viewController.signUp) // show sign up form
router.post('/', dataController.createUser, viewController.redirectToLogin)// signup user => login page

// Login

router.get('/login', viewController.signIn) // show login form
router.post('/login', dataController.loginUser, patientsViewController.redirectHome)
// UPDATE USER (admin)

router.put('/:id', dataController.updateUser)
//Delete User (admin)

router.delete('/:id', dataController.auth, dataController.deleteUser)



module.exports = router;